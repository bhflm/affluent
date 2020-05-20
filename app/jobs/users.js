const logger = require('../logger');
const reqresService = require('../services/reqres');

exports.fetchAllUsers = async () => {
  try {
    // Fetch all users from reqres service;
    let users;
    let pages;
    let currentPage = 1;
    while (!pages || currentPage <= pages) {
      let page = `?page=${currentPage}`;
      let usersResponse = await reqresService.getUsers(page);
      if (!pages && usersResponse.totalPages) pages = usersResponse.totalPages;
      if (usersResponse.usersData) {
        const usersData = { usersResponse };
        users = [users, ...usersResponse.usersData];
      }
      if (usersResponse.page) currentPage +=1;
    };
    return users;
  } catch (err) {
    logger.error(`Error: ${err}`);
    return Promise.reject(err);
  };
};
