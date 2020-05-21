const logger = require('../logger');
const usersService = require('../services/users');
const dbClient = require('../db');
const usersModel = require('../db/users');
const { prepareUsersRawData } = require('../helpers');

const asyncFetchAndStore = async (dbRef, { currentPage = null, usersRemaining = null }) => {
  try {
    // If there are no users left we close the connection and end the function
    if (typeof usersRemaining === 'number' && usersRemaining <= 0) {
      await dbRef.end();
      return;
    }
    const query = `?page=${currentPage || 1}`;
    const usersResponse = await usersService.getUsers(query);
    const { page, usersPerPage, usersTotal } = usersResponse;
    // If users remaining is undef, means it is the first execution
    let remaining = usersRemaining || usersTotal;
    if (usersResponse.data) {
      const users = prepareUsersRawData(usersResponse.data);
      await users.map(newUser => usersModel.insertOne(dbRef, newUser))
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
    await asyncFetchAndStore(dbRef, {});
    return true;
  } catch (error) {
    logger.error(`Error while fetching and storing users: ${error}`);
    return Promise.reject(error);
  }
};
