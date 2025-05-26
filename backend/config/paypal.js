const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const environment = new paypal.core.LiveEnvironment(
  process.env.PAYPAL_CLIENTID,
  process.env.PAYPAL_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;