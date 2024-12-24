const express = require('express');
const { getUserBalance, loadBalance, getUserBalanceWithTransactions, transferBalanceByPhone } = require('../controllers/balanceController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getUserBalance);
router.post('/load', verifyToken, loadBalance);
router.get('/transactions', verifyToken, getUserBalanceWithTransactions);
router.post('/transfer-by-phone', verifyToken, transferBalanceByPhone); 

module.exports = router;
