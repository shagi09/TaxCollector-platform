const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// POST request to initialize payment
router.post('/pay/:payrollMonthId', paymentController.payment);

// GET request to retrieve the transaction receipt
router.get('/transactions/:id', paymentController.getTransactionReceipt);

module.exports = router;
