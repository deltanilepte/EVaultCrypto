const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    roiRates: {
        type: Map,
        of: new mongoose.Schema({
            rate: Number,
            period: String,
            walletAddress: { type: String, default: '' },
            walletAddressTRC: { type: String, default: '' },
            walletAddressBEP: { type: String, default: '' }
        }),
        default: {}
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensure we only have one config document
configSchema.statics.getSingleton = async function () {
    let config = await this.findOne().sort({ createdAt: -1 });
    if (!config) {
        // Default Config
        config = await this.create({
            roiRates: {
                USDT: { rate: 5, period: 'Monthly' },
                DOGE: { rate: 3, period: 'Monthly' },
                XRP: { rate: 3, period: 'Monthly' },
                ETH: { rate: 2.7, period: 'Monthly' },
                SOL: { rate: 2.9, period: 'Monthly' },
                BNB: { rate: 2.91, period: 'Monthly' },
                BTC: { rate: 3.1, period: 'Monthly' },
            }
        });
    }
    return config;
};

module.exports = mongoose.model('Config', configSchema);
