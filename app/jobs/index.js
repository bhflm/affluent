const logger = require('../logger');
const usersJobs = require('./users');
const usersModel = require('../db/users');
const dbClient = require('../db');

const initializeApp = async () => {
  logger.info('Initializing app');
  try {
    // Initialize database;
    const dbRef = await dbClient.initializeDB();
    // Fetch all users from reqres service;
    logger.info('Fetching all users from external service');
    await usersJobs.fetchAndStoreUsers(dbRef);
    // @TODO: Fetch all data from scrapped website;
    // @TODO: Hydrate with db data html template;
    return {};
  } catch (err) {
    logger.error(`${err}`);
    return Promise.reject(err);
  }
};



initializeApp();
