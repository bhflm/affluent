const config = require('../config');
const logger = require('../logger');
const mysql = require('mysql2/promise');

const { insertOne } = require('./users');

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

// @TODO: Initialize dbs if they're missing

const createUsersTable = async db => {
  logger.info('Initializing users table');
  const statement = "CREATE TABLE `users` (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(20), last_name VARCHAR(20), email VARCHAR(30), avatar VARCHAR(50))";
  try {
    const queryRes = await db.query(statement);
    console.log('QUERY RES: ', queryRes);
    logger.info('Success creating users table');
    return queryRes;
  }
  catch(error) {
    logger.error(`Error executing statement within users table ${error}`);
    return Promise.reject(error);
  }
};


// @TODO: Initialize dbs if they're missing

const createMetricsTable = async db => {
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

const initializeDB = async () => {
  logger.info('Initializing database');
  try {
    const db = await mysql.createConnection(config.DB);
    const healthcheck = await checkTables(db);
    if (!healthcheck) {
      await createUsersTable(db);
      await createMetricsTable(db);
    }
    logger.info('Success initializing database');
    return await db.end();
  }
  catch(error) {
    logger.error(`Error initializing database: ${error}`);
    return Promise.reject(error);
  }
};

initializeDB();
