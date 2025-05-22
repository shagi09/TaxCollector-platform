// routes/auditorRoutes.js
const express = require('express');
const router = express.Router();
const { registerAuditor, loginOfficial, registerOfficial } = require('../controllers/official.controller');
const { isLogin, verifyCityOfficial } = require('../middlewares/authMiddleware'); // Optional

router.post('/register-auditor', isLogin, verifyCityOfficial, registerAuditor);
router.post('/login', loginOfficial);
router.post('/register', registerOfficial);


module.exports = router;
