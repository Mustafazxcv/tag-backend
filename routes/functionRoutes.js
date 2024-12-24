const express = require('express');
const { saveGmail, saveContactMessage, getContactMessages } = require('../controllers/functionController');

const router = express.Router();

router.post('/gmail',saveGmail);
router.post('/contact', saveContactMessage)
router.get('/contact', getContactMessages)


module.exports = router;
