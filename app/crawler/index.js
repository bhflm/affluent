const puppeteer = require('puppeteer');
const config = require('../config');
const logger = require('../logger');
const {
  USERNAME_LOGIN,
  PWD_LOGIN,
  LOGIN_BUTTON,
  DATEPICKER,
  DATEPICKER_RANGE_START,
  DATEPICKER_RANGE_END,
  BYDATE_TABLE_ENTRIES_DROPDOWN,
  BYDATE_TABLE_ALL_ENTRIES
} = require('./constants');

const startBrowser = async () => {
  const browser = await puppeteer.launch({ headless: false });
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

const selectDates = async (page, targetUrl) => {
  logger.info('Selecting desired dates');
  try {

    await page.goto(targetUrl);
    // wait until data table loads
    await page.waitForSelector('#DataTables_Table_0 > tbody > tr:nth-child(1)');

    // const paginatedRows = document.querySelectorAll('#DataTables_Table_0 > tbody > tr');

    const fetchTableRows = await page.evaluate(() => {
      const trs = Array.from(document.querySelectorAll('#DataTables_Table_0 > tbody > tr'));
      console.log('ROWS: ', trs);
      return trs.map(t => t.innerText);
    });

    console.log('ROWS: ', fetchTableRows);

  } catch (error) {
    logger.error(`Error while picking date: ${error}`);
    Promise.reject(error);
  }
};

(async () => {
  const { METRICS } = config;
  const { username, password, url } = METRICS;
  const targetDateQuery = 'main?startDate=2020-04-01&endDate=2020-04-30';
  try {
    const { browser, page } = await startBrowser();
    await logIn(page, url, username, password);
    await selectDates(page, `${url}/${targetDateQuery}`);
    process.exit(1);
  }
  catch (error) {
    logger.error(`Error crawling website: ${error}`);
  }
})();
