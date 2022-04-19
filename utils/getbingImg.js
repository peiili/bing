const request = require('request');
const fs = require('fs');
const { upload } = require('./uploadqiniu');
const { bingHost, bingBase } = require('./../config/bingUrl');

module.exports = {
  getBingImg: () => {
    request(bingHost + bingBase, (error, res, body) => {
      if (error) {
        throw error;
      } else {
        JSON.parse(body).images.forEach((e) => {
          let extName = '';
          const writeStream = (name) => fs.createWriteStream(name);
          const readStream = request(bingHost + e.url);
          readStream.on('response', (resp) => {
            extName = `.${resp.headers['content-type'].split('/')[1]}`;
            readStream.pipe(writeStream(`${__dirname}/../local/${e.startdate}${extName}`));
          });
          readStream.on('error', () => {

          });
          readStream.on('end', () => {
            upload(`${e.startdate}${extName}`, `${__dirname}/../local/${e.startdate}${extName}`, e.copyright);
          });
        });
      }
    });
  },
};
