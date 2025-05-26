
// routes/auth.js
const express = require('express');
const router = express.Router();
const { getVATSummaryByYear } = require('../controllers/vat.controller');
const { isLogin } = require('../middlewares/authMiddleware')

router.get('/:year', isLogin , getVATSummaryByYear);

module.exports = router