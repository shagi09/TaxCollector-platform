const express = require('express');
const router = express.Router();
const { loginAuditor, listTaxPayers, getTaxpayerById, getIncomesByYear, getIncomesByYearAndMonth, getExpensesByYear, getExpensesByYearAndMonth, getPayrollAuditByTaxpayer, getVatAuditByTaxpayer, getProfitTaxAuditByTaxpayer, addUserToBlacklist  } = require('../controllers/auditor.controller');
const { isLogin, verifyAuditor } = require('../middlewares/authMiddleware')


// GET /api/auditor/taxpayers
router.post('/login', loginAuditor);
router.get('/taxpayers', isLogin, verifyAuditor, listTaxPayers);
router.get('/taxpayers/:id', isLogin, verifyAuditor, getTaxpayerById);
router.get('/income/:id/:year', isLogin, verifyAuditor, getIncomesByYear);
router.get('/income/:id/:year/:month', isLogin, verifyAuditor, getIncomesByYearAndMonth);
router.get('/expense/:id/:year', isLogin, verifyAuditor, getExpensesByYear);
router.get('/expense/:id/:year/:month', isLogin, verifyAuditor, getExpensesByYearAndMonth);
router.get('/audit/payroll/:taxpayerId/:year/:month', isLogin, verifyAuditor, getPayrollAuditByTaxpayer);
router.get('/audit/vat/:taxpayerId/:year/:month', isLogin, verifyAuditor, getVatAuditByTaxpayer);
router.get('/audit/profit/:taxpayerId/:year', isLogin, verifyAuditor, getProfitTaxAuditByTaxpayer);
router.post('/blacklist/:userId' , isLogin, verifyAuditor, addUserToBlacklist)

module.exports = router;
