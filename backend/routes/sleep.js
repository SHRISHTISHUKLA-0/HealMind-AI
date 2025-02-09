const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleepController');
const auth = require('../middleware/auth');

router.post('/journal', auth, sleepController.saveJournal);
router.get('/journals', auth, sleepController.getJournals);
router.put('/journal/:id', auth, sleepController.updateJournal);
router.get('/stats', auth, sleepController.getStats);

module.exports = router;
