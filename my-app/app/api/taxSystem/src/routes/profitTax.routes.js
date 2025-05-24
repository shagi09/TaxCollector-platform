const express = require('express');
const router = express.Router();
const { calculateProfitTax } = require('../controllers/profitTax.controller');
const {isLogin} = require('../middlewares/authMiddleware');


router.get('/', isLogin, calculateProfitTax);

module.exports = router