const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const { validateProfileUpdate } = require('../middleware/validationMiddleware');
const errorHandler = require('../middleware/errorMiddleware');

router.get('/profile', authenticateUser, profileController.viewOwnProfile);
router.put('/profile', authenticateUser, validateProfileUpdate, profileController.editProfile);
router.get('/public', authenticateUser, profileController.listPublicProfiles);
router.get('/:id', authenticateUser, profileController.viewProfile);
router.get('/admin/all', authenticateUser, isAdmin, profileController.listAllProfiles);

router.use(errorHandler); // Central error handling middleware

module.exports = router;
