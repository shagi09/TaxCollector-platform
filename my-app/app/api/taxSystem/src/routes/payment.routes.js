const express = require('express');
const router = express.Router();
const { payrollPayment, vatPayment,  profitTaxPayment,  } = require('../controllers/payment.controller');
const { isLogin } = require('../middlewares/authMiddleware')

// Payroll
router.post('/payroll/:payrollMonthId', isLogin,  payrollPayment);

// VAT
router.post('/vat/:vatId', isLogin, vatPayment);

// Profit Tax
router.post('/profit-tax/:profitTaxId', isLogin,  profitTaxPayment);

module.exports = router;
