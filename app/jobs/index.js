const config = require('../config');
const logger = require('../logger');
const usersJobs = require('./users');
const metricsJobs = require('./metrics');
const usersModel = require('../db/users');
const metricsModel = require('../db/metrics');
const dbClient = require('../db');
const { formattedMetrics } = require('../helpers');

const initializeApp = async () => {
  logger.info('Initializing app');
  try {
    // Initialize database;
    const metricsTargetDate = 'main?startDate=2020-04-01&endDate=2020-04-30';
    const dbRef = await dbClient.initializeDB();
    // await usersJobs.fetchAndStoreUsers(dbRef);
    await metricsJobs.scrapAndStoreMetrics(dbRef, config.METRICS, metricsTargetDate)
    // @TODO: Fetch all data from scrapped website;
    // @TODO: Hydrate with db data html template;
    return Promise.resolve();
  } catch (error) {
    logger.error(`${error}`);
    return Promise.reject(error);
  }
};

exports.fetchToRenderData = async () => {
  try {
    const dbRef = await dbClient.newDBConnection();
    // const usersData = await usersModel.getAll(dbRef);
    const metricsData = await metricsModel.getAll(dbRef);
    await dbRef.end();
    // return { users: usersData };
    return { metrics: metricsData };
  }
  catch(error) {
    logger.error(`${error}`);
    return Promise.reject(error);
  }
};



// fetchToRenderData();
initializeApp();
