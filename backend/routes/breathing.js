const express = require('express');
const router = express.Router();
const breathingController = require('../controllers/breathingController');
const auth = require('../middleware/auth');

router.post('/pattern', auth, breathingController.savePattern);
router.get('/patterns', auth, breathingController.getPatterns);
router.put('/pattern/:id', auth, breathingController.updatePattern);
router.delete('/pattern/:id', auth, breathingController.deletePattern);

module.exports = router;
