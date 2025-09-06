// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://d39e339136638947aa301101e7eb3060@o4509972067647488.ingest.de.sentry.io/4509972069089360',
  
  // Auth token for Sentry
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
