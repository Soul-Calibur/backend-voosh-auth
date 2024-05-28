const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

router.get('/profile', authenticateUser, profileController.viewOwnProfile);
router.put('/profile', authenticateUser, profileController.editProfile);
router.get('/profiles', authenticateUser, profileController.listPublicProfiles);
router.get('/profiles/:id', authenticateUser, profileController.viewProfile);
router.get('/admin/profiles', authenticateUser, isAdmin, profileController.listAllProfiles);

module.exports = router;
