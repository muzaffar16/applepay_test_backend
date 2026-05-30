const jwt = require('jsonwebtoken');

function normalizeAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error('Apple Pay amount must be a positive number');
  }

  return numericAmount.toFixed(2);
}

function createApplePayJwt({ siteReference, jwtUsername, jwtSecret, amount, currencyCode, orderId }) {
  if (!siteReference) {
    throw new Error('Trust Payments site reference is required');
  }

  if (!jwtUsername) {
    throw new Error('Trust Payments JWT username is required');
  }

  if (!jwtSecret) {
    throw new Error('Trust Payments JWT secret is required');
  }

  const normalizedAmount = normalizeAmount(amount);
  const issuedAt = Math.floor(Date.now() / 1000);

  const payload = {
    iss: jwtUsername,
    iat: issuedAt,
    payload: {
      currencyiso3a: currencyCode,
      orderreference: orderId,
      sitereference: siteReference,
      accounttypedescription: 'ECOM',
      requesttypedescriptions: ['THREEDQUERY', 'AUTH'],
      mainamount: normalizedAmount,
    },
  };

  return {
    token: jwt.sign(payload, jwtSecret, { algorithm: 'HS256' }),
    payload,
  };
}

module.exports = {
  createApplePayJwt,
  normalizeAmount,
};
