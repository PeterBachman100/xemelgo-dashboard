const Location = require('../models/Location');

// @desc    Get all locations for dropdowns/filters
// @route   GET /api/locations
const getLocations = async (req, res) => {
  try {
    // Sorting alphabetically makes for a better User Experience (UX)
    const locations = await Location.find({}).sort({ name: 1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a single location by ID
// @route   GET /api/locations/:id
const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getLocations,
  getLocationById
};