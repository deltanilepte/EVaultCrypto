const mongoose = require('mongoose');
const User = require('./models/User');
const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const checkUser = async () => {
    await connectDB();

    const outputObj = {};

    const urlToken = '75bea03b5a6ea992a18d96f1e22a2cdc5186ccc3';

    // Hash the token properly
    const hashedToken = crypto
        .createHash('sha256')
        .update(urlToken)
        .digest('hex');

    outputObj.urlToken = urlToken;
    outputObj.hashedToken = hashedToken;

    const user = await User.findOne({ verificationToken: hashedToken });

    if (user) {
        outputObj.foundUser = {
            email: user.email,
            verificationToken: user.verificationToken,
            expire: user.verificationTokenExpire,
            now: new Date()
        };
    } else {
        outputObj.foundUser = null;
    }

    const allUsers = await User.find({ verificationToken: { $exists: true, $ne: null } });
    outputObj.allUsers = allUsers.map(u => ({
        email: u.email,
        token: u.verificationToken
    }));

    fs.writeFileSync('debug_result.json', JSON.stringify(outputObj, null, 2));
    console.log("Debug complete, wrote to debug_result.json");

    mongoose.connection.close();
};

checkUser();
