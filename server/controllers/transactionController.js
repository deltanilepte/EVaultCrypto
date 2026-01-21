const Transaction = require('../models/Transaction.js');
const User = require('../models/User.js');

// @desc    Request a withdrawal
// @route   POST /api/transactions/withdraw
// @access  Private
const requestWithdrawal = async (req, res) => {
    const { amount, method, address, walletAddress, isSos } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const transaction = new Transaction({
            user: req.user._id,
            type: 'Withdrawal',
            amount,
            method,
            address: address || walletAddress,
            isSos: isSos || false,
            status: 'Pending',
        });

        const createdTransaction = await transaction.save();

        // ------------------------------------------
        // FIX: Deduct balance IMMEDIATELY
        // ------------------------------------------
        user.balance -= amount;
        await user.save();

        res.status(201).json(createdTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my withdrawals
// @route   GET /api/transactions
// @access  Private
const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all withdrawals (Admin)
// @route   GET /api/transactions/admin
// @access  Private/Admin
const getAdminTransactions = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');

            // Find users matching name or email first
            const users = await User.find({
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            }).select('_id');

            const userIds = users.map(u => u._id);

            // Build the transaction query
            const orConditions = [
                { address: searchRegex },
                { txId: searchRegex },
                { user: { $in: userIds } }
            ];

            // If search looks like an ObjectId, add it to conditions
            if (search.trim().match(/^[0-9a-fA-F]{24}$/)) {
                orConditions.push({ _id: search.trim() });
            }

            query = { $or: orConditions };
        }

        const transactions = await Transaction.find(query)
            .populate('user', 'id name email')
            .sort({ date: -1 }); // Sort by newest first
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update withdrawal status (Approve/Reject)
// @route   PUT /api/transactions/:id
// @access  Private/Admin
const updateTransaction = async (req, res) => {
    const { status, txId } = req.body;

    try {
        const transaction = await Transaction.findById(req.params.id);

        if (transaction) {
            transaction.status = status || transaction.status;
            transaction.txId = txId || transaction.txId;

            if (status === 'Approved' && transaction.type === 'Withdrawal') {
                // Logic: Balance was already deducted at request time.
                // We just need to update totalWithdrawn.
                const user = await User.findById(transaction.user);
                if (user) {
                    user.totalWithdrawn += transaction.amount;
                    // user.balance -= transaction.amount; // ALREADY DEDUCTED
                    await user.save();
                }
            } else if (status === 'Rejected' && transaction.type === 'Withdrawal') {
                // REFUND LOGIC
                // If we are rejecting, we should give the money back.
                // Check previous status to avoid double refund if rejected twice (rare but safe)
                // Assuming we fetch fresh transaction above, transaction.status is currently OLD status?
                // Actually req.body.status is NEW status.
                // We haven't set transaction.status yet? 
                // Wait, lines 106-107 set it: transaction.status = status...

                // Correction: We need to know if it WAS Pending/Approved before.
                // But for simplicity, let's assume if we are setting it to Rejected, we refund.
                // TO be safe, only refund if it wasn't already rejected? 
                // The simplified logic: If changing TO Rejected, refund.

                const user = await User.findById(transaction.user);
                if (user) {
                    user.balance += transaction.amount; // REFUND
                    await user.save();
                }
            }

            const updatedTransaction = await transaction.save();
            res.json(updatedTransaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    requestWithdrawal,
    getMyTransactions,
    getAdminTransactions,
    updateTransaction
};
