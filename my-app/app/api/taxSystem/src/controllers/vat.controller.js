const Income = require('../models/income.model');
const Expense = require('../models/expense.model');

exports.getVATSummaryByYear = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.params.year);

    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Valid year is required as a route parameter' });
    }

    // Initialize VAT arrays for each month (index 0 = Jan)
    const incomeVATByMonth = Array(12).fill(0);
    const expenseVATByMonth = Array(12).fill(0);

    // Get all incomes for the user and year
    const incomes = await Income.find({ userId, year });

    incomes.forEach(income => {
      const monthIndex = income.month - 1; // Ensure pre-save sets `.month`
      if (monthIndex >= 0 && monthIndex < 12) {
        incomeVATByMonth[monthIndex] += parseFloat(income.vat.toString());
      }
    });

    // Get all expenses for the user and year
    const expenses = await Expense.find({ userId, year });

    expenses.forEach(expense => {
      const monthIndex = expense.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        expenseVATByMonth[monthIndex] += parseFloat(expense.vat.toString());
      }
    });

    // Generate summary array
    const summary = [...Array(12).keys()].map(i => {
      const incomeVAT = parseFloat(incomeVATByMonth[i].toFixed(2));
      const expenseVAT = parseFloat(expenseVATByMonth[i].toFixed(2));
      const netVAT = parseFloat((incomeVAT - expenseVAT).toFixed(2));

      return {
        month: i + 1,
        incomeVAT,
        expenseVAT,
        netVAT
      };
    });

    res.status(200).json({ year, summary });
  } catch (error) {
    console.error('Get VAT Summary Error:', error);
    res.status(500).json({ error: 'Failed to fetch VAT summary' });
  }
};
