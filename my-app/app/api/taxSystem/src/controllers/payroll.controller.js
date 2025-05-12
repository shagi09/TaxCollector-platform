const PayrollRecord = require('../models/payrollRecord');
const { getOrCreateTaxPeriodId } = require('../utils/taxPeriodIdCreator');

// Add a new payroll record
exports.addPayrollRecord = async (req, res) => {
  try {
    const { employeeName, salary, description } = req.body;

    const now = new Date();
    const taxPeriodId = await getOrCreateTaxPeriodId(now);

    const tax = parseFloat(salary) * 0.1;

    const record = await PayrollRecord.create({
      employeeName,
      salary,
      tax,
      description,
      taxPeriodId,
      userId: "4a832c84c0ada085284abf30" /*req.user._id,*/ // Assuming authentication middleware sets this
    });

    res.status(201).json({ message: 'Payroll record added', record });
  } catch (err) {
    console.error('Add Payroll Error:', err);
    res.status(500).json({ error: 'Failed to add payroll record' });
  }
};

// Get payroll summary for a tax period
exports.getPayrollSummary = async (req, res) => {
  try {
    const records = await PayrollRecord.find({
      userId: "4a832c84c0ada085284abf30",//req.user._id,
      taxPeriodId: req.params.taxPeriodId,
    }).sort({ createdAt: -1 });

    const totalSalary = records.reduce((sum, r) => sum + parseFloat(r.salary), 0);
    const totalTax = records.reduce((sum, r) => sum + parseFloat(r.tax), 0);

    res.status(200).json({ records, totalSalary, totalTax });
  } catch (err) {
    console.error('Get Payroll Summary Error:', err);
    res.status(500).json({ error: 'Failed to fetch payroll summary' });
  }
};

// Update a payroll record
exports.updatePayroll = async (req, res) => {
  try {
    const updated = await Payroll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Update Payroll Error:', error);
    res.status(500).json({ error: 'Failed to update payroll' });
  }
};

// Delete a payroll record
exports.deletePayroll = async (req, res) => {
  try {
    const deleted = await Payroll.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }

    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    console.error('Delete Payroll Error:', error);
    res.status(500).json({ error: 'Failed to delete payroll' });
  }
};

