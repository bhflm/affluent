const logger = require('../logger');
const usersJobs = require('./users');
const usersModel = require('../db/users');
const dbClient = require('../db');
const { rawDataToBulkFormat } = require('../helpers');

const initializeApp = async () => {
  logger.info('Initializing app');
  try {
    // Initialize database;
    const dbRef = await dbClient.initializeDB();
    // Fetch all users from reqres service;
    logger.info('Fetching all users from external service');
    const usersResponse = await usersJobs.fetchAllUsers();
    const usersBulkData = rawDataToBulkFormat(usersResponse);
    logger.info('Populating database with users data');
    // did not went with a bulk insert cause its only 12 values :shrug: remember to note this down;
    const resModel = await usersModel.bulkInsert(dbRef,usersBulkData);
    console.log('RES MODEL: ', resModel);
    // @TODO: Fetch all data from scrapped website;
    // @TODO: Hydrate with db data html template;
    return {};
  } catch (err) {
    logger.error(`${err}`);
    return Promise.reject(err);
  };
};



initializeApp();
