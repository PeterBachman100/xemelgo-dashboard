const Item = require('../models/Item');
const Event = require('../models/Event');

/**
 * SHARED INTERNAL HELPER (The "Engine")
 * Handles state change, location nullification, and event logging.
 */
const _performStatusUpdate = async (req, res, { 
  targetStatus, 
  actionType, 
  newLocation = null, 
  allowedTypes = [] 
}) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // 1. Type Validation
    if (allowedTypes.length > 0 && !allowedTypes.includes(item.solutionType)) {
      return res.status(400).json({ 
        message: `Action '${actionType}' is not allowed for ${item.solutionType}` 
      });
    }

    // 2. Apply State Changes
    item.status = targetStatus;
    
    // UPDATED NULLIFICATION LOGIC
    // Must include 'complete' to match the Item.js validator
    const terminalStatuses = ['missing', 'consumed', 'complete'];
    
    if (newLocation && !terminalStatuses.includes(targetStatus)) {
      item.currentLocation = { 
        _id: newLocation.id, 
        name: newLocation.name 
      };
    } else if (terminalStatuses.includes(targetStatus)) {
      item.currentLocation = null;
    }

    // Standard metadata updates
    item.lastUpdatedBy = { _id: req.user._id, name: req.user.name, role: req.user.role };
    // Note: 'updatedAt' is handled by timestamps: true, but manual tracking is fine too
    item.lastUpdatedAt = Date.now();

    // 3. Save Item (This triggers the Item.js validator)
    await item.save();

    // 4. Create Audit Event (This triggers the Event.js validator)
    await Event.create({
      itemId: item._id,
      user: { _id: req.user._id, name: req.user.name, role: req.user.role },
      location: item.currentLocation, // Now correctly null for 'complete'
      action: actionType
    });

    res.json(item);
  } catch (error) {
    // This will now catch "Physical Integrity Errors" from the schema
    res.status(400).json({ message: 'Validation Error', error: error.message });
  }
};

// --- PUBLIC CONTROLLERS ---

const moveItem = (req, res) => _performStatusUpdate(req, res, {
  targetStatus: 'active',
  actionType: 'moved',
  newLocation: { id: req.body.newLocationId, name: req.body.newLocationName },
  allowedTypes: ['asset']
});

const scanItem = (req, res) => _performStatusUpdate(req, res, {
  targetStatus: 'active',
  actionType: 'scanned',
  newLocation: { id: req.body.newLocationId, name: req.body.newLocationName },
  allowedTypes: ['inventory']
});

const receiveItem = (req, res) => _performStatusUpdate(req, res, {
  targetStatus: 'active',
  actionType: 'received',
  newLocation: { id: req.body.newLocationId, name: req.body.newLocationName },
  allowedTypes: ['workOrder']
});

const consumeItem = (req, res) => _performStatusUpdate(req, res, {
  targetStatus: 'consumed',
  actionType: 'consumed',
  allowedTypes: ['inventory']
});

const completeItem = (req, res) => _performStatusUpdate(req, res, {
  targetStatus: 'complete',
  actionType: 'completed',
  allowedTypes: ['workOrder']
});

const markMissing = (req, res) => _performStatusUpdate(req, res, {
  targetStatus: 'missing',
  actionType: 'missing',
  allowedTypes: ['asset']
});


// @desc    Get all items (with optional filtering)
// @route   GET /api/items
const getItems = async (req, res) => {
  try {
    const { solutionType, status, search } = req.query;
    let query = {};

    if (solutionType) query.solutionType = solutionType;
    if (status) query.status = status;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await Item.find(query).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get single item with its 10 most recent events
// @route   GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Fetch the 10 most recent events for this specific item
    const history = await Event.find({ itemId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Return a unified object
    res.json({
      ...item._doc, // Spread the item data
      history       // Attach the history array
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  moveItem,
  scanItem,
  receiveItem,
  consumeItem,
  completeItem,
  markMissing
};