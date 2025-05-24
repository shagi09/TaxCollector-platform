const PayrollRecord = require('../models/payrollRecord');
const { getOrCreateTaxPeriodId } = require('../utils/taxPeriodIdCreator');
const { calculatePayrollTax } = require('../utils/calculateTax')

// Add a new payroll record
exports.addPayrollRecord = async (req, res) => {
  try {
    const userId = req.user._id;
    const { employeeName, salary, description } = req.body;

    const createdAt = new Date();
    const year = createdAt.getFullYear();
    const month = createdAt.getMonth() + 1; // JavaScript months are 0-indexed

    const tax = calculatePayrollTax(salary);

    const newRecord = {
      employeeName,
      salary,
      tax,
      description,
      createdAt,
      userId,
    };

    let payrollRecord = await PayrollRecord.findOne({ userId, year });

    if (!payrollRecord) {
      // Create new year with the current month and record
      payrollRecord = await PayrollRecord.create({
        userId,
        year,
        months: [{
          month,
          records: [newRecord],
        }],
      });
    } else {
      // Find the existing month or create it
      const monthEntry = payrollRecord.months.find(m => m.month === month);

      if (monthEntry) {
        monthEntry.records.push(newRecord);
      } else {
        payrollRecord.months.push({
          month,
          records: [newRecord],
        });
      }

      await payrollRecord.save();
    }

    res.status(201).json({ message: 'Payroll record added', record: newRecord });
  } catch (err) {
    console.error('Add Payroll Error:', err);
    res.status(500).json({ error: 'Failed to add payroll record' });
  }
};

// Get payroll summary for a tax period
exports.getPayrollSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    // Find payroll record for user and year
    const payrollYear = await PayrollRecord.findOne({ userId, year });

    if (!payrollYear) {
      return res.status(404).json({ error: 'Payroll data for the year not found' });
    }

    // Find month record inside months array
    const monthRecord = payrollYear.months.find(m => m.month === month);

    if (!monthRecord) {
      return res.status(404).json({ error: 'Payroll data for the month not found' });
    }

    // Calculate totals
    const totalSalary = monthRecord.records.reduce((sum, r) => sum + parseFloat(r.salary.toString()), 0);
    const totalTax = monthRecord.records.reduce((sum, r) => sum + parseFloat(r.tax.toString()), 0);

    res.status(200).json({
      year,
      month,
      records: monthRecord.records,
      totalSalary,
      totalTax
    });
  } catch (err) {
    console.error('Get Payroll by Year and Month Error:', err);
    res.status(500).json({ error: 'Failed to fetch payroll records' });
  }
};

// Update a payroll record
exports.updatePayroll = async (req, res) => {
  try {
    const userId = req.user._id; // replace with req.user.id in production

    const payroll = await PayrollRecord.findOne({ _id: req.params.id, userId });

    if (!payroll) {
      return res.status(404).json({ error: 'Payroll record not found or unauthorized' });
    }

    // Update only allowed fields
    const { employeeName, salary, description } = req.body;
    console.log(req.body)

    if (employeeName !== undefined) payroll.employeeName = employeeName;
    if (salary !== undefined) {
      payroll.salary = salary;
      payroll.tax = parseFloat(salary) * 0.1; // Recalculate tax if salary changes
    }
    if (description !== undefined) payroll.description = description;

    const updated = await payroll.save();

    res.json(updated);
  } catch (error) {
    console.error('Update Payroll Error:', error);
    res.status(500).json({ error: 'Failed to update payroll record' });
  }
};



// Delete a payroll record
exports.deletePayroll = async (req, res) => {
  try {
    const deleted = await PayrollRecord.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Payroll record not found' });
    }

    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    console.error('Delete Payroll Error:', error);
    res.status(500).json({ error: 'Failed to delete payroll' });
  }
};

