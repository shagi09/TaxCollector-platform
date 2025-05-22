const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload')

router.post('/', /*authMiddleware*/ upload.single('receipt'), expenseController.createExpense);
router.get('/', /*authMiddleware*/ expenseController.getExpenses);
router.put('/:id',/* authMiddleware,*/ expenseController.updateExpense)
router.get('/:id', /*authMiddleware,*/ expenseController.getExpenseById)
router.delete('/:id', /*authMiddleware,*/ expenseController.deleteExpense)

module.exports = router;
