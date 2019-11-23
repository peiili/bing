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
        // console.log(process.env.NODE_ENV);
        JSON.parse(body).images.forEach((e) => {
          dataList.push({
            src: bingHost + e.url,
            name: e.copyright,
          });
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
            upload(`${e.startdate}${extName}`, `x:/Users/10179/Documents/bing/local/${e.startdate}${extName}`, e.copyright);
          });
        });
      }
    });
  },
};
