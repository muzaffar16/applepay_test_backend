const express = require('express');
const fs = require('fs');

function buildDomainVerificationRouter(config) {
  const router = express.Router();

  router.get('/.well-known/apple-developer-merchantid-domain-association', (req, res) => {
    if (!fs.existsSync(config.applePay.domainAssociationPath)) {
      res.status(503).type('text/plain').send(
        'Apple Pay domain association file is missing. Place the Trust Payments file at the configured path.'
      );
      return;
    }

    const contents = fs.readFileSync(config.applePay.domainAssociationPath);
    res.status(200).type('text/plain').send(contents);
  });

  return router;
}

module.exports = {
  buildDomainVerificationRouter,
};
