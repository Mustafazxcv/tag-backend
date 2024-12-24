const express = require('express');
const { rentScooter, getCurrentScooter, endScooterRental } = require('../controllers/rentalController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/rent', verifyToken, rentScooter);
router.get('/current-scooter', verifyToken, getCurrentScooter);
router.post('/end-rental', verifyToken, endScooterRental);

module.exports = router;
