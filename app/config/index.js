require('dotenv').config();

module.exports = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  API: {
    reqres: process.env.REQRES_URL
  },
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME
  }
};
