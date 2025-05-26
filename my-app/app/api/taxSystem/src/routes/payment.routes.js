const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Payroll
router.post('/payroll/:payrollMonthId', paymentController.payrollPayment);
router.get('/transactions/:id', paymentController.getPayrollReceipt);

// VAT
router.post('/vat/:id', paymentController.vatPayment);
router.get('/transactions/vat/:id', paymentController.getVatReceipt);

// Profit Tax
router.post('/profit-tax', paymentController.profitTaxPayment);
router.get('/transactions/profit/:id', paymentController.getProfitReceipt);

module.exports = router;
