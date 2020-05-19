const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./server/logger');
const routes = require('./server/routes');

const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10;
const DEFAULT_PARAMETER_LIMIT = 10000;

const bodyParserJsonConfig = () => ({
  parameterLimit: DEFAULT_PARAMETER_LIMIT,
  limit: DEFAULT_BODY_SIZE_LIMIT
});

const bodyParserUrlencodedConfig = () => ({
  extended: true,
  parameterLimit: DEFAULT_PARAMETER_LIMIT,
  limit: DEFAULT_BODY_SIZE_LIMIT
});

const init = () => {
  // Set up the express app
  const app = express();
  // Log requests to the console.
  app
    .use(cors())
    .use(bodyParser.json(bodyParserJsonConfig()))
    .use(bodyParser.urlencoded(bodyParserUrlencodedConfig()));

  const port = 8080;

  app.get('/', (req, res) => {
    logger.info('Healthcheck ok');
    res.json({});
  });

  routes.init(app);

  app.listen(port);

  module.exports = app;
  logger.info(`Server running @ port:${port}`);
};

init();
