const express = require('express');
const router = express.Router();
const { getEventsByItem, getRecentEvents } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getRecentEvents);
router.get('/item/:itemId', getEventsByItem);

module.exports = router;