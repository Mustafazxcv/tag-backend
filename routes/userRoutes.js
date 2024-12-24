const express = require('express');
const { registerUser, loginUser, updateUserInfo, getUserInfo, checkPhoneNumber } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update', verifyToken, updateUserInfo);
router.get('/info', verifyToken, getUserInfo);
router.post('/check-phone', checkPhoneNumber);


module.exports = router;
