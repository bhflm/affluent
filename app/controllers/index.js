const Util = require('util');
const logger = require('../logger');
const reqresService = require('../services/reqres');

exports.serveSiteData = async (req, res) => {
  logger.info(`Request for serving site data`);
  try {
    // First we fetch all users from reqres service;
    const reqresRespponse = await reqresService.getUsers();
    // We insert them onto the database,


    return res.json({});
  } catch (err) {
    logger.error(`Error: ${err}`);
    return res.status(500).send(err);
  }
};
