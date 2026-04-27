import React, { useState, useEffect } from 'react';
import { campsApi, broadcastAlertsApi, usersApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import type { Camp, BroadcastAlert } from '../../types/relief';
import { ShieldAlert, Send } from 'lucide-react';

// Ported from Disaster-Management-master AdminDashboard.tsx
// Auth: localStorage → useAuthStore | role check: user.roles.includes('admin')
// API: api.camps/alerts → campsApi/broadcastAlertsApi
// Manager account creation: DM posted to /api/auth/register (plaintext) →
//   CS uses /api/v1/auth/register (BCrypt) via adminApi — this keeps the same UX but routes through
//   the secure CS auth endpoint.

const ReliefAdminPage: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const [camps, setCamps] = useState<Camp[]>([]);

    const [campName, setCampName] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');

    const [managerName, setManagerName] = useState('');
    const [managerEmail, setManagerEmail] = useState('');
    const [managerPassword, setManagerPassword] = useState('');

    const [alerts, setAlerts] = useState<BroadcastAlert[]>([]);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    const isAdmin = user?.roles?.includes('admin');

    useEffect(() => {
        if (isAdmin) {
            fetchCamps();
            fetchAlerts();
        }
    }, [isAdmin]);

    const fetchAlerts = async () => {
        try {
            const data = await broadcastAlertsApi.getAll();
            setAlerts(data);
        } catch (error) { console.error('Error fetching alerts', error); }
    };

    const fetchCamps = async () => {
        try {
            const data = await campsApi.getAll();
            setCamps(data);
        } catch (error) { console.error('Error fetching camps', error); }
    };

    const handleCreateCamp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let assignedManagerId = '';

            // Register manager via CS secure auth endpoint (BCrypt - no plaintext)
            if (managerEmail && managerPassword) {
                const regRes = await fetch('/api/v1/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: managerEmail,
                        password: managerPassword,
                        displayName: managerName || `${campName} Manager`,
                    }),
                });
                if (!regRes.ok) throw new Error('Registration failed');
                const regData = await regRes.json();
                assignedManagerId = regData.user?.id || '';
            }

            const campData: any = { campName, district, address };
            if (assignedManagerId) campData.manager = { id: assignedManagerId };

            await campsApi.create(campData);
            alert('Camp and Manager account created successfully!');
            setCampName(''); setDistrict(''); setAddress('');
            setManagerName(''); setManagerEmail(''); setManagerPassword('');
            fetchCamps();
        } catch (err: any) {
            console.error(err);
            alert('Failed. If creating a manager, ensure the email is not already taken.');
        }
    };

    const handleCreateAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await broadcastAlertsApi.create({ title: alertTitle, message: alertMessage, severity: alertSeverity, isActive: true });
            alert('Alert Posted Successfully!');
            setAlertTitle(''); setAlertMessage(''); setAlertSeverity('info');
            fetchAlerts();
        } catch (err) {
            console.error(err);
            alert('Failed to post alert.');
        }
    };

    if (!isAdmin) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 text-center bg-slate-800 text-slate-300 rounded-xl border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
                <p>You must be logged in with an Admin account to view this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold border-b border-slate-700 pb-2 text-slate-100">Relief Admin Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Camp Panel */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Register New Relief Camp</h2>
                    <form onSubmit={handleCreateCamp} className="space-y-4">
                        <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                            <h3 className="font-bold text-slate-200 mb-3 border-b border-slate-600 pb-1">1. Camp Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300">Camp Name</label>
                                    <input type="text" value={campName} onChange={e => setCampName(e.target.value)} required
                                        className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colombo Central Relief" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300">District</label>
                                    <input type="text" value={district} onChange={e => setDistrict(e.target.value)} required
                                        className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Colombo" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300">Address Location</label>
                                    <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={2}
                                        className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full physical address" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
                            <h3 className="font-bold text-blue-300 mb-3 border-b border-blue-500/30 pb-1">2. Assign Camp Manager (Creates Account)</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300">Manager Name</label>
                                    <input type="text" value={managerName} onChange={e => setManagerName(e.target.value)} required
                                        className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300">Login Email</label>
                                        <input type="email" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} required
                                            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="manager@camp.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300">Login Password</label>
                                        <input type="password" value={managerPassword} onChange={e => setManagerPassword(e.target.value)} required minLength={8}
                                            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Minimum 8 chars" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold w-full hover:bg-blue-500 shadow-md transition">
                            Create Camp & Register Manager
                        </button>
                    </form>
                </div>

                {/* Active Camps List */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-slate-100">Active Camps in Network ({camps.length})</h2>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {camps.map(camp => (
                            <div key={camp.id} className="border border-slate-600 p-3 rounded-lg bg-slate-700/50 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-100">{camp.campName}</h3>
                                    <p className="text-sm text-slate-400">{camp.address}, {camp.district}</p>
                                </div>
                                <span className="bg-emerald-900/50 text-emerald-400 text-xs px-2 py-1 rounded font-bold border border-emerald-500/30">Active</span>
                            </div>
                        ))}
                        {camps.length === 0 && <p className="text-slate-500">No camps registered yet.</p>}
                    </div>
                </div>
            </div>

            {/* Custom Alerts Management */}
            <div className="mt-8 border-t border-slate-700 pt-8">
                <div className="flex items-center gap-2 mb-6">
                    <ShieldAlert size={28} className="text-red-400" />
                    <h2 className="text-2xl font-bold text-slate-100">Broadcast Custom Alerts</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-red-900/20 p-6 rounded-xl shadow-lg border border-red-500/30">
                        <h3 className="text-lg font-semibold mb-4 text-red-400">Post New Emergency Alert</h3>
                        <form onSubmit={handleCreateAlert} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300">Alert Title</label>
                                <input type="text" value={alertTitle} onChange={e => setAlertTitle(e.target.value)} required
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g. Flooding Warning" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300">Severity Level</label>
                                <select value={alertSeverity} onChange={e => setAlertSeverity(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm border p-2 focus:ring-2 focus:ring-red-500 outline-none">
                                    <option value="info">Info (Blue)</option>
                                    <option value="warning">Warning (Yellow)</option>
                                    <option value="critical">Critical (Red)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300">Message</label>
                                <textarea value={alertMessage} onChange={e => setAlertMessage(e.target.value)} required rows={3}
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-red-500 outline-none" placeholder="Detailed alert message..." />
                            </div>
                            <button type="submit" className="bg-red-600 text-white px-4 py-3 rounded-lg font-bold w-full hover:bg-red-500 shadow-md flex items-center justify-center gap-2 transition">
                                <Send size={18} /> Broadcast Alert
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-slate-100">Currently Active Alerts ({alerts.filter(a => a.isActive).length})</h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {alerts.filter(a => a.isActive).map(alert => (
                                <div key={alert.id} className={`border p-3 rounded-lg flex justify-between items-start ${alert.severity === 'critical' ? 'bg-red-900/30 border-red-500/40' : alert.severity === 'warning' ? 'bg-yellow-900/30 border-yellow-500/40' : 'bg-blue-900/30 border-blue-500/40'}`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${alert.severity === 'critical' ? 'bg-red-600 text-white' : alert.severity === 'warning' ? 'bg-yellow-500 text-white' : 'bg-blue-600 text-white'}`}>
                                                {alert.severity}
                                            </span>
                                            <h4 className="font-bold text-sm text-slate-200">{alert.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                                    </div>
                                    <span className="bg-emerald-900/50 text-emerald-400 text-xs px-2 py-1 rounded font-bold whitespace-nowrap border border-emerald-500/30">Active</span>
                                </div>
                            ))}
                            {alerts.filter(a => a.isActive).length === 0 && <p className="text-slate-500">No active alerts.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReliefAdminPage;
