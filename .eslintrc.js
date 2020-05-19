const OFF = 0, WARN = 1, ERROR = 2;

module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true
  },

  extends: ['airbnb-base',
  'eslint:recommended',
  'plugin:prettier/recommended'],

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    "no-unused-vars" : OFF,
    "prettier/prettier" : ["error", { "printWidth": 110, "singleQuote": true }]
  },
};
