const TaxPeriod = require('../models/taxPeriod.model');

const getOrCreateTaxPeriodId = async (date) => {
  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  let taxPeriod = await TaxPeriod.findOne({ month, year });

  if (!taxPeriod) {
    taxPeriod = await TaxPeriod.create({ month, year });
  }

  return taxPeriod._id; // note: Mongoose uses _id
};

module.exports = { getOrCreateTaxPeriodId };
