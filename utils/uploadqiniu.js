const qiniu = require('qiniu');
const { uploadImg } = require('./database');

const { accesskey, SecretKey } = require('./../config/bingUrl');

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
const options = {
  scope: 'xek',
  returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
  callbackBodyType: 'application/json',
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const mac = new qiniu.auth.digest.Mac(accesskey, SecretKey);
const uploadToken = putPolicy.uploadToken(mac);
module.exports = {
  upload: (name, src, desc) => {
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
            const sql = 'insert into `xek_bing` (`id`,`name`,`describe`,`bash`,`create_date`) values (?,?,?,?,NOW());';
            const value = [new Date().getTime(), respBody.key, JSON.stringify(desc), respBody.hash];

            uploadImg(sql, value, (resp) => {
              console.log(resp);
            });
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
          }
        });
      }
    });
  },
};
