const mongoose = require('mongoose');
const ResidentSchema = new mongoose.Schema({
  firstName: {
    type: String, 
    required: [true, 'Please provide a first name.'],
    maxlength: 60 
  },
  middleName: {
    type: String, 
    maxlength: 60 
  },
  lastName: {
    type: String, 
    required: [true, 'Please provide a last name.'],
    maxlength: 60 
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Please provide a gender.']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide a date of birth.']
  },
  status: {
    type: String,
    enum: ['active', 'discharged', 'hospitalized'],
    default: 'active'
  },
  hospice: {
    type: Boolean,
    required: [true, 'Please provide a hospice status.']
  },
  roomNumber: {
    type: Number,
    default: null
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user']
  }
}, {timestamps: true})

module.exports = mongoose.model('Resident', ResidentSchema);
