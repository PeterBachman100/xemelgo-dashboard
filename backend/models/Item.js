const mongoose = require('mongoose');
const ReferenceSchema = require('./Schemas');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    trim: true
  },
  solutionType: {
    type: String,
    required: true,
    enum: ['asset', 'inventory', 'workOrder'],
    immutable: true 
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['active', 'missing', 'consumed', 'complete'],
      message: '{VALUE} is not a valid status. Please use: active, missing, consumed, or complete.'
    },
    default: 'active',
  },
  currentLocation: {
    type: ReferenceSchema,
    default: null,
    validate: {
    validator: function(value) {
      const terminalStatuses = ['missing', 'consumed', 'complete'];
      
      if (terminalStatuses.includes(this.status)) {
        // TERMINAL: Location MUST be null
        return value === null;
      } else {
        // ACTIVE: Location MUST be a valid object
        return value !== null && typeof value === 'object' && value.name;
      }
    },
    message: props => `Location error: ${this.status} items must have ${['missing', 'consumed', 'complete'].includes(this.status) ? 'null' : 'a valid'} location.`
  }
  },
  lastUpdatedBy: {
    type: ReferenceSchema,
    required: [true, 'Last updated user is required']
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

// Indices for Dashboard performance
itemSchema.index({ status: 1 });
itemSchema.index({ solutionType: 1 });
itemSchema.index({ name: 'text' }); 

module.exports = mongoose.model('Item', itemSchema);