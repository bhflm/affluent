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

exports.insertOne = async (db, params) => {
  logger.info('Inserting metric');
  const statement = 'INSERT INTO `metrics` (`date`, `comission`, `sales`, `leads`, `clicks`, `epc`, `impressions`, `comission_rate`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  try {
    const [rows, fields] = await db.execute(statement, params);
    return rows;
  }
  catch(error) {
    logger.error(`Error executing statement within metrics table ${error}`);
    return Promise.reject(error);
  }
};

exports.getAll = async db => {
  logger.info('Getting all metrics');
  const statement =
    'SELECT * FROM `metrics`';
  try {
    const [rows, fields] = await db.execute(statement);
    return rows;
  }
  catch(error) {
    logger.error(`Error executing statement within metrics table ${error}`);
    return Promise.reject(error);
  }
};
