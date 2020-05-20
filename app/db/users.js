const mysql = require('mysql2/promise');
const logger = require('../logger');

exports.createTable = async db => {
  logger.info('Initializing users table');
  const statement =
    'CREATE TABLE `users` (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30), last_name VARCHAR(20), first_name VARCHAR(20), avatar VARCHAR';
  try {
    const queryRes = await db.query(statement);
    logger.info('Success creating users table');
    return queryRes;
  }
  catch(error) {
    logger.error(`Error executing statement within users table ${error}`);
    return Promise.reject(error);
  }
};

// !! check comment that bulk insert if not working bc of mysql version @ the host :thinking;
// exports.bulkInsert = async (db, params) => {
//   logger.info('Bulk users insert');
//   const statement = 'INSERT INTO `users` (`email` ,`first_name`, `last_name`, `avatar`) VALUES ()';
//   try {
//     const [rows, fields] = await db.execute(statement, params);
//     logger.info('Bulk insert success');
//     return {};
//   }
//   catch(error) {
//     logger.error(`Error executing statement within users table ${error}`);
//     return Promise.reject(error);
//   }
// };

exports.insertOne = async (db, params) => {
  logger.info('Inserting one user');
  const statement = 'INSERT INTO `users` (`email`, `last_name`, `first_name`, `avatar`) VALUES (?, ?, ?, ?)';
  try {
    const [rows, fields] = await db.execute(statement, params);
    return rows;
  }
  catch(error) {
    logger.error(`Error executing statement within users table ${error}`);
    return Promise.reject(error);
  }
};

exports.getAll = async db => {
  logger.info('Getting all users');
  const statement =
    'SELECT * FROM `users`';
  try {
    const [rows, fields] = await db.execute(statement);
    return rows;
  }
  catch(error) {
    logger.error(`Error executing statement within users table ${error}`);
    return Promise.reject(error);
  }
};
