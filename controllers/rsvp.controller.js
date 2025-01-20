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
    const { fullName, attending, plusOne, children, dietaryRestrictions, additionalNotes } = req.body;

    // Check if the invitation exists
    const invite = await Invite.findOne({
      $or: [
        { fullName: { $regex: new RegExp('^' + fullName + '$', 'i') } },
        { possiblePlusOne: { $regex: new RegExp('^' + fullName + '$', 'i') } }
      ]
    });
    if (!invite) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const isOriginalMainInvitee = invite.fullName.toLowerCase() === fullName.toLowerCase();

    // If the RSVP is from the plus one, swap the roles
    let mainInviteeName, plusOneName, plusOneDietaryRestrictions;
    if (isOriginalMainInvitee) {
      mainInviteeName = fullName;
      plusOneName = plusOne ? plusOne.fullName : undefined;
      plusOneDietaryRestrictions = plusOne ? plusOne.dietaryRestrictions : undefined;
    } else {
      mainInviteeName = fullName;
      plusOneName = invite.fullName;
      plusOneDietaryRestrictions = undefined;
    }

    // Create a new RSVP
    const newRsvp = new Rsvp({
      invitation: invite._id,
      fullName: mainInviteeName,
      attending,
      isMainInvitee: true,
      plusOne: plusOneName ? {
        fullName: plusOneName,
        dietaryRestrictions: plusOneDietaryRestrictions
      } : undefined,
      children: children,
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