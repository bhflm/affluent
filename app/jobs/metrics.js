const puppeteer = require('puppeteer');
const config = require('../config');
const logger = require('../logger');
const dbClient = require('../db');
const  { startBrowser, fetchAndStoreTabs } = require('../scrapper');

const crawlTableAndStoreData = async (page, dbRef, targetUrl) => {
  logger.info('Scraping metrics');
  try {
    await page.goto(targetUrl);
    await page.waitForSelector(DATA_TABLE);
    await fetchAndStoreTabs(page, dbRef);
    logger.info('Success fetching metrics data');
  } catch (error) {
    logger.error(`Error while fetching metrics: ${error}`);
    Promise.reject(error);
  }
};

exports.scrapAndStoreMetrics = async (dbRef, { username, password, url }, targetDateQuery) => {
  logger.info('Intializing metrics scrapper');
  try {
    const { browser, page } = await startBrowser();
    const dbRef = await dbClient.initializeDB();
    await logIn(page, url, username, password);
    await crawlTableAndStoreData(page, dbRef, `${url}/${targetDateQuery}`);
    process.exit(1);
  }
  catch (error) {
    logger.error(`Error while scrapping metrics: ${error}`);
    return Promise.reject(err);
  }
}
