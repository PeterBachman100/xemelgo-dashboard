const mongoose = require('mongoose');
const ReferenceSchema = require('./Schemas');

const eventSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Parent item ID is required'],
    index: true 
  },
  user: {
    type: ReferenceSchema,
    required: [true, 'User snapshot is required']
  },
  location: {
    type: ReferenceSchema,
    default: null,
    validate: {
      validator: function(value) {
        const hasLocation = !!value;

        // location MUST be null if action is 'missing' or 'consumed'
        if (['missing', 'consumed'].includes(this.action) && hasLocation) {
          return false;
        }
        
        // location MUST be provided for physical moves or completions
        // Matches enums: scanned, received, moved, completed
        if (['scanned', 'received', 'moved', 'completed'].includes(this.action) && !hasLocation) {
          return false;
        }
        
        return true;
      },
      message: props => `Location integrity error: For action "${this.action}", location must be ${['missing', 'consumed'].includes(this.action) ? 'null' : 'provided'}.`
    }
  },
  action: {
    type: String,
    required: true,
    enum: ['scanned', 'received', 'moved', 'missing', 'consumed', 'completed'],
    immutable: true 
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true 
  },
  isAdminAction: {
    type: Boolean,
    default: false
  }
}, {
  // Events are append-only; we don't need or want updatedAt
  timestamps: { createdAt: true, updatedAt: false } 
});

// Compound index for high-performance history sorting on the Detail Page
eventSchema.index({ itemId: 1, timestamp: -1 });

module.exports = mongoose.model('Event', eventSchema);