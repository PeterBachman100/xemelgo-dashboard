const Item = require('../models/Item');
const Event = require('../models/Event');

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


// @desc    Move item to a new location & record event
// @route   PATCH /api/items/:id/move
const moveItem = async (req, res) => {
  const { newLocationId, newLocationName } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.currentLocation = { _id: newLocationId, name: newLocationName };
    item.lastUpdatedBy = { _id: req.user._id, name: req.user.name, role: req.user.role };
    item.status = 'active';

    await item.save();

    await Event.create({
      itemId: item._id,
      user: { _id: req.user._id, name: req.user.name, role: req.user.role },
      location: { _id: newLocationId, name: newLocationName },
      action: item.solutionType === 'asset' ? 'moved' : 'scanned'
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Mark item as Consumed (Inventory only)
// @route   PATCH /api/items/:id/consume
const consumeItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.solutionType !== 'inventory') {
      return res.status(400).json({ message: 'Only Inventory can be consumed.' });
    }

    item.status = 'consumed';
    item.lastUpdatedBy = { _id: req.user._id, name: req.user.name, role: req.user.role };
    await item.save();

    await Event.create({
      itemId: item._id,
      user: { _id: req.user._id, name: req.user.name, role: req.user.role },
      location: item.currentLocation,
      action: 'consumed'
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark item as Complete (WorkOrders only)
// @route   PATCH /api/items/:id/complete
const completeItem = async (req, res) => {
  console.log(req.user);
  try {
    const item = await Item.findById(req.params.id);
    if (!item || item.solutionType !== 'workOrder') {
      return res.status(400).json({ message: 'Only workOrders can be completed.' });
    }

    item.status = 'complete';
    item.lastUpdatedBy = { _id: req.user._id, name: req.user.name, role: req.user.role };
    await item.save();

    await Event.create({
      itemId: item._id,
      user: { _id: req.user._id, name: req.user.name, role: req.user.role },
      location: item.currentLocation,
      action: 'completed'
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Mark item as Missing
// @route   PATCH /api/items/:id/mark-missing
const markMissing = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.status = 'missing';
    item.lastUpdatedBy = { _id: req.user._id, name: req.user.name, role: req.user.role };
    await item.save();

    await Event.create({
      itemId: item._id,
      user: { _id: req.user._id, name: req.user.name, role: req.user.role },
      location: item.currentLocation,
      action: 'missing'
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getItems,
  getItemById,
  moveItem,
  consumeItem,
  completeItem,
  markMissing
};