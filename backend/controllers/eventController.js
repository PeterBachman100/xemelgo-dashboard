const Event = require('../models/Event');

// @desc    Get all events for a specific item
// @route   GET /api/events/item/:itemId
const getEventsByItem = async (req, res) => {
  try {
    const events = await Event.find({ itemId: req.params.itemId })
      .sort({ createdAt: -1 }); // Newest first
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get recent global activity (Optional Dashboard Feed)
// @route   GET /api/events
const getRecentEvents = async (req, res) => {
  try {
    const events = await Event.find({})
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getEventsByItem,
  getRecentEvents
};