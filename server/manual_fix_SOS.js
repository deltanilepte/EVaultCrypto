const mongoose = require('mongoose');
const User = require('./models/User');
const Investment = require('./models/Investment');
const Transaction = require('./models/Transaction');

const MONGO_URI = 'mongodb+srv://zarwebcoders:zarwebcoders@cluster0.lqgakzj.mongodb.net/evault';

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'test2@gmail.com' });
        if (!user) { console.log('User not found'); return; }

        console.log(`User: ${user.name}`);
        console.log(`Current Invested: ${user.totalInvested}`);

        // FIX: Reduce by 600 (Assume 1000 -> 400)
        // Check Active Investment
        const investment = await Investment.findOne({ user: user._id, status: 'Active' });
        if (investment) {
            console.log(`Found Active Investment: ${investment.amount}`);
            if (investment.amount === 1000) {
                console.log('Updating Investment to 400...');
                investment.amount = 400;
                await investment.save();
                console.log('Investment Updated.');
            } else {
                console.log('Investment amount mismatch? Skipping Inv update.');
            }
        }

        if (user.totalInvested === 1000) {
            console.log('Updating User Total Invested to 400...');
            user.totalInvested = 400;
            // Balance logic: User said "ROI 50 deducted". 
            // If actual balance is 50 in DB, I will leaving it alone unless user wants it 0?
            // User said "balance was 50... 50 deducted".
            // If they want it back, I should add 50?
            // "roi me jo 50 bache the jo minus ho gaye hai" -> "The 50 left were deducted".
            // Assuming this was accidental deduction (Normal withdrawal bug), I should REFUND 50?
            // But wait, step 105 said Balance IS 50.
            // So it was NOT deducted in DB. User might just be confused?
            // I will LEAVE Balance at 50.
            await user.save();
            console.log('User Updated.');
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
