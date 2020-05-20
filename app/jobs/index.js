const logger = require('../logger');
const usersJobs = require('./users');
const usersModel = require('../db/users');
const dbClient = require('../db');

const initializeApp = async () => {
  logger.info('Initializing app');
  try {
    // Initialize database;
    const dbRef = await dbClient.initializeDB();
    logger.info('Fetching and storing all users from external service');
    await usersJobs.fetchAndStoreUsers(dbRef);
    // @TODO: Fetch all data from scrapped website;
    // @TODO: Hydrate with db data html template;
    return {};
  } catch (error) {
    logger.error(`${error}`);
    return Promise.reject(error);
  }
};

exports.fetchToRenderData = async () => {
  try {
    const dbRef = await dbClient.newDBConnection();
    const usersData = await usersModel.getAll(dbRef);
    // const metricsData = await metricsModel.getAll(dbRef);
    await dbRef.end();
    return { users: usersData };
  }
  catch(error) {
    logger.error(`${error}`);
    return Promise.reject(error);
  }
};


// fetchToRenderData();
// initializeApp();
