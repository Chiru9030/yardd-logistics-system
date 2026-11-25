const express = require('express');
const router = express.Router();
const txController = require('../controllers/transactionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', txController.getTransactions);
router.post('/', authenticate, txController.createTransaction);
router.patch('/:id/status', authenticate, txController.updateStatus);

module.exports = router;
