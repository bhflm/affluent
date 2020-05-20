const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./app/logger');

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

  // set the view engine to ejs
  app.set('view engine', 'ejs');
  // Log requests to the console.
  app
    .use(cors())
    .use(bodyParser.json(bodyParserJsonConfig()))
    .use(bodyParser.urlencoded(bodyParserUrlencodedConfig()))

  const port = 8080; // @TODO: Remove hardcoded port and replace it for .env value


  app.get('/', (req, res) => {
    return res.render('index');
  });

  app.listen(port);

  module.exports = app;
  logger.info(`Server running @ port:${port}`);
};

init();
