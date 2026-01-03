import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const WithdrawalRequests = () => {
    const { withdrawalRequests, approveWithdrawal, rejectWithdrawal } = useCrypto();

    const pendingParams = withdrawalRequests.filter(req => req.status === 'Pending');
    const historyParams = withdrawalRequests.filter(req => req.status !== 'Pending').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="space-y-8">
            {/* Pending Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Withdrawals</h1>
                {pendingParams.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-gray-200 text-center text-gray-500">
                        No pending withdrawal requests.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingParams.map(req => (
                            <div key={req._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs font-bold mr-2">OUTGOING</span>
                                        <span className="text-gray-400 text-sm">#{req._id.slice(-6)}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-gray-500 text-sm">{new Date(req.date || req.createdAt).toLocaleDateString()}</span>
                                        {req.isSos && (
                                            <span className="ml-2 px-2 py-0.5 bg-red-600 text-white rounded text-xs font-bold animate-pulse">SOS</span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        <h3 className="text-2xl font-bold text-gray-900 mr-4">${req.amount}</h3>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                                            {req.method}
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded inline-block border border-gray-100">
                                        To: {req.address}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Requested by <span className="font-medium text-gray-900">{req.user?.name || req.user}</span></p>
                                </div>

                                <div className="flex flex-col gap-2 min-w-[150px]">
                                    <button
                                        onClick={() => approveWithdrawal(req._id)}
                                        className="flex justify-center items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm font-medium"
                                    >
                                        <CheckIcon className="w-5 h-5 mr-2" /> Approve
                                    </button>
                                    <button
                                        onClick={() => rejectWithdrawal(req._id)}
                                        className="flex justify-center items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                                    >
                                        <XMarkIcon className="w-5 h-5 mr-2" /> Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* History Section */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Withdrawal History</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Req ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">To Address</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {historyParams.length > 0 ? historyParams.map(req => (
                                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">#{req._id.slice(-6)}</td>
                                    <td className="px-6 py-4 font-medium">{req.user?.name || req.user}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">${req.amount}</td>
                                    <td className="px-6 py-4 text-xs font-mono text-gray-500 truncate max-w-[150px]" title={req.address}>
                                        {req.address}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(req.date || req.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No withdrawal history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalRequests;
