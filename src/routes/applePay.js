const express = require('express');
const { createApplePayJwt, normalizeAmount } = require('../applePay/jwt');

function buildRouter(config) {
  const router = express.Router();
  router.use(express.json());

  router.post('/bootstrap', (req, res) => {
    try {
      const amount = config.trustPayments.defaultAmount;
      const currencyCode = config.trustPayments.defaultCurrency;
      const countryCode = config.trustPayments.defaultCountry;
      const label = config.trustPayments.defaultLabel;
      const orderId = config.trustPayments.defaultOrderId;
      const siteReference = config.trustPayments.siteReference;

      const paymentRequest = {
        countryCode,
        currencyCode,
        merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        requiredBillingContactFields: ['postalAddress'],
        requiredShippingContactFields: ['postalAddress', 'name', 'phone', 'email'],
        total: {
          label,
          amount: normalizeAmount(amount),
        },
      };

      const { token, payload } = createApplePayJwt({
        siteReference,
        jwtUsername: config.trustPayments.jwtUsername,
        jwtSecret: config.trustPayments.jwtSecret,
        amount,
        currencyCode,
        orderId,
      });

      res.json({
        merchantId: siteReference,
        jwt: token,
        jwtPayload: payload,
        buttonStyle: 'white-outline',
        buttonText: 'plain',
        buttonPlacement: 'st-apple-pay',
        paymentRequest,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  });

  return router;
}

module.exports = {
  buildRouter,
};
