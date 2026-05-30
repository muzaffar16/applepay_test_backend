const express = require('express');
const path = require('path');
require('dotenv').config();
const { getConfig } = require('./config');
const { buildRouter: buildApplePayRouter } = require('./routes/applePay');
const { buildDomainVerificationRouter } = require('./routes/domainVerification');

const config = getConfig();
const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/apple-pay', buildApplePayRouter(config));
app.use(buildDomainVerificationRouter(config));
app.use(express.static(config.frontendRoot));
app.use('/assets', express.static(path.join(config.frontendRoot, 'assets')));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(config.port, () => {
  console.log(`Apple Pay demo server listening on port ${config.port}`);
});
