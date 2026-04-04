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
    required: true,
    enum: ['active', 'missing', 'consumed', 'complete'],
    default: 'active',
    validate: {
      validator: function(value) {
        const hasLocation = !!this.currentLocation;

        // Active items MUST have a location (All types)
        if (value === 'active' && !hasLocation) return false;

        // Missing Assets MUST have null location
        if (value === 'missing' && this.solutionType === 'asset' && hasLocation) return false;

        // Consumed Inventory MUST have null location
        if (value === 'consumed' && this.solutionType === 'inventory' && hasLocation) return false;

        // Only Inventory can be 'consumed'
        if (value === 'consumed' && this.solutionType !== 'inventory') return false;
        
        // Only WorkOrders can be 'complete'
        if (value === 'complete' && this.solutionType !== 'workOrder') return false;
        
        // Assets cannot be 'consumed' or 'complete'
        if (this.solutionType === 'asset' && ['consumed', 'complete'].includes(value)) return false;
        
        return true;
      },
      message: props => `Invalid status logic: ${props.value} is not allowed for this ${this.solutionType} configuration.`
    }
  },
  currentLocation: {
    type: ReferenceSchema,
    default: null 
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