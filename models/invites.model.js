const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  possiblePlusOne: {
    type: String,
    trim: true
  },
  guestOf: {
    type: String,
    enum: ['bride', 'groom'],
    required: [true, 'Guest of (bride or groom) is required']
  },
  invitationSent: {
    type: Boolean,
    default: false
  },
  invitationSentAt: {
    type: Date,
    default: null
  },
  rsvp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rsvp',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

inviteSchema.path('fullName').validate(function(value) {
  return value.length >= 2;
}, 'Full name must be at least 2 characters long');

const Invite = mongoose.model('Invite', inviteSchema);

module.exports = Invite;