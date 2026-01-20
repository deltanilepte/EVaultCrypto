const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile, getUsers, forgotPassword, toggleUserBlockStatus, updateUserByAdmin, verifyEmail, resendVerificationEmail } = require('../controllers/authController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.get('/users', protect, getUsers); // Should serve as /api/auth/users
router.put('/users/:id', protect, updateUserByAdmin); // Update user (password)
router.put('/users/:id/block', protect, toggleUserBlockStatus);

module.exports = router;
