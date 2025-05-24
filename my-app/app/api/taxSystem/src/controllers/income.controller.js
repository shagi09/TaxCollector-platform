const Income = require('../models/income.model');
const TaxPeriod = require('../models/taxPeriod.model');
const { getOrCreateTaxPeriodId } = require('../utils/taxPeriodIdCreator'); // ✅ correct
 

// Add new income
exports.addIncome = async (req, res) => {
  try {
    const { amount, source, recievedDate } = req.body;

    const date = recievedDate ? new Date(recievedDate) : new Date();
     const year = date.getFullYear(); // Extract the year
     const taxPeriodId = await getOrCreateTaxPeriodId(date);


    const receiptUrl = req.file ? `/uploads/receipts/${req.file.filename}` : null;

    const income = await Income.create({
      amount,
      source,
      date,
      year,
      receiptUrl,
      taxPeriodId,
      userId: req.user._id //"4a832c84c0ada085284abf30"// Assuming authentication middleware sets this
    });

    res.status(201).json({ message: 'Income recorded successfully', income });
  } catch (error) {
    console.error('Add Income Error:', error);
    res.status(500).json({ error: 'Failed to record income' });
  }
};

// Get all income records for logged-in user
 exports.getIncomes = async (req, res) => {
  try {
    const userId = req.user._id;
   const year = parseInt(req.params.year); // e.g. /api/incomes/2024

     if (!year || isNaN(year)) {
      return res.status(400).json({ error: 'Valid year is required as a route parameter' });
    }

    const incomes = await Income.find({
      userId,
     year, // match directly with the stored year
    }).sort({ date: -1 });

    incomes.forEach(income => {
      console.log("year at last" + income.year);
    });
    res.status(200).json({ incomes });
  } catch (error) {
    console.error('Get Incomes Error:', error);
    res.status(500).json({ error: 'Failed to fetch income records' });
  }
};





// Update an expense
exports.updateIncome = async (req, res) => {
  try {
    const userId = req.user._id; // replace with req.user.id in production

    const income = await Income.findOne({ _id: req.params.id, userId });

    if (!income) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    // Update only allowed fields
    const { amount, date, source } = req.body;

    if (source !== undefined) Income.source = source;
    if (amount !== undefined) Income.amount = amount;
    if (date !== undefined) Income.date = new Date(date);
 
    const updated = await income.save();

    res.json(updated);
  } catch (error) {
    console.error('Update Income Error:', error);
    res.status(500).json({ error: 'Failed to update Income' });
  }
};


// Delete an expense
exports.deleteIncome = async (req, res) => {
  try {
    const userId = req.user._id; // replace with req.user.id in production

    const income = await Income.findOne({ _id: req.params.id, userId });

    if (!income) {
      return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    await income.remove();

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Delete Income Error:', error);
    res.status(500).json({ error: 'Failed to delete income' });
  }
};