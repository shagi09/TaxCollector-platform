const Income = require('../models/income.model');
const Expense = require('../models/expense.model');
const { calculateProfitTax } = require('../utils/calculateTax')

 exports.profitTax = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all incomes for user and sum them
    const incomes = await Income.find({ userId });
    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);

    // Fetch all expenses for user and sum them
    const expenses = await Expense.find({ userId });
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    const profit = totalIncome - totalExpense;
    const tax = calculateProfitTax(profit);

    res.json({
      totalIncome,
      totalExpense,
      profit,
      tax
    });

  } catch (error) {
    console.error('Profit Tax Calculation Error:', error);
    res.status(500).json({ error: 'Failed to calculate profit tax' });
  }
};

