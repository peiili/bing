const portfinder = require('portfinder');
const express = require('express');
const request = require('request');
const fs = require('fs');
const { bingHost, bingBase } = require('./config/bingUrl');


const app = express();

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
        readStream.pipe(writeStream(`${__dirname}/local/${e.copyright.split('(')[0]}${extName}`));
      });
      readStream.on('error', (err) => {
        console.log(err);
      });
      readStream.on('end', () => {

      });
    });
  }
});

portfinder.getPort({
  port: 3000, // minimum port
  stopPort: 3333, // maximum port
}, (err, freePortal) => {
  if (err) {
    throw err;
  } else {
    app.listen(freePortal, () => {
      console.log(`you app run http://localhost:${freePortal}`);
    });
  }
});
