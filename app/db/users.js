const logger = require('../logger');
const mysql = require('mysql2/promise');

exports.createTable = async db => {
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

exports.insertOne = async (db, params = "") => {
  logger.info('Inserting one user');
  const statement = "INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `avatar`) VALUES ('foo', 'bar', 'foobar', 'thisistheavatar')";
  try {
    const [rows, fields] = await db.query(statement);
    console.log('rows: ', rows);
    console.log('fields: ', fields);
    logger.info('Success inserting user');
    return {};
  }
  catch(error) {
    logger.error(`Error executing statement within users table ${error}`);
    return Promise.reject(error);
  }
};
