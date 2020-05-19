const axios = require('axios');
const queryString = require('querystring');
const logger = require('../logger');
const config = require('../config');

exports.getUsers = async (params = {}) => {
  // console.log('PARAMS: ', params);
  const queryOptions = '?page=1'; // @@TODO: queryBuilder
  const pathWithQuery = `/api/users${queryOptions}`;
  try {
    logger.info(`Querying reqress service @ ${pathWithQuery}`);
    const serviceResponse = await axios.get(`${config.API.reqres}${pathWithQuery}`);
    const { data: rawResponse } = serviceResponse;
    let response = [];
    if (rawResponse.data) {
      const { data: usersData } = rawResponse;
      response = usersData;
    }
    console.log('users data; ', response);
    return response;
  } catch (err) {
    logger.error(`Error requesting data from reqress service @ ${pathWithQuery}`);
    return Promise.reject(err);
  }
};
