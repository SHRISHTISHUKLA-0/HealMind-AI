const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');
const auth = require('../middleware/auth');

router.post('/', auth, goalsController.create);
router.get('/', auth, goalsController.getAll);
router.put('/:id', auth, goalsController.update);
router.delete('/:id', auth, goalsController.delete);
router.put('/:id/progress', auth, goalsController.updateProgress);

module.exports = router;
