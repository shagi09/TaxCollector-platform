const express = require('express');
const router = express.Router();
const { loginAuditor, listTaxPayers, getTaxpayerById } = require('../controllers/auditor.controller');
const { isLogin, verifyAuditor } = require('../middlewares/authMiddleware')


// GET /api/auditor/taxpayers
router.get('/taxpayers', isLogin, listTaxPayers);
router.post('/login', loginAuditor);
router.get('/taxpayers', isLogin, verifyAuditor, listTaxPayers);
router.get('/taxpayers/:id', isLogin, verifyAuditor, getTaxpayerById);
router.get('/income/:id/:year', isLogin, verifyAuditor, auditorController.getIncomesByYear);
router.get('/income/:id/:year/:month', isLogin, verifyAuditor, auditorController.getIncomesByYearAndMonth);
router.get('/expense/:id/:year', isLogin, verifyAuditor, auditorController.getExpensesByYear);
router.get('/expense/:id/:year/:month', isLogin, verifyAuditor, auditorController.getExpensesByYearAndMonth);
router.get('/audit/payroll/:taxpayerId/:year/:month', isLogin, verifyAuditor, auditorController.getPayrollAuditByTaxpayer);
router.get('/audit/vat/:taxpayerId/:year/:month', isLogin, verifyAuditor, auditorController.getVatAuditByTaxpayer);
router.get('/audit/profit/:taxpayerId/:year', isLogin, verifyAuditor, auditorController.getProfitTaxAuditByTaxpayer);


module.exports = router;
