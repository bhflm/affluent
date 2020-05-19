const logger = require('../logger');

const initializeApp = async () => {
  logger.info('Initializing app');
  try {
    // @TODO: Fetch all users from reqres service;
    // @TODO: Fetch all data from scrapped website;
    // @TODO: Hydrate with db data html template;
    return {};
  } catch (err) {
    logger.error(`Error: ${err}`);
    return Promise.reject(err);
  };
};



initializeApp();
