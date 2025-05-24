const Expense = require('../models/expense.model');
const TaxPeriod = require('../models/taxPeriod.model');
const { getOrCreateTaxPeriodId } = require('../utils/taxPeriodIdCreator')

 
// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { type, amount, paidDate, notes } = req.body;
    const userId = req.user._id; // "4a832c84c0ada085284abf30"// mock user ID

    const date = paidDate ? new Date(paidDate) : new Date();
    const year = date.getFullYear()
    const taxPeriodId = await getOrCreateTaxPeriodId(date);

    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;
    

    const expense = await Expense.create({
      userId,
      type,
      amount,
      receiptUrl,
      paidDate: date,
      notes,
      taxPeriodId,
      year
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
     const userId = req.user._id;
     const year = parseInt(req.params.year); // e.g. /api/incomes/2024
 
     if (!year || isNaN(year)) {
       return res.status(400).json({ error: 'Valid year is required as a route parameter' });
     }
 
     const expenses = await Expense.find({
       userId,
       year, // match directly with the stored year
     }).sort({ date: -1 });
 
     res.status(200).json({ expenses });
   } catch (error) {
     console.error('Get Expenses Error:', error);
     res.status(500).json({ error: 'Failed to fetch Expense records' });
   }
 };


// // Get single expense
// exports.getExpenseById = async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).json({ error: 'Expense not found' });
//     res.json(expense);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to retrieve expense' });
//   }
// };

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user._id; // replace with req.user.id in production

    const expense = await Expense.findOne({ _id: req.params.id, userId });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    // Update only allowed fields
    const { type, amount, paidDate, notes } = req.body;

    if (type !== undefined) expense.type = type;
    if (amount !== undefined) expense.amount = amount;
    if (paidDate !== undefined) expense.paidDate = new Date(paidDate);
    if (notes !== undefined) expense.notes = notes;

    const updated = await expense.save();

    res.json(updated);
  } catch (error) {
    console.error('Update Expense Error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};


// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user._id; // replace with req.user.id in production

    const expense = await Expense.findOne({ _id: req.params.id, userId });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    await expense.remove();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};


