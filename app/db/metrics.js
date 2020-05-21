const config = require('../config');
const logger = require('../logger');
const mysql = require('mysql2/promise');

exports.createTable = async db => {
  logger.info('Initializing metrics table');
  const statement = "CREATE TABLE `metrics` (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, date VARCHAR(20), comission VARCHAR(20), sales VARCHAR(20), leads VARCHAR(20), clicks VARCHAR(20), epc VARCHAR(20), impressions VARCHAR(20), comission_rate VARCHAR(20))";
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
