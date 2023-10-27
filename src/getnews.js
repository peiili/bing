const https = require('https');
const cheerio = require('cheerio');
const { uploadImg } = require('../utils/database');

function News() {
  this.hasBeenGet = false;
}
News.prototype.getNews = function (target) {
  https.get(target, (res) => {
    let body = new Buffer.alloc(0);
    res.on('data', (chunk) => {
      body = Buffer.concat([body, chunk]);
    });
    res.on('end', () => {
      const html = body.toString();
      const $ = cheerio.load(html);
      const content = $('.post_body');
      const allList = content.children().eq(1).html().split('<br>');
      const list = allList.filter((e, i) => {
        if (e != '' && i >= 2) {
          return true;
        }
      });
      const data = {
        datetime: list[0],
        content: JSON.stringify(list.slice(1, list.length - 1)),
        weiyu: list.pop(),
      };
      const sql = `INSERT INTO
      news (datetime, content, weiyu, createdate, createtime)
    SELECT
      '${data.datetime}',
      '${data.content}',
      '${data.weiyu}',
      CURRENT_DATE(),
      CURRENT_TIME()
    FROM
      dual
    WHERE
      not exists (
        select
          *
        from
          news
        where
          news.createdate = CURRENT_DATE()
      )`;
      uploadImg(sql, [], (res) => {
        console.log(res);
      });
    });
  });
};
News.prototype.getCatalog = function () {
  https.get('https://www.163.com/dy/media/T1603594732083.html', (res) => {
    let body = new Buffer.alloc(0);
    res.on('data', (chunk) => {
      body = Buffer.concat([body, chunk]);
    });
    res.on('end', () => {
      const html = body.toString();
      const $ = cheerio.load(html);
      const content = $('.js-item');
      const el = content.eq(0);
      const target = el.find('a').attr('href');
      const releaseTime = el.find('.time').text();
      const releaseDate = new Date(releaseTime).getDate();
      if (releaseDate === new Date().getDate()) {
        this.getNews(target);
        this.hasBeenGet = true;
      }
    });
  });
};
News.prototype.start = function () {
  setInterval(() => {
    const date = new Date();
    const hours = date.getHours();
    if (hours === 0) {
      this.hasBeenGet = false;
    }
    if (hours > 7 && !this.hasBeenGet) {
      this.getCatalog();
    }
  }, 60 * 1e3);
};

module.exports = News;
