const express = require('express');
const { addScooter, updateScooter, getAllScooters } = require('../controllers/scooterController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', verifyToken, addScooter);
router.put('/update/:id', verifyToken, updateScooter);
router.get('/all', getAllScooters);

module.exports = router;
