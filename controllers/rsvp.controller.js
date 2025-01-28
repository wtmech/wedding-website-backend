const Rsvp = require('../models/rsvp.model');
const Invite = require('../models/invites.model');

exports.getRsvps = async (req, res) => {
  try {
    const rsvps = await Rsvp.find();
    res.json(rsvps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRsvp = async (req, res) => {
  try {
    const { invitation, fullName, attending, plusOne, children, dietaryRestrictions, additionalNotes } = req.body;

    // Check if the invitation exists
    const invite = await Invite.findById(invitation);
    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // Create a new RSVP
    const newRsvp = new Rsvp({
      invitation: invite._id,
      fullName,
      attending,
      isMainInvitee: invite.fullName.toLowerCase() === fullName.toLowerCase(),
      plusOne: plusOne ? {
        fullName: plusOne.fullName,
        dietaryRestrictions: plusOne.dietaryRestrictions
      } : undefined,
      children,
      dietaryRestrictions,
      additionalNotes
    });

    // Save the RSVP
    const savedRsvp = await newRsvp.save();

    // Update the invite with the RSVP reference
    invite.rsvp = savedRsvp._id;
    await invite.save();

    res.status(201).json(savedRsvp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};