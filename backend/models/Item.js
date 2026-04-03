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
    enum: ['Asset', 'Inventory', 'WorkOrder'],
    immutable: true 
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Missing', 'Consumed', 'Complete'],
    default: 'Active',
    validate: {
      validator: function(value) {
        // If Active, it MUST have a location
        if (value === 'Active' && !this.currentLocation) {
          return false;
        }

       if (value === 'Consumed' && this.solutionType !== 'Inventory') {
            return false; // Only Inventory can be consumed
        }
        if (value === 'Complete' && this.solutionType !== 'WorkOrder') {
            return false; // Only Work Orders can be completed
        }
        if (this.solutionType === 'Asset' && (value === 'Consumed' || value === 'Complete')) {
            return false;
        }
        
        return true;
      },
      message: props => `Invalid status logic: ${props.value} is not allowed for this item configuration.`
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