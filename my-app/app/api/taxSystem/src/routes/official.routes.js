// routes/auditorRoutes.js
const express = require('express');
const router = express.Router();
const { registerAuditor, loginOfficial, registerOfficial, getAllAuditors, getAuditorById, updateAuditor, deleteAuditor } = require('../controllers/official.controller');
const { isLogin, verifyCityOfficial } = require('../middlewares/authMiddleware'); // Optional

router.post('/register-auditor', isLogin, verifyCityOfficial, registerAuditor);
router.post('/login', loginOfficial);
router.post('/register', registerOfficial);
router.get('/auditors', verifyCityOfficial, getAllAuditors);
router.get('/auditors/:id', verifyCityOfficial, getAuditorById);
router.put('/auditors/:id', verifyCityOfficial, updateAuditor);
router.delete('/auditors/:id', verifyCityOfficial, deleteAuditor);


module.exports = router
