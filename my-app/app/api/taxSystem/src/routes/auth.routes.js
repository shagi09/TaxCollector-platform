// routes/auth.js
const express = require('express');
const router = express.Router();
const { loginTaxPayer, /*logoutTaxPayer,*/ changePassword, signupTaxPayer } = require('../controllers/auth.controller');
const { isLogin } = require('../middlewares/authMiddleware')
const upload = require('../utils/upload')


router.post('/taxpayer/login', loginTaxPayer);
// router.post('/taxpayer/logout', logoutTaxPayer);
router.post('/taxpayer/change-password', isLogin, changePassword);
router.post('/taxpayer/signup',upload.single('businessPermit'), signupTaxPayer )
 // token invalidation is optional

module.exports = router;
