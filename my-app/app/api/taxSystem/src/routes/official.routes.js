// routes/auditorRoutes.js
const express = require('express');
const router = express.Router();
const { registerAuditor, loginOfficial, registerOfficial, getAllAuditors, getAuditorById, updateAuditor, deleteAuditor } = require('../controllers/official.controller');
const { isLogin, verifyCityOfficial } = require('../middlewares/authMiddleware'); // Optional

router.post('/register-auditor', isLogin, verifyCityOfficial, registerAuditor);
router.post('/login', loginOfficial);
router.post('/register', registerOfficial);
router.get('/auditors',  isLogin, verifyCityOfficial, getAllAuditors);
router.get('/auditors/:id',  isLogin, verifyCityOfficial, getAuditorById);
router.put('/auditors/:id',  isLogin, verifyCityOfficial, updateAuditor);
router.delete('/auditors/:id',  isLogin, verifyCityOfficial, deleteAuditor);


module.exports = router
