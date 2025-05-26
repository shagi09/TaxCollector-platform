const axios = require('axios');
const AuditRecords = require('../models/auditRecords.model'); 
const PayrollRecord = require('../models/payrollRecord')

exports.payment = async (req, res) => {
 console.log(req.body);
try {
  const { amount, email, firstName, lastName, phone } = req.body;
  const { payrollMonthId } = req.params;


  const tx_ref = "chewatatest-" + Date.now();

  // Step 1: Fetch the payroll record that contains the payrollMonthId
  const payroll = await PayrollRecord.findOne({ 'months._id': payrollMonthId });

  if (!payroll) {
    return res.status(404).json({ error: 'Payroll month not found' });
  }

  const matchedMonth = payroll.months.id(payrollMonthId);
  if (!matchedMonth) {
    return res.status(404).json({ error: 'Month record not found in payroll' });
  }

  // Step 2: Create the audit record with month and year included
  const auditRecords = await AuditRecords.create({
    amount,
    currency: "ETB",
    email,
    firstName,
    lastName,
    phone,
    tx_ref,
    date: Date.now(),
    payrollMonthId,
    month: matchedMonth.month,  // ← added
    year: payroll.year          // ← added
  });

    // Prepare payment request body for Chapa
    const body = {
        amount, 
        currency: "ETB",
        email,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        tx_ref,
        callback_url: "https://webhook.site/077164d6-29cb-40df-ba29-8a00e59a7e60",
        return_url: `http://localhost:3000/transactions/${auditRecords._id}`, // Redirect to transaction receipt
        customization: {
          title: "Payment for ",
          description: "I love online payments",
        },
        meta: {
          hide_receipt: "true",
        },
      };

    const options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer CHASECK_TEST-E2XnZBkD5AqYSXud9MWRnqHtRqgqZYPm",
          "Content-Type": "application/json",
        },
        data: body,
      };

    const response = await axios(options);
    const chapaResponse = response.data;
    
    // Update transaction with checkout URL
    auditRecords.checkout_url = chapaResponse.data.checkout_url;
    await auditRecords.save();

    res.status(201).json({
      message: "Booking created successfully, redirect to payment",
      paymentUrl: chapaResponse.data.checkout_url
    });
  } catch (error) {
    console.error('Error handling Chapa payment:', error);
    res.status(500).json({ message: "Payment initialization failed" });
  }
};

// Add this new controller to display the transaction receipt
 exports.getTransactionReceipt = async (req, res) => {
  try {
    // 1. Get the AuditRecord by its ID
    const auditRecord = await AuditRecords.findById(req.params.id);
    if (!auditRecord) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 2. Fetch the PayrollRecord that includes the payrollMonthId
    const payroll = await PayrollRecord.findOne({ 'months._id': auditRecord.payrollMonthId });
    if (!payroll) {
      return res.status(404).json({ message: "Associated payroll record not found" });
    }

    // 3. Get the specific month object by ID
    const targetMonth = payroll.months.id(auditRecord.payrollMonthId);
    if (!targetMonth) {
      return res.status(404).json({ message: "Month not found in payroll record" });
    }

    // 4. Update the taxStatus to 'paid'
    targetMonth.taxStatus = 'paid';

    // 5. Save the updated payroll record
    await payroll.save();

    // Optional: return the auditRecord and updated month for reference
    res.status(200).json({
      message: "Payroll month marked as paid",
      updatedMonth: targetMonth,
      auditRecord
    });

  } catch (error) {
    console.error('Error updating payroll month status:', error);
    res.status(500).json({ message: "Failed to update payroll month status" });
  }
};
