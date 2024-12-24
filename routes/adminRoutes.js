const express = require('express');
const { registerAdmin, loginAdmin, getLoginHistory } = require('../controllers/adminController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/history', verifyToken, getLoginHistory);

module.exports = router;
