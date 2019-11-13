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
        const dataList = [];
        JSON.parse(body).images.forEach((e) => {
          dataList.push({
            src: bingHost + e.url,
            name: e.copyright,
          });
          let extName = '';
          const writeStream = function (name) {
            return fs.createWriteStream(name);
          };
          const readStream = request(bingHost + e.url);
          readStream.on('response', (resp) => {
            extName = `.${resp.headers['content-type'].split('/')[1]}`;

            readStream.pipe(writeStream(`${__dirname}/../local/${e.copyright.split('(')[0].trim()}${extName}`));
          });
          readStream.on('error', () => {

          });
          readStream.on('end', () => {
            upload(`${e.copyright.split('(')[0].trim()}${extName}`, `x:/Users/10179/Documents/bing/local/${e.copyright.split('(')[0].trim()}${extName}`);
          });
        });
      }
    });
  },
};
