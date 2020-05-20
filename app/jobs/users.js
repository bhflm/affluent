const logger = require('../logger');
const reqresService = require('../services/users');
const dbClient = require('../db');
const usersModel = require('../db/users');
const { rawDataToBulkFormat } = require('../helpers');

const asyncFetchAndStore = async (dbRef, { currentPage = null, usersRemaining = null }) => {
  // End recursive fetchAndStore if there are no users left
  try {
    if (typeof usersRemaining === 'number' && usersRemaining <= 0) return;
    const query = `?page=${currentPage || 1}`;
    const usersResponse = await reqresService.getUsers(query);
    const { page, usersPerPage, usersTotal } = usersResponse;
    // if users remaining is undef, means it is the first execution
    let remaining = usersRemaining || usersTotal;
    if (usersResponse.data) {
      const users = rawDataToBulkFormat(usersResponse.data);
      // await usersModel.bulkInsert(dbRef, users);
      remaining -= usersPerPage * page;
    }
    await asyncFetchAndStore(dbRef, { currentPage: page + 1, usersRemaining: remaining });
  } catch (error) {
    logger.error(`Error withing asyncFetchAndStore: ${error}`)
    Promise.reject(error);
  }
};

exports.fetchAndStoreUsers = async dbRef => {
  try {

    logger.info('Populating database with users data');
    // Fetch all users from reqres service;
    await asyncFetchAndStore(dbRef, {});
    return [];
  } catch (err) {
    logger.error(`Error: ${err}`);
    return Promise.reject(err);
  };
};
