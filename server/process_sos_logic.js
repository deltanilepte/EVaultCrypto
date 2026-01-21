const mongoose = require('mongoose');
const User = require('./models/User');
const Investment = require('./models/Investment');
const Transaction = require('./models/Transaction');

const MONGO_URI = 'mongodb+srv://zarwebcoders:zarwebcoders@cluster0.lqgakzj.mongodb.net/evault';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const txId = '6970985a175d048685a8408f'; // The 600 SOS transaction
        const transaction = await Transaction.findById(txId);

        if (!transaction) {
            console.log('Transaction not found');
            return;
        }

        console.log(`Transaction found: Status=${transaction.status}, isSos=${transaction.isSos}, Amount=${transaction.amount}`);

        if (transaction.status !== 'Approved') {
            console.log('Transaction is NOT Approved. Cannot process logic.');
        }

        // SIMULATE LOGIC
        console.log('--- Simulating SOS Logic ---');

        let remainingToDeduct = Number(transaction.amount); // 600
        console.log(`Remaining to deduct: ${remainingToDeduct}`);

        const investments = await Investment.find({
            user: transaction.user,
            status: 'Active'
        }).sort({ startDate: 1 });

        console.log(`Found ${investments.length} Active Investments`);

        for (const inv of investments) {
            console.log(`Checking Inv ${inv._id}: Amount=${inv.amount}`);

            if (remainingToDeduct <= 0) break;

            if (inv.amount <= remainingToDeduct) {
                console.log('-> Investment fully used');
                remainingToDeduct -= inv.amount;
                // inv.amount = 0;
                // inv.status = 'Terminated';
            } else {
                console.log('-> Investment partially used');
                // inv.amount -= remainingToDeduct;
                remainingToDeduct = 0;
            }
        }

        const actualDeducted = Number(transaction.amount) - remainingToDeduct;
        console.log(`Actual Deducted would be: ${actualDeducted}`);

        // Check User
        const user = await User.findById(transaction.user);
        console.log(`User TotalInvested: ${user.totalInvested}`);
        console.log(`New TotalInvested would be: ${Math.max(0, user.totalInvested - actualDeducted)}`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
