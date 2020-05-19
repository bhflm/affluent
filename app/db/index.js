const config = require('../config');
const logger = require('../logger');


const mysql = require('mysql');

const healthcheck = db => {
  return db.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      error ? logger.error(error) : logger.info('The solution is: ', results[0].solution);
      return results;
  });
};

const initializeDB = () => {
  logger.info('Initializing Database');
  const db = mysql.createConnection(config.DB);
  db.connect(err => {
    if (err) {
      logger.error(`Error connecting database: ${err}`);
      return;
    }
    logger.info('Connected to database');
  });
  healthcheck(db);
  return db.end();
};

initializeDB();
