const express = require('express');
const router = express.Router();
const meditationController = require('../controllers/meditationController');
const auth = require('../middleware/auth');

router.post('/session', auth, meditationController.saveSession);
router.get('/sessions', auth, meditationController.getSessions);
router.get('/stats', auth, meditationController.getStats);
router.put('/session/:id', auth, meditationController.updateProgress);

module.exports = router;
