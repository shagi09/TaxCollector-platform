const express = require('express');
const router = express.Router();
const { profitTax } = require('../controllers/profitTax.controller');
const {isLogin} = require('../middlewares/authMiddleware');


router.get('/:year', isLogin, profitTax);

module.exports = router