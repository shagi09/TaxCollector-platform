// routes/auditorRoutes.js
const express = require('express');
const router = express.Router();
const { registerAuditor, loginOfficial } = require('../controllers/official.controller');
const { authMiddleware, verifyCityOfficial } = require('../middleware/authMiddleware'); // Optional

router.post('/official/register-auditor', authMiddleware, verifyCityOfficial, registerAuditor);
router.post('/login', loginOfficial);

module.exports = router;
