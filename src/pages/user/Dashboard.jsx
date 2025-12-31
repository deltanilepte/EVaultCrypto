import React, { useMemo } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import {
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-start transition-transform hover:scale-[1.02] duration-200">
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mt-1">
                {value}
            </h3>
            <p className="text-xs text-gray-400 mt-1">{subtext}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
    </div>
);

const UserDashboard = () => {
    const { user, investments, roiRates } = useCrypto();

    const totalActiveInvestments = investments.filter(i => i.status === 'Active').length;

    const chartData = useMemo(() => {
        // Mock chart data - in real app would come from historical snapshots or calculations
        const labels = ['Day 1', 'Day 5', 'Day 10', 'Day 15', 'Day 20', 'Day 25', 'Day 30'];
        return {
            labels,
            datasets: [
                {
                    label: 'Portfolio Value',
                    data: [5000, 5200, 5350, 5500, 5800, 6100, user.totalInvested + user.balance], // Mock trend
                    fill: true,
                    borderColor: '#D4AF37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    tension: 0.4,
                },
            ],
        };
    }, [user]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                border: {
                    display: false
                },
                grid: {
                    color: '#f3f4f6'
                }
            }
        },
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 text-sm">Welcome back, {user.name}</p>
                </div>
                {!user.walletConnected && (
                    <button className="mt-4 sm:mt-0 px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white font-medium rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow">
                        Connect Wallet
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Invested"
                    value={`$${user.totalInvested.toLocaleString()}`}
                    subtext="+12% from last month"
                    icon={CurrencyDollarIcon}
                    color="bg-gradient-to-br from-[#D4AF37] to-[#B4941F]"
                />
                <StatCard
                    title="Total ROI Earned"
                    value={`$${user.totalROI.toLocaleString()}`}
                    subtext="Lifetime earnings"
                    icon={ArrowTrendingUpIcon}
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                />
                <StatCard
                    title="Total Withdrawals"
                    value={`$${user.totalWithdrawn.toLocaleString()}`}
                    subtext="Processed successfully"
                    icon={ArrowDownTrayIcon}
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Active Investments"
                    value={totalActiveInvestments}
                    subtext="Running portfolios"
                    icon={BriefcaseIcon}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Charts & Recent - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900">Portfolio Growth</h3>
                        <select className="text-sm bg-gray-50 border-none rounded-md text-gray-500 focus:ring-0">
                            <option>Last 30 Days</option>
                            <option>Last 6 Months</option>
                            <option>All Time</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* Quick Daily Stats Widget */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Market Rates (Daily/Monthly)</h3>
                    <div className="space-y-4">
                        {Object.entries(roiRates).slice(0, 5).map(([token, info]) => (
                            <div key={token} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-xs text-gray-700 mr-3">
                                        {token[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{token}</p>
                                        <p className="text-xs text-gray-500">{info.period}</p>
                                    </div>
                                </div>
                                <span className="text-[#D4AF37] font-bold">
                                    {info.rate}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Recent Investments</h3>
                    <button className="text-sm text-[#D4AF37] hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Method</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Returns</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {investments.slice(0, 5).map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 text-gray-500">#{inv.id.slice(-4)}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">{inv.method}</td>
                                    <td className="px-6 py-3 text-gray-500">{inv.date}</td>
                                    <td className="px-6 py-3 font-medium text-gray-900">${inv.amount}</td>
                                    <td className="px-6 py-3 text-green-600 font-medium">+${inv.returns}</td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${inv.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                inv.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
