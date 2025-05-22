const cron = require('node-cron');
const TaxPayer = require('../models/taxPayer.model');
const sendMail = require('../utils/sendMail');

// Monthly notification on every 30th
cron.schedule('0 9 30 * *', async () => {
  const users = await TaxPayer.find({});
  for (let user of users) {
    await sendMail(
      user.email,
      'Monthly Tax Due',
      `Dear ${user.name},\n\nThis is a reminder that your monthly tax payment is due.\n\nBest regards,\nTax Department`
    );
  }
  console.log('📅 Monthly tax notifications sent on 30th.');
});

// Annual Profit Tax reminder on June 30
cron.schedule('0 10 30 6 *', async () => {
  const users = await TaxPayer.find({});
  for (let user of users) {
    await sendMail(
      user.email,
      'Annual Profit Tax Due',
      `Dear ${user.name},\n\nYour annual profit tax filing deadline is today (June 30).\n\nPlease ensure your payment is complete.\n\nTax Department`
    );
  }
  console.log('📅 Annual profit tax notifications sent (June 30).');
});
