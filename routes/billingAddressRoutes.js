const express = require('express');
const {addBillingAddress,getUserBillingAddresses} = require('../controllers/billingAddressController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', verifyToken, addBillingAddress);
router.get('/', verifyToken, getUserBillingAddresses);

module.exports = router;
