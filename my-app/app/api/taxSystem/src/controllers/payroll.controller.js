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

    console.log(month)
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

    // Calculate due date (30th of the next month)
    const nextMonth = month === 12 ? 1 : month + 1;
    const dueYear = month === 12 ? year + 1 : year;
    const dueDateObj = new Date(dueYear, nextMonth - 1, 30, 12); // 30th of next month at noon
    const dueDate = dueDateObj.toISOString().split('T')[0];

    // Determine if overdue and calculate penalty if applicable
    const now = new Date();

    if (monthRecord.taxStatus !== 'paid' && now > dueDateObj) {
      monthRecord.taxStatus = 'overdue';

      const monthsLate = Math.floor(
        (now.getFullYear() - dueDateObj.getFullYear()) * 12 +
        (now.getMonth() - dueDateObj.getMonth())
      );

      monthRecord.penalty = +(totalTax * 0.05 * monthsLate).toFixed(2);

      await payrollYear.save(); // Persist changes to DB
    } else if (monthRecord.taxStatus !== 'paid') {
      // If not overdue and not paid, ensure taxStatus is pending and penalty is 0
      monthRecord.taxStatus = 'pending';
      monthRecord.penalty = 0;

      await payrollYear.save();
    }

    res.status(200).json({
      year,
      month,
      records: monthRecord.records,
      totalSalary,
      totalTax,
      dueDate,
      taxStatus: monthRecord.taxStatus,
      penalty: monthRecord.penalty || 0
    });
  } catch (err) {
    console.error('Get Payroll by Year and Month Error:', err);
    res.status(500).json({ error: 'Failed to fetch payroll records' });
  }
};


// Update a payroll record
exports.updatePayroll = async (req, res) => {
  try {
    const userId = req.user._id;
    const recordId = req.params.id;
    const { employeeName, salary, description } = req.body;

    console.log(recordId)
    // Find the PayrollRecord doc that contains the record with recordId
    const payrollDoc = await PayrollRecord.findOne({ userId, "months.records._id": recordId });

    if (!payrollDoc) {
      return res.status(404).json({ error: "Payroll record not found or unauthorized" });
    }

    // Directly access the found record
    const foundRecord = payrollDoc.months.flatMap(month => month.records).find(record => record._id.toString() === recordId);

    if (!foundRecord) {
      return res.status(404).json({ error: "Payroll record not found in any month" });
    }

    // Update fields if provided
    if (employeeName !== undefined) foundRecord.employeeName = employeeName;
    if (salary !== undefined) {
      foundRecord.salary = salary;
      foundRecord.tax = calculatePayrollTax(parseFloat(salary)); // Use your tax calculation logic
    }
    if (description !== undefined) foundRecord.description = description;

    await payrollDoc.save();

    res.json({ message: "Payroll record updated successfully", record: foundRecord });
  } catch (error) {
    console.error("Update Payroll Error:", error);
    res.status(500).json({ error: "Failed to update payroll record" });
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


exports.loadPreviousMonthRecordsCurrent = async (req, res) => {
  try {
    const userId = req.user._id;

    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1; // JS months: 0-11, so add 1

    // Calculate previous month and possibly previous year
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }

    const payrollDoc = await PayrollRecord.findOne({ userId, year });
    if (!payrollDoc) {
      return res.status(404).json({ error: 'Payroll data for the current year not found' });
    }

    const currentMonthIndex = payrollDoc.months.findIndex(m => m.month === month);
    // if (currentMonthIndex !== -1 && payrollDoc.months[currentMonthIndex].records.length > 0) {
    //   return res.status(400).json({ error: 'Current month already has payroll records' });
    // }

    const prevMonthRecord = payrollDoc.months.find(m => m.month === prevMonth);
    if (!prevMonthRecord || prevMonthRecord.records.length === 0) {
      return res.status(404).json({ error: 'No payroll records found for previous month' });
    }

    // Copy previous month records to current month
    const copiedRecords = prevMonthRecord.records.map(r => ({
      employeeName: r.employeeName,
      salary: r.salary,
      tax: r.tax,
      description: r.description,
      taxPeriodId: r.taxPeriodId,
      createdAt: new Date(),
    }));

    if (currentMonthIndex !== -1) {
      payrollDoc.months[currentMonthIndex].records = copiedRecords;
    } else {
      payrollDoc.months.push({
        month,
        records: copiedRecords,
      });
    }

    await payrollDoc.save();

    res.status(200).json({ message: 'Previous month records loaded successfully', records: copiedRecords });
  } catch (err) {
    console.error('Load Previous Month Records Error:', err);
    res.status(500).json({ error: 'Failed to load previous month records' });
  }
};