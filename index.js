var CronJob = require('cron').CronJob;

console.log('Good morning, master!');

// schedule cron every second 10 past every hour (second 10 to have a safe margin for it to detect the event)
new CronJob('*/10 * * * * *', function() {

	console.log('it works!');

  }, null, true, 'America/Los_Angeles');

