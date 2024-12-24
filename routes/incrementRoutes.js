const express = require('express');
const { incrementTagByLocation } = require('../controllers/incrementTag');

const router = express.Router();

router.post('/increment', incrementTagByLocation);

module.exports = router;
