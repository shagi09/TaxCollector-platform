// routes/auth.js
const express = require('express');
const router = express.Router();
const { loginTaxPayer, logoutTaxPayer, changePassword, signupTaxPayer } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/authMiddleware')


router.post('/taxpayer/login', loginTaxPayer);
router.post('/taxpayer/logout', logoutTaxPayer);
router.post('/taxpayer/change-password', authMiddleware, changePassword);
router.post('/taxpayer/signup', signupTaxPayer )
 // token invalidation is optional

module.exports = router;
