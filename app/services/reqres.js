const axios = require('axios');
const queryString = require('querystring');
const logger = require('../logger');
const config = require('../config');

exports.getUsers = async (params) => {
  const queryOptions = params || '';
  const pathWithQuery = `/api/users${queryOptions}`;
  try {
    logger.info(`Querying reqress service @ ${pathWithQuery}`);
    const serviceResponse = await axios.get(`${config.API.reqres}${pathWithQuery}`);
    const { data: rawResponse } = serviceResponse;
    let response = [];
    if (rawResponse.data) {
      const { data: usersData, total_pages: totalPages, page } = rawResponse;
      response = { usersData, totalPages, page };
    }
    return response;
  } catch (err) {
    logger.error(`Error requesting data from reqress service @ ${pathWithQuery}`);
    return Promise.reject(err);
  }
};
