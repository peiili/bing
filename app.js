const portfinder = require('portfinder');
const express = require('express');
const { getBingImg } = require('./utils/getbingImg');

const app = express();

getBingImg();
setInterval(() => {
  getBingImg();
}, 1000 * 60 * 60 * 24);
portfinder.getPort({
  port: 3000,
  stopPort: 3333,
}, (err, freePortal) => {
  if (err) {
    throw err;
  } else {
    app.listen(freePortal, () => {
      console.log(`you app run http://localhost:${freePortal}`);
    });
  }
});
