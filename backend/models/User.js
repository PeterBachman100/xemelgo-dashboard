const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'User role is required'],
    enum: {
      values: ['Staff', 'Admin'],
      message: '{VALUE} is not a valid role'
    }
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);