const config = require('../config');
const logger = require('../logger');
const mysql = require('mysql2/promise');
const usersModel = require('./users');
const metricsModel = require('./metrics');

const formatTableExistance = tableRows => !!tableRows.length ? 'found' : 'not found';

const checkTables = async (db) => {
  logger.info('Checking database tables status');
  const usersStatement = `SHOW TABLES LIKE 'users'`;
  const metricsStatement = `SHOW TABLES LIKE 'metrics'`;
  try {
    // execute gets in charge of escaping harming characters in any case of a sql injection attempt
    const [usersRows, usersFields] = await db.execute(usersStatement);
    const [metricsRows, metricsFields] = await db.execute(metricsStatement);
    logger.info(`Users table ${formatTableExistance(usersRows)}`);
    logger.info(`Metrics table ${formatTableExistance(metricsRows)}`);
    return !!usersRows.length && !!metricsRows.length;
  }
  catch(error) {
    logger.error(`Error executing statement ${error}`);
    return Promise.reject(error);
  }
};

exports.initializeDB = async () => {
  logger.info('Initializing database');
  try {
    const db = await mysql.createConnection(config.DB);
    const healthcheck = await checkTables(db);
    if (!healthcheck) {
      await usersModel.createTable(db);
      await metricsModel.createTable(db);
    }
    logger.info('Success initializing database');
    return db;
  }
  catch(error) {
    logger.error(`Error initializing database: ${error}`);
    return Promise.reject(error);
  }
};
