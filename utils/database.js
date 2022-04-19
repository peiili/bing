const mysql = require('mysql');

const { databaseConfig } = require('../config/database.js');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: databaseConfig.host,
  user: databaseConfig.user,
  password: databaseConfig.password,
  database: databaseConfig.database,
});
function uploadImg(sql, value, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } else {
      const query = connection.query(sql, value, (error, results) => {
        if (error) {
          throw error;
        } else {
          callback(results);
        }
      });
      console.log(query.sql);
    }
  });
}
module.exports = {
  uploadImg,
};
