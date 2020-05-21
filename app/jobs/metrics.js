const config = require('../config');
const logger = require('../logger');
const dbClient = require('../db');
const  { startBrowser, closeBrowser, logIn, crawlTableAndStoreData } = require('../scrappers');

exports.scrapAndStoreMetrics = async (dbRef, { username, password, url }, targetDateQuery) => {
  logger.info('Intializing metrics scrapper');
  try {
    const { browser, page } = await startBrowser();
    const dbRef = await dbClient.initializeDB();
    await logIn(page, url, username, password);
    await crawlTableAndStoreData(page, dbRef, `${url}/${targetDateQuery}`);
    await closeBrowser(page);
  }
  catch (error) {
    logger.error(`Error while scrapping metrics: ${error}`);
    return Promise.reject(err);
  }
}
