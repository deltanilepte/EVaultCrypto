const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const Newsletter = require('../models/Newsletter');

/**
 * @desc    Get Admin Notifications (Aggregated Recent Activity)
 * @route   GET /api/admin/notifications
 * @access  Private/Admin
 */
const getNotifications = async (req, res) => {
    try {
        // Fetch recent 5 items from each collection with User details
        const recentUsers = await User.find().sort({ joinDate: -1 }).limit(5);
        const recentInvestments = await Investment.find().populate('user', 'name').sort({ startDate: -1 }).limit(5);
        // Only fetch pending withdrawals for notifications usually, or recent withdrawals
        const recentWithdrawals = await Transaction.find({ type: 'Withdrawal' }).populate('user', 'name').sort({ date: -1 }).limit(5);
        const recentNewsletters = await Newsletter.find().sort({ subscribedAt: -1 }).limit(5);

        let notifications = [];

        // Normalize Users
        recentUsers.forEach(user => {
            notifications.push({
                id: user._id,
                type: 'User',
                message: `New user registered: ${user.name}`,
                date: user.joinDate,
                link: '/admin/users',
                icon: 'UsersIcon'
            });
        });

        // Normalize Investments
        recentInvestments.forEach(inv => {
            const userName = inv.user ? inv.user.name : 'Unknown User';
            notifications.push({
                id: inv._id,
                type: 'Investment',
                message: `New investment of $${inv.amount} in ${inv.method} by ${userName}`,
                date: inv.startDate || inv.createdAt,
                link: '/admin/investments',
                icon: 'BanknotesIcon'
            });
        });

        // Normalize Withdrawals
        recentWithdrawals.forEach(tx => {
            const userName = tx.user ? tx.user.name : 'Unknown User';
            notifications.push({
                id: tx._id,
                type: 'Withdrawal',
                message: `Withdrawal request of $${tx.amount} (${tx.status}) by ${userName}`,
                date: tx.date || tx.createdAt,
                link: '/admin/withdrawals',
                icon: 'DocumentCheckIcon'
            });
        });

        // Normalize Newsletters
        recentNewsletters.forEach(news => {
            notifications.push({
                id: news._id,
                type: 'Newsletter',
                message: `New newsletter subscriber: ${news.email}`,
                date: news.subscribedAt,
                link: '/admin/newsletter',
                icon: 'EnvelopeIcon'
            });
        });

        // Sort by date descending
        notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Return top 20 aggregated notifications
        res.json(notifications.slice(0, 20));

    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        res.status(500).json({ message: "Server Error fetching notifications" });
    }
};

module.exports = {
    getNotifications
};
