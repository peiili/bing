const production = {
  host: 'rm-bp1r11zh6j1nnf09l1o.mysql.rds.aliyuncs.com',
  password: process.env.DB_PASSWORD,
  user: 'xek',
  database: 'xek',
};
module.exports = {
  databaseConfig: production,
};
