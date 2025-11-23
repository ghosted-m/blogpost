const CronJob = require('cron').CronJob;
const { FETCH_INTERVAL_CRON } = require('./config');
const { runOnce } = require('./fetcher');

function startScheduler() {
  const job = new CronJob(FETCH_INTERVAL_CRON, async function() {
    console.log('Scheduler triggered at', new Date().toISOString());
    try {
      await runOnce();
    } catch (e) {
      console.error('Scheduled run error', e.message || e);
    }
  }, null, true);
  job.start();
  console.log('Scheduler started with cron:', FETCH_INTERVAL_CRON);
}

module.exports = { startScheduler };
