const express = require('express');
const { incrementTagByLocation, getAllTags } = require('../controllers/incrementTag');

const router = express.Router();

router.post('/increment', incrementTagByLocation);
router.get('/increment', getAllTags)

module.exports = router;
