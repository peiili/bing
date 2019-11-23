const mysql = require('mysql');

const { databaseConfig } = require('../config/database.js');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
});
function uploadImg(respBody, describe) {
  const sql = 'insert into `xek`.`xek_bing` (`id`,`name`,`describe`,`bash`,`create_date`) values (?,?,?,?,NOW());';
  console.log(respBody.hash);
  const value = [new Date().getTime(), respBody.key, JSON.stringify(describe), respBody.hash];
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } else {
      const query = connection.query(sql, value, (error, results) => {
        if (error) {
          throw error;
        } else {
        }
      });
      console.log(query.sql);
    }
  });
}
module.exports = {
  uploadImg,
};
