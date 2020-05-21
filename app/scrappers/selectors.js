// LOGIN VIEW
exports.USERNAME_LOGIN = 'body > div.content > form.login-form > div:nth-child(2) > input';
exports.PWD_LOGIN = 'body > div.content > form.login-form > div:nth-child(3) > input';
exports.LOGIN_BUTTON = 'body > div.content > form.login-form > div.form-actions > button';
// HOME VIEW
// Data table
exports.DATA_TABLE = '#DataTables_Table_0 > tbody > tr:nth-child(1)';
exports.DATA_TABLE_TAB = childNumber =>
  `#DataTables_Table_0_wrapper > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(${childNumber}) > a:nth-child(1)`;
exports.FIRST_DATA_TABLE_TAB = 4;
