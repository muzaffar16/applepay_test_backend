const path = require('path');

function getEnv(name, fallback) {
  const value = process.env[name];
  return value && value.length > 0 ? value : fallback;
}

function getEnvAny(names, fallback) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.length > 0) {
      return value;
    }
  }

  return fallback;
}

function getConfig() {
  const frontendRoot = path.resolve(__dirname, '../../frontend');
  const publicRoot = path.resolve(frontendRoot, 'public');

  return {
    port: Number(getEnv('PORT', '3001')),
    frontendRoot,
    publicRoot,
    trustPayments: {
      siteReference: getEnvAny(['TP_SITE_REF', 'TRUST_PAYMENTS_SITE_REFERENCE'], 'test_site12345'),
      jwtUsername: getEnvAny(['TP_TEST_USERNAME', 'TRUST_PAYMENTS_JWT_USERNAME'], 'jwt@rrominternational.com'),
      jwtSecret: getEnvAny(['TP_TEST_SECRET', 'TRUST_PAYMENTS_JWT_SECRET'], ''),
      googlePayMerchantId: getEnvAny(['TP_GOOGLE_PAY_MERCHANT_ID'], ''),
      environment: getEnvAny(['TP_ENV'], 'TEST'),
      defaultAmount: getEnvAny(['TRUST_PAYMENTS_DEFAULT_AMOUNT'], '10.00'),
      defaultCurrency: getEnvAny(['TRUST_PAYMENTS_DEFAULT_CURRENCY'], 'USD'),
      defaultCountry: getEnvAny(['TRUST_PAYMENTS_DEFAULT_COUNTRY'], 'US'),
      defaultLabel: getEnvAny(['TRUST_PAYMENTS_DEFAULT_LABEL'], 'Trust Payments Merchant'),
      defaultOrderId: getEnvAny(['TRUST_PAYMENTS_DEFAULT_ORDER_ID'], 'demo-order-10001'),
    },
    applePay: {
      domainAssociationPath: getEnv(
        'APPLE_PAY_DOMAIN_ASSOCIATION_PATH',
        path.join(publicRoot, '.well-known', 'apple-developer-merchantid-domain-association')
      ),
    },
  };
}

module.exports = {
  getConfig,
};
