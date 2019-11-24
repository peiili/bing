const production = {
  host: '127.0.0.1',
  password: 'ZZZ123456',
  user: 'root',
  database: 'xek',
};
const devs = {
  host: '47.105.113.47',
  password: 'ZZZ123456',
  user: 'root',
  database: 'xek_test',
};
let env = '';
env = process.env.NODE_ENV;
console.log(env);
console.log(env.trim());

module.exports = {
  databaseConfig: env.trim() === 'dev' ? devs : production,
};
