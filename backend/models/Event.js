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
      
      // NEW LOGIC: location MUST be null if the action is terminal
      // We've added 'completed' to this list
      const terminalActions = ['missing', 'consumed', 'completed'];
      
      if (terminalActions.includes(this.action)) {
        return !hasLocation; // Must be null
      }
      
      // location MUST be provided for active physical movements
      const movementActions = ['scanned', 'received', 'moved'];
      if (movementActions.includes(this.action)) {
        return hasLocation; // Must NOT be null
      }
      
      return true;
    },
    message: function(props) {
      const terminalActions = ['missing', 'consumed', 'completed'];
      return `Audit Integrity Error: The "${this.action}" action ${
        terminalActions.includes(this.action) 
          ? "must have a null location" 
          : "requires a location snapshot"
      }.`;
    }
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