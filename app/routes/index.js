const { serveSiteData } = require('../controllers');

exports.init = app => {
  app.get('/', serveSiteData);
};
