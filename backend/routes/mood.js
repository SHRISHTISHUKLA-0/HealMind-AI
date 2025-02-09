const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

router.post('/', auth, moodController.saveMood);
router.get('/history', auth, moodController.getHistory);
router.get('/stats', auth, moodController.getStats);
router.delete('/:id', auth, moodController.deleteMood);

module.exports = router;
