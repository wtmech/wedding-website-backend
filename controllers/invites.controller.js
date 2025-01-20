const Invite = require('../models/invites.model');

exports.getInvites = async (req, res) => {
  try {
    const invites = await Invite.find().populate('rsvp');
    res.json(invites);
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
};

exports.searchInvite = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const invite = await Invite.findOne({
      $or: [
        { fullName: { $regex: new RegExp('^' + name + '$', 'i') } },
        { possiblePlusOne: { $regex: new RegExp('^' + name + '$', 'i') } }
      ]
    }).populate('rsvp');

    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Transform the response to include the attendance status
    const response = {
      ...invite.toObject(),
      rsvp: invite.rsvp ? invite.rsvp.attending : null
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createInvite = async (req, res) => {
  try {
    // Check if the request body is an array
    const inviteData = Array.isArray(req.body) ? req.body : [req.body];

    const savedInvites = [];
    const errors = [];

    // Process each invite
    for (const invite of inviteData) {
      try {
        const newInvite = new Invite({
          ...invite,
          rsvp: null
        });
        const savedInvite = await newInvite.save();
        savedInvites.push(savedInvite);
      } catch (error) {
        errors.push({
          invite: invite.fullName,
          error: error.message
        });
      }
    }

    // Return response based on results
    if (errors.length > 0) {
      return res.status(207).json({
        success: savedInvites,
        errors: errors
      });
    }

    res.status(201).json(savedInvites);
  } catch (error) {
    console.error('Error creating invite(s):', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updateInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedInvite = await Invite.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedInvite) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    res.json(updatedInvite);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.deleteInvite = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvite = await Invite.findByIdAndDelete(id);
    if (!deletedInvite) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    res.json({ message: 'Invite deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}