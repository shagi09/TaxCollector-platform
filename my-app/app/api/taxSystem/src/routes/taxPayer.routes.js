// routes/auth.js
const express = require('express');
const router = express.Router();
const { loginTaxPayer, logoutTaxPayer, changePassword, signupTaxPayer, getTaxPayerProfile } = require('../controllers/taxPayer.controller');
const { isLogin } = require('../middlewares/authMiddleware')
const upload = require('../utils/upload')



router.post('/login', loginTaxPayer);
router.post('/logout', isLogin, logoutTaxPayer);
router.post('/change-password', isLogin, changePassword);
router.post('/signup',upload.single('businessPermit'), signupTaxPayer )
router.get('/', isLogin, getTaxPayerProfile)
 // token invalidation is optional

module.exports = router;
