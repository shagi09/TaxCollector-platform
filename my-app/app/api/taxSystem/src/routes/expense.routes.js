const express = require('express');
const router = express.Router();
const { createExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expense.controller');
const { isLogin } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload')

router.post('/', isLogin, upload.single('receipt'), createExpense);
router.get('/', isLogin, getExpenses);
router.put('/:id', isLogin, updateExpense)
// router.get('/:id', isLogin, expenseController.getExpenseById)
router.delete('/:id', isLogin, deleteExpense)

module.exports = router;
