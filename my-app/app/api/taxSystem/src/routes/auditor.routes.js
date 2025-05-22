const express = require('express');
const router = express.Router();
const { loginAuditor, listTaxPayers} = require('../controllers/auditor.controller');
const { isLogin } = require('../middlewares/authMiddleware')

// GET /api/auditor/taxpayers
router.get('/taxpayers', isLogin, listTaxPayers);
router.post('/login', loginAuditor);

module.exports = router;
