const express = require('express');
const router = express.Router();
const { payment } = require('../controllers/payment.controller');
const {isLogin} = require('../middlewares/authMiddleware');

router.post('/', isLogin, payment);


module.exports = router;
