const ngrok = require('@ngrok/ngrok');

(async () => {
  try {
    const authtoken = process.env.NGROK_AUTHTOKEN || process.env.TP_NGROK_AUTHTOKEN;
    const addr = Number(process.env.NGROK_ADDR || process.env.TP_NGROK_ADDR || process.env.PORT || 3001);
    const domain = process.env.NGROK_DOMAIN || process.env.TP_NGROK_DOMAIN;

    if (!authtoken) {
      console.error('Missing NGROK_AUTHTOKEN (or TP_NGROK_AUTHTOKEN).');
      console.error('Set it in backend/.env before running npm run tunnel.');
      process.exit(1);
    }

    const options = {
      addr,
      authtoken,
    };

    if (domain) {
      options.domain = domain;
    }

    const listener = await ngrok.forward(options);
    const url = listener.url();

    console.log('NGROK_URL=' + url);
    console.log('NGROK_FORWARDING=' + url + ' -> localhost:' + addr);
    console.log('Keep this terminal open while testing.');

    // Keep the process running so the tunnel stays active.
    process.stdin.resume();
  } catch (err) {
    console.error('ngrok failed to start:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
