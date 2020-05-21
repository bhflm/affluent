const puppeteer = require('puppeteer');
const config = require('../config');
const logger = require('../logger');
const dbClient = require('../db');
const metricsModel = require('../db/metrics');
const { prepareMetricsData } = require('../helpers');
const {
  USERNAME_LOGIN,
  PWD_LOGIN,
  LOGIN_BUTTON,
  DATA_TABLE,
  DATA_TABLE_TAB,
  FIRST_DATA_TABLE_TAB
} = require('./selectors');

exports.startBrowser = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  return { browser, page };
}

exports.closeBrowser = async browser => {
  return browser.close();
}

exports.logIn = async (page, url, username, password) => {
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
  logger.info('Fetching and storing data table');
  try {
    if (currentTab == false) return
    const current = currentTab || FIRST_DATA_TABLE_TAB;
    const tab = await page.$(DATA_TABLE_TAB(current));
    let tabsData = [];
    if (tab) {
      await tab.click();
      tabsData = await page.evaluate(() => {
          const trs = Array.from(document.querySelectorAll('#DataTables_Table_0 > tbody > tr'));
          return trs.map(t => t.innerText);
      });
    }
    if (tabsData.length > 0) {
      const metrics = tabsData.map(prepareMetricsData);
      // @TODO IMPROVEMENT: Check for bulk insert within the current MYSQL version provided by hosting
      // Doing one insert per row works for this but not for bigger volumes of data
      await metrics.map(newMetric => metricsModel.insertOne(dbRef, newMetric));
      await fetchAndStoreTabs(page, dbRef, current + 1);
    }
    await fetchAndStoreTabs(page, dbRef, false);
  } catch (error) {
    logger.error(`Error fetching and storing tabs data ${error}`);
    Promise.reject(error);
  }
};

exports.crawlTableAndStoreData = async (page, dbRef, targetUrl) => {
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
