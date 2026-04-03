const mongoose = require('mongoose');
const ReferenceSchema = require('./Schemas');

const eventSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Parent item ID is required'],
    index: true // Optimized for "Get Item History" queries
  },
  user: {
    type: ReferenceSchema,
    required: [true, 'User snapshot is required']
  },
  location: {
    type: ReferenceSchema,
    // Can be null if the action is 'consumed', 'completed', or 'missing'
    default: null 
  },
  action: {
    type: String,
    required: true,
    enum: ['scanned', 'received', 'moved', 'missing', 'consumed', 'completed'],
    immutable: true // History cannot be changed once written
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true // Optimized for "Recent Activity" sorting
  },
  isAdminAction: {
    type: Boolean,
    default: false
  }
}, {
  // Disable updatedAt because Events are append-only; we only care when it was born
  timestamps: { createdAt: true, updatedAt: false } 
});

// Compound index for lightning-fast history lookups per item (newest first)
eventSchema.index({ itemId: 1, timestamp: -1 });

module.exports = mongoose.model('Event', eventSchema);