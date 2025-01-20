const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const rsvpController = require('../controllers/rsvp.controller');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

router.get('/', rsvpController.getRsvps);

router.post('/rsvp', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('attending').isBoolean().withMessage('Attending status is required'),
  body('plusOne').optional().isObject(),
  body('plusOne.fullName').optional().isString(),
  body('plusOne.dietaryRestrictions').optional().isString(),
  body('children').optional().isArray(),
  body('children.*.name').optional().isString(),
  body('children.*.dietaryRestrictions').optional().isString(),
  body('dietaryRestrictions').optional().isString(),
  body('additionalNotes').optional().isString(),
  body('invitation').notEmpty().withMessage('Invitation ID is required'),
  validate
], rsvpController.createRsvp);

module.exports = router;