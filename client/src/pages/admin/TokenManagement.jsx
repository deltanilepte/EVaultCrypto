import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
    CheckCircleIcon, 
    PencilSquareIcon, 
    XMarkIcon, 
    CheckIcon,
    WalletIcon,
    ChartBarIcon,
    AdjustmentsHorizontalIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const TokenManagement = () => {
    const { roiRates, updateRoiRate } = useCrypto();
    const [editMode, setEditMode] = useState(null);
    const [tempRate, setTempRate] = useState('');
    const [tempWallet, setTempWallet] = useState('');
    const [message, setMessage] = useState('');

    const handleEdit = (token) => {
        setEditMode(token);
        setTempRate(roiRates[token].rate);
        setTempWallet(roiRates[token].walletAddress || '');
    };

    const handleSave = (token) => {
        updateRoiRate(token, {
            rate: parseFloat(tempRate),
            walletAddress: tempWallet
        });
        setEditMode(null);
        setMessage(`${token} configuration updated successfully.`);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Asset Configuration</h1>
                    <p className="text-gray-500 mt-1">Manage global ROI rates and liquidity wallet destinations.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-sm font-medium text-gray-600">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-[#D4AF37]" />
                    <span>{Object.keys(roiRates).length} Assets Active</span>
                </div>
            </div>

            {/* Success Notification */}
            {message && (
                <div className="animate-fade-in-up bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-green-800 font-bold text-sm">System Update</p>
                        <p className="text-green-700 text-sm">{message}</p>
                    </div>
                </div>
            )}

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(roiRates).map(([token, info]) => {
                    const isEditing = editMode === token;

                    return (
                        <div 
                            key={token} 
                            className={`relative bg-white rounded-3xl p-6 transition-all duration-300 ${
                                isEditing 
                                ? 'shadow-xl ring-2 ring-[#D4AF37] scale-[1.02] z-10' 
                                : 'shadow-sm border border-gray-100 hover:shadow-md hover:border-[#D4AF37]/30'
                            }`}
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm transition-colors ${
                                        isEditing ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {token[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{token}</h3>
                                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                            {info.period} Payouts
                                        </span>
                                    </div>
                                </div>
                                
                                {!isEditing && (
                                    <button 
                                        onClick={() => handleEdit(token)}
                                        className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-xl transition-all"
                                    >
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="space-y-6">
                                
                                {/* ROI Section */}
                                <div className={`p-4 rounded-2xl transition-colors ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}>
                                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-500">
                                        <ChartBarIcon className="w-4 h-4" />
                                        <span>Target ROI Rate</span>
                                    </div>
                                    
                                    {isEditing ? (
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={tempRate}
                                                onChange={(e) => setTempRate(e.target.value)}
                                                className="w-full text-2xl font-bold bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all placeholder-gray-300"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-bold text-gray-900">{info.rate}</span>
                                            <span className="text-lg font-medium text-gray-400">%</span>
                                        </div>
                                    )}
                                </div>

                                {/* Wallet Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-500">
                                        <WalletIcon className="w-4 h-4" />
                                        <span>Sponser Wallet Address</span>
                                    </div>

                                    {isEditing ? (
                                        <textarea
                                            value={tempWallet}
                                            onChange={(e) => setTempWallet(e.target.value)}
                                            rows="2"
                                            className="w-full text-sm font-mono bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Enter wallet address..."
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                            <div className={`w-2 h-2 rounded-full ${info.walletAddress ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                            <p className="text-xs font-mono text-gray-600 truncate flex-1">
                                                {info.walletAddress || 'Not Configured'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions Footer */}
                            {isEditing && (
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3 animate-fade-in">
                                    <button 
                                        onClick={() => setEditMode(null)}
                                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => handleSave(token)}
                                        className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                                    >
                                        <CheckIcon className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            )}

                            {/* Decorative Sparkle for non-editing high-yield assets */}
                            {!isEditing && info.rate > 10 && (
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SparklesIcon className="w-6 h-6 text-[#D4AF37]/30" />
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Add New Placeholder (Visual Only) */}
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all cursor-pointer group min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                        <span className="text-2xl font-light">+</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Add New Asset</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-[200px]">Configure a new token for investment pools.</p>
                </div>
            </div>
        </div>
    );
};

export default TokenManagement;