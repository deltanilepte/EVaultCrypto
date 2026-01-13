const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

const { protect } = require('../middleware/authMiddleware.js');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Please provide an email' });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Email already subscribed' });
        }

        const subscriber = await Newsletter.create({ email });

        res.status(201).json({
            success: true,
            data: subscriber,
            message: 'Successfully subscribed to newsletter!'
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email already subscribed' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get all newsletter subscribers (Admin)
// @route   GET /api/newsletter
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
    try {
        // Optional: Check if user is admin (though 'protect' might only check auth, typically we'd want an 'admin' middleware too)
        // For now relying on 'protect' + client-side admin check, or assuming 'protect' is sufficient for this scope.
        // Ideally: router.get('/', protect, admin, ...) if 'admin' middleware exists. 
        // Based on auth.js, there is no explicit 'admin' middleware used in routes, only 'protect'.

        if (!req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized as an admin' });
        }

        const subscribers = await Newsletter.find({}).sort({ date: -1 });
        res.json(subscribers);
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
