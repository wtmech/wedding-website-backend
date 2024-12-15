const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  invitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invite',
    required: true
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String
  },
  isMainInvitee: {
    type: Boolean,
    required: true
  },
  attending: {
    type: Boolean,
    required: true,
  },
  plusOne: {
    fullName: String,
    attending: Boolean,
    dietaryRestrictions: String
  },
  children: [{
    name: String,
    age: Number,
    dietaryRestrictions: String
  }],
  dietaryRestrictions: String,
  additionalNotes: String,
  respondedAt: {
    type: Date,
    default: Date.now
  }
});

const Rsvp = mongoose.model('Rsvp', rsvpSchema);

module.exports = Rsvp;
