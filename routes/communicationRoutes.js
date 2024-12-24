const express = require('express');
const {addCommunicationPermissions,getCommunicationPermissions} = require('../controllers/communicationController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/permissions', verifyToken, addCommunicationPermissions);
router.get('/permissions', verifyToken, getCommunicationPermissions);

module.exports = router;
