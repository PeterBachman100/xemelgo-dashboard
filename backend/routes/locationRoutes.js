const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getLocations, getLocationById } = require('../controllers/locationController');

router.use(protect);
router.get('/', getLocations);
router.get('/:id', getLocationById);

module.exports = router;