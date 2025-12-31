import React, { createContext, useContext, useState, useEffect } from 'react';

const CryptoContext = createContext();

export const useCrypto = () => useContext(CryptoContext);

export const CryptoProvider = ({ children }) => {
    // --- Initial Data ---
    const initialROIRates = {
        USDT: { rate: 3.5, period: 'Daily' },
        DODGE: { rate: 0.66, period: 'Monthly' },
        XRP: { rate: 0.66, period: 'Monthly' },
        ETH: { rate: 0.66, period: 'Monthly' },
        SOL: { rate: 0.83, period: 'Monthly' },
        BNB: { rate: 0.83, period: 'Monthly' },
        BTC: { rate: 1.0, period: 'Monthly' },
    };

    const initialUser = {
        id: 'u1',
        name: 'Demo User',
        email: 'user@evault.demo',
        balance: 5000.00,
        totalInvested: 12500.00,
        totalWithdrawn: 2000.00,
        totalROI: 450.50,
        joinDate: '2025-11-15',
        status: 'Active',
        walletConnected: false,
        walletAddress: '',
    };

    // --- State ---
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('evault_user');
        return saved ? JSON.parse(saved) : initialUser;
    });

    const [roiRates, setRoiRates] = useState(() => {
        const saved = localStorage.getItem('evault_roi_rates');
        return saved ? JSON.parse(saved) : initialROIRates;
    });

    const [investments, setInvestments] = useState(() => {
        const saved = localStorage.getItem('evault_investments');
        return saved ? JSON.parse(saved) : [
            { id: 'inv1', method: 'USDT', amount: 1000, date: '2025-12-01', status: 'Active', returns: 350 },
            { id: 'inv2', method: 'BTC', amount: 0.5, date: '2025-11-20', status: 'Completed', returns: 0.05 },
        ];
    });

    const [withdrawals, setWithdrawals] = useState(() => {
        const saved = localStorage.getItem('evault_withdrawals');
        return saved ? JSON.parse(saved) : [
            { id: 'w1', method: 'USDT', amount: 500, date: '2025-12-10', status: 'Approved', txId: '0x123...abc' },
            { id: 'w2', method: 'ETH', amount: 1.2, date: '2025-12-25', status: 'Pending', txId: '' },
        ];
    });

    const [investmentRequests, setInvestmentRequests] = useState(() => {
        const saved = localStorage.getItem('evault_inv_requests');
        return saved ? JSON.parse(saved) : [
            { id: 'req1', userId: 'u2', user: 'Jane Doe', amount: 5000, method: 'USDT', date: '2025-12-30', status: 'Pending' }
        ];
    });

    const [withdrawalRequests, setWithdrawalRequests] = useState(() => {
        const saved = localStorage.getItem('evault_with_requests');
        return saved ? JSON.parse(saved) : [
            { id: 'wreq1', userId: 'u3', user: 'Bob Smith', amount: 200, method: 'SOL', address: 'SoL...123', date: '2025-12-31', status: 'Pending' }
        ];
    });

    const [allUsers, setAllUsers] = useState(() => {
        const saved = localStorage.getItem('evault_all_users');
        // Mock users list for admin
        return saved ? JSON.parse(saved) : [
            { ...initialUser }, // Includes current user
            { id: 'u2', name: 'Jane Doe', email: 'jane@test.com', joinDate: '2025-10-10', totalInvested: 8000, status: 'Active' },
            { id: 'u3', name: 'Bob Smith', email: 'bob@test.com', joinDate: '2025-12-05', totalInvested: 1000, status: 'Active' }
        ];
    });

    // --- Effects ---
    useEffect(() => localStorage.setItem('evault_user', JSON.stringify(user)), [user]);
    useEffect(() => localStorage.setItem('evault_roi_rates', JSON.stringify(roiRates)), [roiRates]);
    useEffect(() => localStorage.setItem('evault_investments', JSON.stringify(investments)), [investments]);
    useEffect(() => localStorage.setItem('evault_withdrawals', JSON.stringify(withdrawals)), [withdrawals]);
    useEffect(() => localStorage.setItem('evault_inv_requests', JSON.stringify(investmentRequests)), [investmentRequests]);
    useEffect(() => localStorage.setItem('evault_with_requests', JSON.stringify(withdrawalRequests)), [withdrawalRequests]);
    useEffect(() => localStorage.setItem('evault_all_users', JSON.stringify(allUsers)), [allUsers]);


    // --- Actions ---
    const connectWallet = (address) => {
        setUser(prev => ({ ...prev, walletConnected: true, walletAddress: address }));
    };

    const addInvestment = (inv) => {
        const newInv = { ...inv, id: `inv${Date.now()}`, date: new Date().toISOString().split('T')[0], status: 'Pending', returns: 0 };
        // In a real app this would go to requests first, but for user demo we might show it in list
        setInvestments(prev => [newInv, ...prev]);
        // Also add to admin requests
        setInvestmentRequests(prev => [{
            id: `req${Date.now()}`,
            userId: user.id,
            user: user.name,
            amount: inv.amount,
            method: inv.method,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        }, ...prev]);
    };

    const requestWithdrawal = (req) => {
        const newReq = { ...req, id: `w${Date.now()}`, date: new Date().toISOString().split('T')[0], status: 'Pending', txId: '' };
        setWithdrawals(prev => [newReq, ...prev]);
        setWithdrawalRequests(prev => [{
            id: `wreq${Date.now()}`,
            userId: user.id,
            user: user.name,
            amount: req.amount,
            method: req.method,
            address: req.walletAddress,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending'
        }, ...prev]);
    };

    // Admin Actions
    const updateRoiRate = (token, newRate) => {
        setRoiRates(prev => ({
            ...prev,
            [token]: { ...prev[token], rate: newRate }
        }));
    };

    const approveInvestment = (id) => {
        setInvestmentRequests(prev => prev.filter(req => req.id !== id));
        // Logic to actually activate investment would be here
        // For demo, we just remove from requests and assume it becomes active in user view (simplified)
    };

    const rejectInvestment = (id) => {
        setInvestmentRequests(prev => prev.filter(req => req.id !== id));
    };

    const approveWithdrawal = (id) => {
        setWithdrawalRequests(prev => prev.filter(req => req.id !== id));
    };

    const rejectWithdrawal = (id) => {
        setWithdrawalRequests(prev => prev.filter(req => req.id !== id));
    };


    return (
        <CryptoContext.Provider value={{
            user,
            roiRates,
            investments,
            withdrawals,
            investmentRequests,
            withdrawalRequests,
            allUsers,
            connectWallet,
            addInvestment,
            requestWithdrawal,
            updateRoiRate,
            approveInvestment,
            rejectInvestment,
            approveWithdrawal,
            rejectWithdrawal
        }}>
            {children}
        </CryptoContext.Provider>
    );
};
