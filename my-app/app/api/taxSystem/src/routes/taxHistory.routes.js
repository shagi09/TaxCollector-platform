// routes/auditRoutes.js
const express = require('express');
const { getAuditHistoryByType } = require('../controllers/taxHistory.controller');
const { isLogin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/:type', isLogin, getAuditHistoryByType);

module.exports = router;
