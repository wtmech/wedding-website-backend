const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const invitesController = require('../controllers/invites.controller');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', invitesController.getInvites);

router.get('/search', invitesController.searchInvite);

router.post('/create', [
  body().isArray().withMessage('Request body must be an array').optional(),
  body('*.fullName').notEmpty().withMessage('Full name is required'),
  body('*.possiblePlusOne').optional().isString(),
  body('*.guestOf').isIn(['bride', 'groom']).withMessage('Guest of must be either bride or groom'),
  validate
], invitesController.createInvite);

router.put('/update/:id', [
  param('id').isMongoId().withMessage('Invalid invite ID'),
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('possiblePlusOne').optional().isString(),
  body('guestOf').optional().isIn(['bride', 'groom']).withMessage('Guest of must be either bride or groom'),
  body('invitationSent').optional().isBoolean(),
  body('invitationSentAt').optional().isISO8601(),
  validate
], invitesController.updateInvite);

router.delete('/delete/:id', [
  param('id').isMongoId().withMessage('Invalid invite ID'),
  validate
], invitesController.deleteInvite);

module.exports = router;