const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { isLogin } = require('../middlewares/authMiddleware')

// Payroll
router.post('/payroll/:payrollMonthId', isLogin,  paymentController.payrollPayment);
router.get('/transactions/:id', isLogin, paymentController.getPayrollReceipt);

// VAT
router.post('/vat/:vatId', isLogin, paymentController.vatPayment);
router.get('/transactions/vat/:id', isLogin, paymentController.getVatReceipt);

// Profit Tax
router.post('/profit-tax/:profitTaxId', isLogin,  paymentController.profitTaxPayment);
router.get('/transactions/profit/:id', isLogin, paymentController.getProfitReceipt);

module.exports = router;
