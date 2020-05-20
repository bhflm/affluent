const config = require('../config');
const logger = require('../logger');
const mysql = require('mysql2/promise');

exports.createTable = async db => {
  logger.info('Initializing metrics table');
  const statement = "CREATE TABLE `metrics` (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, date DATE, comission FLOAT, sales INTEGER, leads INTEGER, clicks INTEGER, epc FLOAT, impressions INTEGER, comission_rate DECIMAL)";
  try {
    const queryRes = await db.query(statement);
    logger.info('Success creating metrics table');
    return queryRes;
  }
  catch(error) {
    logger.error(`Error executing statement within metrics table ${error}`);
    return Promise.reject(error);
  }
};
