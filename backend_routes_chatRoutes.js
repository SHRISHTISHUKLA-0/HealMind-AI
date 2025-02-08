const express = require('express');
const { getResponse } = require('../controllers/chatController');

const router = express.Router();

router.post('/message', getResponse);

module.exports = router;