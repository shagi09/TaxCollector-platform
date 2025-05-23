const express = require('express');
const router = express.Router();
const { addIncome, getIncomes, updateIncome, deleteIncome } = require('../controllers/income.controller');
const { isLogin } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload')

// Protected routes (require user to be logged in)
router.post('/', isLogin,  upload.single('receipt'), addIncome);
router.get('/', isLogin , getIncomes);
router.put('/:id', isLogin, updateIncome)
router.delete('/:id', isLogin, deleteIncome)

module.exports = router;
