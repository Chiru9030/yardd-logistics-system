const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', landController.getLands);
router.get('/:id', landController.getLandById);
router.post('/', authenticate, landController.createLand);
router.patch('/:id/verify', authenticate, authorize('VERIFIER', 'ADMIN'), landController.verifyLand);

module.exports = router;
