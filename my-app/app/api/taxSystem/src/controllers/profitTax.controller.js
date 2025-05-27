const ProfitTax = require('../models/profitTax.model'); // Make sure this is the correct path
const Income = require('../models/income.model');
const Expense = require('../models/expense.model');
const { calculateProfitTax } = require('../utils/calculateTax'); // Your custom tax logic

exports.profitTax = async (req, res) => {
  try {
    const userId = req.user._id;
    const year = parseInt(req.params.year);


    if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Invalid or missing year parameter' });
    }

    // Fetch incomes for user and year
    const incomes = await Income.find({ userId, year });
    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);

    // Fetch expenses for user and year
    const expenses = await Expense.find({ userId, year });
    const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

    const profit = totalIncome - totalExpense;
    const tax = calculateProfitTax(profit); // External tax logic

    // Either update existing record or create a new one
    const existing = await ProfitTax.findOne({ userId, year });

    if (existing) {
      existing.income = totalIncome;
      existing.expense = totalExpense;
      existing.profit = profit;
      existing.taxAmount = tax;
      await existing.save();
    } else {
      existing =  await ProfitTax.create({
        userId,
        income: totalIncome,
        expense: totalExpense,
        profit,
        taxAmount: tax,
        year,
        month: new Date().getMonth() + 1,
      });
    }

    res.json({
      year,
      totalIncome,
      totalExpense,
      profit,
      tax,
      profitTaxId : existing._id
    });

  } catch (error) {
    console.error('Profit Tax Calculation Error:', error);
    res.status(500).json({ error: 'Failed to calculate profit tax' });
  }
};
