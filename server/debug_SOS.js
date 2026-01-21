const mongoose = require('mongoose');
const User = require('./models/User');
const Investment = require('./models/Investment');
const Transaction = require('./models/Transaction');

const MONGO_URI = 'mongodb+srv://zarwebcoders:zarwebcoders@cluster0.lqgakzj.mongodb.net/evault';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // User ID from the screenshot: 696fb6a8577d680eb91a1fef
        // OR search by email test2@gmail.com
        const user = await User.findOne({ email: 'test2@gmail.com' });
        if (!user) {
            console.log('User not found!');
            return;
        }
        console.log(`User Found: ${user.name} (${user._id})`);
        console.log(`User Totals -> Invested: ${user.totalInvested}, Withdrawn: ${user.totalWithdrawn}, Balance: ${user.balance}`);

        const investments = await Investment.find({ user: user._id });
        console.log(`\nFound ${investments.length} Total Investments:`);
        investments.forEach(inv => {
            console.log(`- ID: ${inv._id}, Amount: ${inv.amount}, Status: '${inv.status}', StartDate: ${inv.startDate}`);
        });

        // Check if there are any strictly 'Active' ones
        const activeInv = await Investment.find({ user: user._id, status: 'Active' });
        console.log(`\nStrictly 'Active' Investments: ${activeInv.length}`);
        activeInv.forEach(inv => console.log(`   -> InvID: ${inv._id}, Amount: ${inv.amount}`));

        // Check Pending Transactions
        // const pendingTx = await Transaction.find({ user: user._id, status: 'Pending', type: 'Withdrawal' });
        // Inspect valid transaction 697094ee2932795d9012d8dc
        const tx = await Transaction.findById('697094ee2932795d9012d8dc');
        if (tx) {
            console.log(`\nTransaction ${tx._id}:`);
            console.log(`- Status: ${tx.status}`);
            console.log(`- Amount: ${tx.amount}`);
            console.log(`- isSos: ${tx.isSos} (${typeof tx.isSos})`);
        } else {
            console.log('\nTransaction 697094ee2932795d9012d8dc NOT FOUND');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
