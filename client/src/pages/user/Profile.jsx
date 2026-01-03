import React, { useState, useEffect } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
    UserCircleIcon,
    EnvelopeIcon,
    WalletIcon,
    KeyIcon,
    ShieldCheckIcon,
    CameraIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    PencilSquareIcon,
    FingerPrintIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
    const { user, fetchUserData, loading, updateUserProfile } = useCrypto();
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        walletAddress: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                walletAddress: user.walletAddress || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        const res = await updateUserProfile({
            name: formData.name,
            walletAddress: formData.walletAddress,
            password: formData.newPassword || undefined
        });

        if (res.success) {
            setMessage({ type: 'success', text: res.message });
            setIsEditing(false);
            setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        } else {
            setMessage({ type: 'error', text: res.message });
        }

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    if (loading || !user) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-gray-500 font-medium animate-pulse">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your personal information and security preferences.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    System Operational
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: ID Card & Security */}
                <div className="xl:col-span-1 space-y-8">

                    {/* ID Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative group">
                        {/* Abstract Gradient Banner */}
                        <div className="h-32 bg-gray-900 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#D4AF37] opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-blue-600 opacity-10 blur-2xl"></div>
                        </div>

                        <div className="px-8 pb-8 text-center relative">
                            {/* Avatar */}
                            <div className="relative inline-block -mt-16 mb-4">
                                <div className="w-32 h-32 rounded-full border-[6px] border-white bg-gray-100 shadow-xl flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden">
                                    {user.name ? user.name.charAt(0).toUpperCase() : <UserCircleIcon className="w-20 h-20" />}
                                </div>
                                <button className="absolute bottom-2 right-2 p-2.5 bg-[#D4AF37] text-white rounded-full shadow-lg hover:bg-[#b5952f] hover:scale-110 transition-all border-4 border-white">
                                    <CameraIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-6 flex items-center justify-center gap-1">
                                {user.role === 'admin' ? (
                                    <span className="bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">Admin</span>
                                ) : (
                                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded uppercase tracking-wide font-bold">Investor</span>
                                )}
                            </p>

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Balance</p>
                                    <p className="text-lg font-bold text-[#D4AF37] mt-1">${user.balance?.toFixed(2)}</p>
                                </div>
                                <div className="text-center border-l border-gray-100">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Joined</p>
                                    <p className="text-lg font-bold text-gray-700 mt-1">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Health Widget */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                                Security Health
                            </h3>
                            <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs">Good</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
                            <div className="bg-green-500 h-2.5 rounded-full w-[85%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                        <EnvelopeIcon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Email Verified</span>
                                </div>
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-200 rounded-lg text-gray-500">
                                        <FingerPrintIcon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">2FA Auth</span>
                                </div>
                                <span className="text-xs text-gray-400 font-medium border border-gray-300 px-2 py-0.5 rounded">Setup</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Settings Form */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-full">

                        {/* Form Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
                                <p className="text-sm text-gray-500">Update your photo and personal details here.</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isEditing
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                    }`}
                            >
                                {isEditing ? (
                                    <>Cancel Editing</>
                                ) : (
                                    <>
                                        <PencilSquareIcon className="w-4 h-4" />
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 animate-fade-in ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationCircleIcon className="w-5 h-5" />}
                                <span className="text-sm font-medium">{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-8">
                            {/* Personal Info Section */}
                            <div className="space-y-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UserCircleIcon className={`h-5 w-5 transition-colors ${isEditing ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                disabled={!isEditing}
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`block w-full pl-10 pr-4 py-3.5 border rounded-xl transition-all font-medium ${isEditing
                                                        ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent shadow-sm'
                                                        : 'bg-gray-50 border-transparent text-gray-600 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                disabled
                                                value={formData.email}
                                                className="block w-full pl-10 pr-4 py-3.5 border border-transparent rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <LockClosedIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Wallet Address (TRC20)</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <WalletIcon className={`h-5 w-5 transition-colors ${isEditing ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                                            </div>
                                            <input
                                                type="text"
                                                name="walletAddress"
                                                disabled={!isEditing}
                                                value={formData.walletAddress}
                                                onChange={handleChange}
                                                placeholder="T..."
                                                className={`block w-full pl-10 pr-4 py-3.5 border rounded-xl transition-all font-mono text-sm ${isEditing
                                                        ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent shadow-sm'
                                                        : 'bg-gray-50 border-transparent text-gray-600 cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div className="space-y-6 pt-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                                    Security & Password
                                </h3>

                                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-300 ${isEditing ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyIcon className={`h-5 w-5 ${isEditing ? 'text-gray-500' : 'text-gray-300'}`} />
                                            </div>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                disabled={!isEditing}
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`block w-full pl-10 pr-4 py-3.5 border rounded-xl transition-all ${isEditing
                                                        ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent'
                                                        : 'bg-gray-50 border-transparent cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <KeyIcon className={`h-5 w-5 ${isEditing ? 'text-gray-500' : 'text-gray-300'}`} />
                                            </div>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                disabled={!isEditing}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className={`block w-full pl-10 pr-4 py-3.5 border rounded-xl transition-all ${isEditing
                                                        ? 'bg-white border-gray-300 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent'
                                                        : 'bg-gray-50 border-transparent cursor-not-allowed'
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="pt-6 flex items-center justify-end gap-4 animate-fade-in border-t border-gray-100 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                                    >
                                        Discard Changes
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#eac755] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                    >
                                        <CheckCircleIcon className="w-5 h-5" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;