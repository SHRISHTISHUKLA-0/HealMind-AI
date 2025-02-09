const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.post('/message', auth, chatController.sendMessage);
router.get('/history', auth, chatController.getHistory);
router.delete('/history', auth, chatController.deleteHistory);

module.exports = router;
