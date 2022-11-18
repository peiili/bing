const qiniu = require('qiniu');
const { Image, createCanvas } = require('canvas');
const { uploadImg } = require('./database');
const { imageToHash } = require('./convertblurhash');
const { accesskey, SecretKey } = require('../config/bingUrl');

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
const options = {
  scope: 'xek',
  returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  callbackBodyType: 'application/json',
};

module.exports = {
  upload: (name, src, desc) => {
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const mac = new qiniu.auth.digest.Mac(accesskey, SecretKey);
    const uploadToken = putPolicy.uploadToken(mac);
    // console.log(src);
    const localFile = src;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = name;
    // 文件上传
    const selectSql = 'SELECT * FROM xek_bing WHERE name = ?';

    uploadImg(selectSql, [key], (res) => {
      if (!res.length) {
        formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode === 200) {
            const image = new Image();
            image.onload = function () {
              const canvas = createCanvas(400, 225);
              const ctx = canvas.getContext('2d');
              ctx.drawImage(image, 0, 0);
              const base = canvas.toDataURL();
              imageToHash(base, ({ shortHash, shortWidth, shortHeight }) => {
                const sql = 'insert into `xek_bing` (`id`,`name`,`describe`,`bash`,`short_blurhash`,`short_blurhash_w`,`short_blurhash_h`,`width`,`height`,`create_date`) values (?,?,?,?,?,?,?,?,?,NOW());';
                const value = [new Date().getTime(), respBody.key, JSON.stringify(desc), respBody.hash, shortHash, shortWidth, shortHeight, image.width, image.height];
                uploadImg(sql, value, () => {
                  console.log(`${name}======== done`);
                });
              });
            };
            image.onerror = (err) => { throw err; };
            image.src = src;
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
          }
        });
      }
    });
  },
};
