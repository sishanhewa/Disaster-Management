import React, { useEffect, useState } from 'react';
import { reliefAnalyticsApi } from '../../api/endpoints';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ReliefAnalyticsSummary } from '../../types/relief';

// Ported from Disaster-Management-master AnalyticsDashboard.tsx
// API: axios to /api/analytics/summary → reliefAnalyticsApi.getSummary() via CS apiClient

const ReliefAnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<ReliefAnalyticsSummary | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await reliefAnalyticsApi.getSummary();
                setStats(data);
            } catch (err) { console.error(err); }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="text-center p-10 text-slate-400">Loading Analytics...</div>;

    const chartData = [{ name: 'Item Quantities', Required: stats.totalItemsRequired, Pledged: stats.totalItemsPledged }];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b border-slate-700 pb-2 text-slate-100">National Analytics Dashboard</h2>

            <div className="grid grid-cols-1 tracking-wider md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 text-center">
                    <h3 className="text-slate-400 font-bold uppercase text-sm mb-2">Active Relief Camps</h3>
                    <p className="text-4xl font-black text-blue-400">{stats.totalCamps}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 text-center">
                    <h3 className="text-slate-400 font-bold uppercase text-sm mb-2">Urgent Needs Broadcasted</h3>
                    <p className="text-4xl font-black text-red-400">{stats.totalActiveNeeds}</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 text-center">
                    <h3 className="text-slate-400 font-bold uppercase text-sm mb-2">Total Citizen Pledges</h3>
                    <p className="text-4xl font-black text-emerald-400">{stats.totalPledges}</p>
                </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                <h3 className="text-lg font-bold mb-6 text-slate-300">Donation Fulfillment Progress</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }} />
                            <Legend wrapperStyle={{ color: '#94a3b8' }} />
                            <Bar dataKey="Required" fill="#ef4444" name="Total Items Needed" />
                            <Bar dataKey="Pledged" fill="#22c55e" name="Items Successfully Pledged" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReliefAnalyticsDashboard;
