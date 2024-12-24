const express = require('express');
const { sendNotification, getNotifications } = require('../controllers/notificationController');
const verifyToken = require('../middleware/authMiddleware'); 

const router = express.Router();


router.post('/send', verifyToken, sendNotification);
router.get('/list', getNotifications);

module.exports = router;
