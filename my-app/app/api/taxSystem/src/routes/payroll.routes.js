const express = require('express');
const router = express.Router();
const { addPayrollRecord, getPayrollSummary, updatePayroll, deletePayroll,loadPreviousMonthRecordsCurrent } = require('../controllers/payroll.controller');
const {isLogin} = require('../middlewares/authMiddleware');

router.post('/', isLogin, addPayrollRecord);
router.get('/:year/:month',isLogin, getPayrollSummary);
router.put('/:id',isLogin, updatePayroll);
router.get('/', isLogin, loadPreviousMonthRecordsCurrent)
router.delete('/:id', isLogin, deletePayroll);

module.exports = router;
