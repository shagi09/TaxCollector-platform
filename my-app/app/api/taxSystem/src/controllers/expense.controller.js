const Expense = require('../models/expense.model');
const TaxPeriod = require('../models/taxPeriod.model');
const { getOrCreateTaxPeriodId } = require('../utils/taxPeriodIdCreator')

 
// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { type, amount, paidDate, notes } = req.body;
    const userId = "4a832c84c0ada085284abf30"//req.user.id; // mock user ID

    const date = paidDate ? new Date(paidDate) : new Date();
    const taxPeriodId = await getOrCreateTaxPeriodId(date);

    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;
    

    const expense = await Expense.create({
      userId,
      type,
      amount,
      receiptUrl,
      paidDate: date,
      notes,
      taxPeriodId
    });

    res.status(201).json(expense);
    // console.log(receiptUrl)
  } catch (error) {
    console.error('Create Expense Error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};


// Get all expenses for logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const userId = "4a832c84c0ada085284abf30"//req.user._id;
    const expenses = await Expense.find({ userId }).sort({ paidDate: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expenses' });
  }
};

// Get single expense
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve expense' });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Expense not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
