const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload')

// Protected routes (require user to be logged in)
router.post('/', /*authMiddleware,*/ upload.single('receipt'), incomeController.addIncome);
router.get('/',/* authMiddleware, */incomeController.getIncomes);

module.exports = router;
