 const Income = require('../models/income.model');
const Expense = require('../models/expense.model');
const Vat = require('../models/vat.model'); // Import VAT model

exports.getVATSummaryByYear = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.params.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Valid year is required as a route parameter' });
    }

    // Initialize VAT arrays for each month (0-indexed)
    const incomeVATByMonth = Array(12).fill(0);
    const expenseVATByMonth = Array(12).fill(0);

    // Fetch all income records for the given user and year
    const incomes = await Income.find({ userId, year });

    incomes.forEach(income => {
      const monthIndex = income.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        incomeVATByMonth[monthIndex] += parseFloat(income.vat || 0);
      }
    });

    // Fetch all expense records for the given user and year
    const expenses = await Expense.find({ userId, year });

    expenses.forEach(expense => {
      const monthIndex = expense.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        expenseVATByMonth[monthIndex] += parseFloat(expense.vat || 0);
      }
    });

    const summary = [];

    for (let i = 0; i < 12; i++) {
      const incomeVAT = parseFloat(incomeVATByMonth[i].toFixed(2));
      const expenseVAT = parseFloat(expenseVATByMonth[i].toFixed(2));
      const netVAT = parseFloat((incomeVAT - expenseVAT).toFixed(2));

      // Optional: Save/update to VAT collection for persistence
      const existingRecord = await Vat.findOne({ year, month: i + 1 });

      if (existingRecord) {
        existingRecord.incomeVat = incomeVAT;
        existingRecord.expenseVat = expenseVAT;
        existingRecord.amount = netVAT;
        await existingRecord.save();
      } else {
        await Vat.create({
          year,
          month: i + 1,
          incomeVat: incomeVAT,
          expenseVat: expenseVAT,
          amount: netVAT
        });
      }

      summary.push({
        month: i + 1,
        incomeVAT,
        expenseVAT,
        netVAT
      });
    }

    res.status(200).json({ year, summary });

  } catch (error) {
    console.error('Get VAT Summary Error:', error);
    res.status(500).json({ error: 'Failed to fetch VAT summary' });
  }
};
