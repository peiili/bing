const { getBingImg } = require('./utils/getbingImg');
const News = require('./src/getnews');

const runNews = new News();
runNews.start();

getBingImg();
setInterval(() => {
  getBingImg();
}, 1000 * 60 * 60 * 24);
