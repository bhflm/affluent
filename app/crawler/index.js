const puppeteer = require('puppeteer');
const config = require('../config');
const logger = require('../logger');
const dbClient = require('../db');
const { prepareRowData } = require('../helpers');
// const metricsModel = require('../db/metrics');

const {
  USERNAME_LOGIN,
  PWD_LOGIN,
  LOGIN_BUTTON,
  DATEPICKER,
  DATEPICKER_RANGE_START,
  DATEPICKER_RANGE_END,
  BYDATE_TABLE_ENTRIES_DROPDOWN,
  BYDATE_TABLE_ALL_ENTRIES,
  DATA_TABLE_TAB
} = require('./constants');

const startBrowser = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  return { browser, page };
}

const closeBrowser = async browser => {
  return browser.close();
}

const logIn = async (page, url, username, password) => {
  try {
    logger.info('Logging in to website');
    page.setViewport({ width: 1366, height: 768 });
    await page.goto(url);
    await page.click(USERNAME_LOGIN);
    await page.keyboard.type(username);
    await page.click(PWD_LOGIN);
    await page.keyboard.type(password);
    await page.click(LOGIN_BUTTON);
    await page.waitForNavigation();
  } catch (error) {
    logger.error(`Error while logging in: ${error}`);
    Promise.reject(error);
  }
}

const fetchAndStoreTabs = async (page, dbRef, currentTab = null) => {
  // 4 is the first next tab on the css selector provided (see DATA_TABLE_TAB(4));
  logger.info('Fetching and storing data table');
  if (currentTab == false) return 
  const current = currentTab || 4;
  const crawled = await page.evaluate((current) => {
    const tab = document.querySelector(`#DataTables_Table_0_wrapper > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(${current}) > a:nth-child(1)`);
    //check if there's a tab
    if (tab) {
      tab.click();
      const trs = Array.from(document.querySelectorAll('#DataTables_Table_0 > tbody > tr'));
      console.log('RETURNING ROWS: ', trs);
      // Get all the data from the data table within the current tab
      return trs.map(t => t.innerText);
    }
    console.log('RETURNING EMPTY ARRAY');
    return [];
  });
  console.log('CRAWLED.LENGTH: ', crawled.length);
  if (crawled.length > 0) {
    const metrics = crawled.map(prepareRowData);
    // @TODO IMPROVEMENT: Check for bulk insert within the current MYSQL version provided by hosting
    // Doing one insert per row works for this but not for bigger volumes of data
    await metrics.map(newMetric => metricsModel.insertOne(dbRef, newMetric))
    await fetchAndStoreTabs(page, dbRef, current + 1);
  }
  await fetchAndStoreTabs(page, dbRef, false);
};

const crawlTableAndStoreData = async (page, dbRef, targetUrl) => {
  logger.info('Selecting desired dates');
  try {

    await page.goto(targetUrl);
    // wait until data table loads
    await page.waitForSelector('#DataTables_Table_0 > tbody > tr:nth-child(1)');
    await fetchAndStoreTabs(page, dbRef);
    logger.info('Success fetching metrics data');
  } catch (error) {
    logger.error(`Error while fetching metrics: ${error}`);
    Promise.reject(error);
  }
};

(async () => {
  const { METRICS } = config;
  const { username, password, url } = METRICS;
  const targetDateQuery = 'main?startDate=2020-04-01&endDate=2020-04-30';
  try {
    const { browser, page } = await startBrowser();
    const dbRef = await dbClient.initializeDB();
    await logIn(page, url, username, password);
    await crawlTableAndStoreData(page, dbRef, `${url}/${targetDateQuery}`);
    process.exit(1);
  }
  catch (error) {
    logger.error(`Error crawling website: ${error}`);
    process.exit(1);
  }
})();
