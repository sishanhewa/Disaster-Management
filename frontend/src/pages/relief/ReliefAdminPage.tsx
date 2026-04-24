import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import axios from 'axios';
import type { Camp, CustomAlert } from '../../types';
import { ShieldAlert, Send, Settings, BarChart2, LayoutDashboard } from 'lucide-react';
import ReliefOversightAnalytics from './ReliefOversightAnalytics';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'manage' | 'analytics'>('manage');
    const [camps, setCamps] = useState<Camp[]>([]);

    const [campName, setCampName] = useState('');
    const [district, setDistrict] = useState('');
    const [address, setAddress] = useState('');

    // Manager Details
    const [managerName, setManagerName] = useState('');
    const [managerEmail, setManagerEmail] = useState('');
    const [managerPassword, setManagerPassword] = useState('');

    // Custom Alerts State
    const [alerts, setAlerts] = useState<CustomAlert[]>([]);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    const API_BASE = 'http://localhost:8080/api';

    useEffect(() => {
        fetchCamps();
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const data = await api.alerts.getAll();
            setAlerts(data);
        } catch (error) {
            console.error("Error fetching alerts", error);
        }
    };

    const fetchCamps = async () => {
        try {
            const data = await api.camps.getAll();
            setCamps(data);
        } catch (error) {
            console.error("Error fetching camps", error);
        }
    };

    const handleCreateCamp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let assignedManagerId = '';

            // 1. Register the new Camp Manager first
            if (managerEmail && managerPassword) {
                const regRes = await axios.post(`${API_BASE}/auth/register`, {
                    fullName: managerName || `${campName} Manager`,
                    email: managerEmail,
                    passwordHash: managerPassword,
                    role: 'camp_manager'
                });
                assignedManagerId = regRes.data.id;
            }

            // 2. Create the Camp and assign the manager
            const campData: any = { campName, district, address };
            if (assignedManagerId) {
                campData.manager = { id: assignedManagerId };
            }

            await api.camps.create(campData);
            alert("Camp and Manager account created successfully!");

            // Reset Form
            setCampName(''); setDistrict(''); setAddress('');
            setManagerName(''); setManagerEmail(''); setManagerPassword('');
            fetchCamps();
        } catch (err: any) {
            console.error(err);
            alert("Failed. If creating a manager, ensure the email is not already taken.");
        }
    };

    const handleCreateAlert = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.alerts.create({
                title: alertTitle,
                message: alertMessage,
                severity: alertSeverity,
                active: true
            });
            alert("Custom Alert Posted Successfully!");
            setAlertTitle('');
            setAlertMessage('');
            setAlertSeverity('info');
            fetchAlerts();
        } catch (err) {
            console.error(err);
            alert("Failed to post alert.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700 pb-4">
                <h1 className="text-3xl font-bold text-slate-100">Needs &amp; Pledges Oversight</h1>
                <div className="flex items-center gap-3">
                    {/* Tab switcher */}
                    <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 gap-1">
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'manage' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <LayoutDashboard size={16} /> Management
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <BarChart2 size={16} /> Analytics &amp; PDF
                        </button>
                    </div>
                    <Link to="/alerts" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-blue-400 px-4 py-2 rounded-lg border border-slate-700 font-bold transition">
                        <Settings size={18} /> Alerts Console
                    </Link>
                </div>
            </div>

            {/* Analytics tab */}
            {activeTab === 'analytics' && <ReliefOversightAnalytics />}
            {activeTab !== 'analytics' && <>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Camp Panel */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Register New Relief Camp</h2>
                    <form onSubmit={handleCreateCamp} className="space-y-4">

                        {/* Camp Details */}
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

                        {/* Manager Details */}
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
                                        <input type="password" value={managerPassword} onChange={e => setManagerPassword(e.target.value)} required minLength={6}
                                            className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Minimum 6 chars" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold w-full hover:bg-blue-500 shadow-md transition">
                            Create Camp & Register Manager
                        </button>
                    </form>
                </div>

                {/* List Active Camps */}
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

            {/* Custom Alerts Management Section */}
            <div className="mt-8 border-t border-slate-700 pt-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={28} className="text-red-400" />
                        <h2 className="text-2xl font-bold text-slate-100">Broadcast Custom Alerts</h2>
                    </div>
                    <Link to="/alerts" className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-500/30 transition">
                        Full Alerts Management <Settings size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Post Alert Form */}
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

                    {/* Active Alerts List */}
                    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                        <h3 className="text-lg font-semibold mb-4 text-slate-100">Currently Active Alerts ({alerts.length})</h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {alerts.map(alert => (
                                <div key={alert.id} className={`border p-3 rounded-lg flex justify-between items-start ${alert.severity === 'critical' ? 'bg-red-900/30 border-red-500/40' :
                                    alert.severity === 'warning' ? 'bg-yellow-900/30 border-yellow-500/40' :
                                        'bg-blue-900/30 border-blue-500/40'
                                    }`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${alert.severity === 'critical' ? 'bg-red-600 text-white' :
                                                alert.severity === 'warning' ? 'bg-yellow-500 text-white' :
                                                    'bg-blue-600 text-white'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                            <h4 className="font-bold text-sm text-slate-200">{alert.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                                    </div>
                                    <span className="bg-emerald-900/50 text-emerald-400 text-xs px-2 py-1 rounded font-bold whitespace-nowrap border border-emerald-500/30">Active</span>
                                </div>
                            ))}
                            {alerts.length === 0 && <p className="text-slate-500">No active alerts.</p>}
                        </div>
                    </div>
                </div>
            </div>
            </> /* end management tab */ }
        </div>
    );
};

export default AdminDashboard;
