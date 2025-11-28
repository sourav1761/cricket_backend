// config/cashfree.config.js
require('dotenv').config();

module.exports = {
  appId: process.env.CASHFREE_APP_ID,
  secretKey: process.env.CASHFREE_SECRET_KEY,
  isProduction: false, // true for live
  baseUrl: 'https://api.cashfree.com/pg', // change for live
};
