const express = require('express');
const router = express.Router();
const { 
  getItems, 
  getItemById, 
  moveItem, 
  consumeItem, 
  completeItem, 
  markMissing 
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getItems);
router.get('/:id', getItemById);
router.patch('/:id/move', moveItem);
router.patch('/:id/consume', consumeItem);
router.patch('/:id/complete', completeItem);
router.patch('/:id/mark-missing', markMissing);

module.exports = router;