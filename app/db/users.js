const logger = require('../logger');
const mysql = require('mysql2/promise');

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
