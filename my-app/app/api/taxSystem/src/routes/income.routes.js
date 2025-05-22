const express = require('express');
const router = express.Router();
const { addIncome, getIncomes } = require('../controllers/income.controller');
const { isLogin } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload')

// Protected routes (require user to be logged in)
router.post('/', isLogin,  upload.single('receipt'), addIncome);
router.get('/', isLogin , getIncomes);

module.exports = router;
