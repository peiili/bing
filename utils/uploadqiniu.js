const qiniu = require('qiniu');
const { accesskey, SecretKey } = require('./../config/bingUrl');

const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;

module.exports = {
  upload: (src) => {
    const localFile = src;
    const formUploader = new qiniu.form_up.FormUploader(config);
    const putExtra = new qiniu.form_up.PutExtra();
    const key = 'test.mp4';
    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr,
      respBody, respInfo) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(respBody);
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  },
};
