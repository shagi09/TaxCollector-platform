const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payroll.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', /*authMiddleware,*/ payrollController.addPayrollRecord);
router.get('/:taxPeriodId', /*authMiddleware,*/ payrollController.getPayrollSummary);
router.put('/:taxPeriodId', /*authMiddleware,*/ payrollController.getPayrollSummary);
router.delete('/:taxPeriodId', /*authMiddleware,*/ payrollController.getPayrollSummary);



module.exports = router;
