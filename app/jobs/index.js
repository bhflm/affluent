const config = require('../config');
const logger = require('../logger');
const usersJobs = require('./users');
const metricsJobs = require('./metrics');
const usersModel = require('../db/users');
const metricsModel = require('../db/metrics');
const dbClient = require('../db');
const { formattedMetrics } = require('../helpers');

exports.initializeApp = async () => {
  logger.info('Initializing app');
  try {
    const dbRef = await dbClient.initializeDB();
    const usersEmpty = await dbClient.tableIsEmpty(dbRef, 'users');
    const metricsEmpty = await dbClient.tableIsEmpty(dbRef, 'metrics');
    if (usersEmpty) {
      logger.info('Seeding database with Users');
      await usersJobs.fetchAndStoreUsers(dbRef);
    }
    if (metricsEmpty) {
      logger.info('Seeding database with Metrics');
      const metricsTargetDate = 'main?startDate=2020-04-01&endDate=2020-04-30';
      await metricsJobs.scrapAndStoreMetrics(dbRef, config.METRICS, metricsTargetDate);
    }
    return Promise.resolve();
  } catch (error) {
    logger.error(`${error}`);
    return Promise.reject(error);
  }
};

exports.fetchUsersAndMetricsData = async () => {
  try {
    const dbRef = await dbClient.newDBConnection();
    const usersData = await usersModel.getAll(dbRef);
    const metricsData = await metricsModel.getAll(dbRef);
    await dbRef.end();
    return { users: usersData, metrics: metricsData };
  }
  catch(error) {
    logger.error(`${error}`);
    return Promise.reject(error);
  }
};
