const mongoose = require('mongoose');


const ReferenceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Staff', 'Admin'],
    // Optional: Only used when snapshotting a User
    required: false 
  }
}, { 
  _id: false // Prevents Mongoose from creating a unique ID for the sub-object
});

module.exports = ReferenceSchema;