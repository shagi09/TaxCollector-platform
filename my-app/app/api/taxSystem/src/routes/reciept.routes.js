const {viewReceipt} = require('../controllers/viewReciepts.controller')
const express = require('express');
const router = express.Router();
 const {isLogin} = require('../middlewares/authMiddleware');


router.get('/:filename', isLogin, viewReceipt);

module.exports = router