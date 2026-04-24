import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { Camp, Need, Pledge } from '../../types';
import heic2any from 'heic2any';
import { LayoutDashboard, Megaphone, ClipboardList, Package, CheckCircle, Clock, Trash2, BarChart2 } from 'lucide-react';
import CampManagerAnalytics from './CampManagerAnalytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CampDashboard: React.FC = () => {
    const [camps, setCamps] = useState<Camp[]>([]);
    const [needs, setNeeds] = useState<Need[]>([]);
    const [pledges, setPledges] = useState<Pledge[]>([]);
    const [selectedCamp, setSelectedCamp] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'overview' | 'active_requests' | 'new_request' | 'pledges' | 'analytics'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('Food');
    const [qty, setQty] = useState('');
    const [urgency, setUrgency] = useState('high');
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const checkAuth = () => {
        const t = localStorage.getItem('user');
        if (!t) return null;
        try { return JSON.parse(t); } catch { return null; }
    };
    const manager = checkAuth();

    const loadData = async () => {
        if (!manager || !manager.id) {
            setIsLoading(false);
            return;
        }
        try {
            const c = await api.camps.getByManager(manager.id);
            setCamps(c);
            if (c.length > 0 && c[0].id) setSelectedCamp(c[0].id);

            const n = await api.needs.getByManager(manager.id);
            // sort so newer needs are first, or we can just keep them as returned
            setNeeds(n.sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));

            const p = await api.pledges.getByManager(manager.id);
            setPledges(p.sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
        } catch (error) {
            console.error("Error loading dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const headerReader = new FileReader();
        headerReader.onloadend = async (evt) => {
            if (evt.target?.readyState !== FileReader.DONE) return;

            const arr = new Uint8Array(evt.target.result as ArrayBuffer).subarray(0, 12);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16).padStart(2, '0');
            }

            const isHeic = header.includes("6674797068656963") || 
                          file.type === 'image/heic' || 
                          file.name.toLowerCase().endsWith('.heic');

            const readFileAsDataURL = (blob: Blob) => {
                const reader = new FileReader();
                reader.onloadend = () => setImageBase64(reader.result as string);
                reader.readAsDataURL(blob);
            };

            if (isHeic) {
                try {
                    const convertedBlob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.8
                    });
                    const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                    readFileAsDataURL(finalBlob);
                } catch (err) {
                    alert("Failed to convert HEIC image automatically. Please upload a standard JPEG or PNG.");
                    if (e.target) e.target.value = '';
                }
            } else {
                readFileAsDataURL(file);
            }
        };

        headerReader.readAsArrayBuffer(file.slice(0, 50));
    };

    const handleBroadcastNeed = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.needs.create({
                camp: { id: selectedCamp } as any,
                itemName,
                category,
                quantityRequired: parseInt(qty),
                urgency: urgency,
                imageBase64: imageBase64 || undefined
            });
            alert("Urgent need broadcasted successfully!");
            setItemName(''); setQty(''); setImageBase64(null);
            loadData();
            setActiveTab('active_requests');
        } catch (error) {
            alert("Failed to broadcast need.");
        }
    };

    const handleUpdatePledge = async (id: string, status: string) => {
        try {
            await api.pledges.updateStatus(id, status);
            loadData();
        } catch (e) {
            alert("Failed to update pledge.");
        }
    };

    const handleToggleNeedStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.needs.updateStatus(id, !currentStatus);
            loadData();
        } catch (e) {
            alert("Failed to update request status.");
        }
    };

    const handleDeleteNeed = async (id: string) => {
        if (!confirm("Permanently delete this request from the database?")) return;
        try {
            await api.needs.delete(id);
            alert("Request deleted successfully.");
            loadData();
        } catch (e) {
            alert("Failed to delete request.");
        }
    };

    if (!manager || manager.role !== 'camp_manager' || !manager.id) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 text-center bg-slate-800 text-slate-300 rounded-xl border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
                <p>You must be logged in with a Camp Manager account to view this dashboard.</p>
            </div>
        );
    }

    if (isLoading) {
        return <div className="text-center text-slate-400 py-20 text-lg">Loading Management Systems...</div>;
    }

    const activeNeedsCount = needs.filter(n => n.isActive).length;
    const pendingPledgesCount = pledges.filter(p => p.status === 'pending').length;
    const itemsCollectedCount = pledges.filter(p => p.status === 'collected').reduce((acc, p) => acc + p.quantity, 0);

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex flex-col gap-2">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl mb-4 text-center">
                    <div className="w-16 h-16 bg-blue-900/50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold uppercase border border-blue-500/30">
                        {manager.fullName.charAt(0)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{manager.fullName}</h3>
                    <p className="text-xs text-slate-400 font-medium tracking-wide uppercase mt-1">Camp Manager</p>
                </div>
                
                <nav className="flex flex-col gap-1">
                    <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('active_requests')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'active_requests' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                        <ClipboardList size={20} /> Active Requests
                    </button>
                    <button onClick={() => setActiveTab('new_request')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'new_request' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                        <Megaphone size={20} /> Broadcast Need
                    </button>
                    <button onClick={() => setActiveTab('pledges')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all justify-between ${activeTab === 'pledges' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                        <span className="flex items-center gap-3"><Package size={20} /> Pledges</span>
                        {pendingPledgesCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingPledgesCount}</span>}
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}>
                        <BarChart2 size={20} /> Analytics &amp; PDF
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Manager Dashboard</h2>
                            <p className="text-slate-400 mt-1 text-sm font-medium">Select a camp to view customized reporting</p>
                            <select value={selectedCamp} onChange={(e) => setSelectedCamp(e.target.value)}
                                className="mt-3 w-full md:w-auto bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 shadow-lg cursor-pointer">
                                {camps.map(c => (
                                    <option key={c.id} value={c.id}>{c.campName} ({c.district})</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-5">
                                <div className="p-3 bg-red-900/30 text-red-500 rounded-xl border border-red-500/30"><ClipboardList size={28} /></div>
                                <div>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Needs</p>
                                    <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{activeNeedsCount}</h3>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-5">
                                <div className="p-3 bg-orange-900/30 text-orange-500 rounded-xl border border-orange-500/30"><Clock size={28} /></div>
                                <div>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Pending Pledges</p>
                                    <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{pendingPledgesCount}</h3>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-5">
                                <div className="p-3 bg-emerald-900/30 text-emerald-500 rounded-xl border border-emerald-500/30"><CheckCircle size={28} /></div>
                                <div>
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Items Collected</p>
                                    <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{itemsCollectedCount}</h3>
                                </div>
                            </div>
                        </div>

                        {/* ── Mini Charts Row ─────────────────────────────────── */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">

                            {/* Category breakdown */}
                            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-5 shadow-xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Items by Category</p>
                                {(() => {
                                    const cats = needs.reduce<Record<string, number>>((acc, n) => {
                                        const k = (n as any).category || 'Other';
                                        acc[k] = (acc[k] || 0) + ((n as any).quantityRequired || 0);
                                        return acc;
                                    }, {});
                                    const data = Object.entries(cats).map(([name, val]) => ({ name, val }));
                                    return data.length === 0
                                        ? <p className="text-slate-600 text-sm text-center py-6">No data yet.</p>
                                        : <ResponsiveContainer width="100%" height={140}>
                                            <BarChart data={data} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                                                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                                                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }} />
                                                <Bar dataKey="val" name="Units" fill="#6366f1" radius={[4,4,0,0]} />
                                            </BarChart>
                                        </ResponsiveContainer>;
                                })()}
                            </div>

                            {/* Urgency donut */}
                            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-5 shadow-xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Needs by Urgency</p>
                                {(() => {
                                    const COLORS: Record<string,string> = { critical:'#ef4444', high:'#f97316', medium:'#f59e0b', low:'#22d3ee' };
                                    const urg = needs.reduce<Record<string, number>>((acc, n) => {
                                        const k = ((n as any).urgency || 'low').toLowerCase();
                                        acc[k] = (acc[k] || 0) + 1;
                                        return acc;
                                    }, {});
                                    const data = Object.entries(urg).map(([name, value]) => ({ name, value }));
                                    return data.length === 0
                                        ? <p className="text-slate-600 text-sm text-center py-6">No data yet.</p>
                                        : <ResponsiveContainer width="100%" height={140}>
                                            <PieChart>
                                                <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}
                                                    label={({ name, value }) => `${name[0].toUpperCase()+name.slice(1)}: ${value}`} labelLine={false}>
                                                    {data.map((e, i) => <Cell key={i} fill={COLORS[e.name] || '#6366f1'} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '11px' }} />
                                            </PieChart>
                                        </ResponsiveContainer>;
                                })()}
                            </div>

                            {/* Fulfilment progress */}
                            <div className="bg-slate-800/60 rounded-2xl border border-slate-700 p-5 shadow-xl flex flex-col justify-between">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Fulfilment Progress</p>
                                {(() => {
                                    const req  = needs.reduce((s, n) => s + ((n as any).quantityRequired || 0), 0);
                                    const pled = needs.reduce((s, n) => s + ((n as any).quantityPledged  || 0), 0);
                                    const recd = needs.reduce((s, n) => s + ((n as any).quantityReceived || 0), 0);
                                    const pledPct = req === 0 ? 0 : Math.round((pled / req) * 100);
                                    const recdPct = req === 0 ? 0 : Math.round((recd / req) * 100);
                                    return (
                                        <div className="space-y-4 mt-2">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5">
                                                    <span className="text-slate-400">Pledged</span>
                                                    <span className="font-bold text-emerald-400">{pledPct}%</span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full transition-all" style={{ width: `${pledPct}%` }} />
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">{pled.toLocaleString()} / {req.toLocaleString()} units</p>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1.5">
                                                    <span className="text-slate-400">Received</span>
                                                    <span className="font-bold text-cyan-400">{recdPct}%</span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                                    <div className="bg-gradient-to-r from-cyan-700 to-cyan-400 h-3 rounded-full transition-all" style={{ width: `${recdPct}%` }} />
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1">{recd.toLocaleString()} / {req.toLocaleString()} units</p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'active_requests' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-slate-700 pb-4 mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-100">Manage Requests</h2>
                                <p className="text-sm text-slate-400">View and resolve ongoing broadcasted needs.</p>
                            </div>
                            <button onClick={() => setActiveTab('new_request')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow transition text-sm flex items-center gap-2">
                                <Megaphone size={16} /> New Broadcast
                            </button>
                        </div>

                        {needs.length === 0 ? (
                            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                                <ClipboardList size={48} className="mx-auto text-slate-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-400">No requests broadcasted yet.</h3>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {needs.map((n) => (
                                    <div key={n.id} className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${n.isActive ? 'bg-slate-800 border-slate-700 shadow-lg' : 'bg-slate-800/40 border-slate-800 opacity-70'}`}>
                                        <div className="flex gap-4 items-center">
                                            {n.imageUrl ? (
                                                <img src={n.imageUrl} alt="Need item" className="w-16 h-16 rounded-lg object-cover border border-slate-600" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-500"><Package size={24}/></div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg text-slate-100">{n.itemName}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase border ${n.isActive ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                                        {n.isActive ? 'Active' : 'Resolved'}
                                                    </span>
                                                    {n.isActive && <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${n.urgency === 'critical' ? 'bg-red-900/50 text-red-400' : 'bg-orange-900/50 text-orange-400'}`}>{n.urgency}</span>}
                                                </div>
                                                <p className="text-sm text-slate-400">{n.category} • Progress: {n.quantityPledged} / {n.quantityRequired}</p>
                                                
                                                <div className="w-48 bg-slate-700 rounded-full h-1.5 mt-2">
                                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min((n.quantityPledged / n.quantityRequired) * 100, 100)}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleToggleNeedStatus(n.id!, n.isActive!)}
                                                className={`px-4 py-2 font-bold rounded-lg text-sm transition shadow ${n.isActive ? 'bg-slate-700 hover:bg-emerald-600/80 text-white border border-slate-600' : 'bg-slate-700/50 hover:bg-slate-600 text-slate-300'}`}>
                                                {n.isActive ? 'Close Request' : 'Reopen Request'}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteNeed(n.id!)}
                                                className="p-2 rounded-lg bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition shadow"
                                                title="Delete permanently">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'new_request' && (
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-900/20 to-transparent">
                            <h2 className="text-2xl font-bold text-slate-100">Broadcast Urgent Need</h2>
                            <p className="text-sm text-slate-400 mt-1">Request supplies directly to the public registry</p>
                        </div>
                        <form onSubmit={handleBroadcastNeed} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Item Name <span className="text-red-400">*</span></label>
                                    <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} required
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Bottled Water (5L)" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                                    <select value={category} onChange={e => setCategory(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                        <option>Food</option><option>Medicine</option>
                                        <option>Clothing</option><option>Shelter</option>
                                        <option>Hygiene</option><option>Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Target Quantity <span className="text-red-400">*</span></label>
                                    <input type="number" value={qty} onChange={e => setQty(e.target.value)} required min="1"
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Units required" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-2">Urgency Level</label>
                                    <select value={urgency} onChange={e => setUrgency(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                                        <option value="low">Low</option><option value="medium">Medium</option>
                                        <option value="high">High</option><option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="bg-slate-900/50 p-5 rounded-xl border border-dashed border-slate-600">
                                <label className="block text-sm font-bold text-slate-300 mb-2">Reference Image (Optional)</label>
                                <p className="text-xs text-slate-500 mb-3">Upload a clean picture of the exact item needed to help donors identify it.</p>
                                <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload}
                                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer transition" />
                                {imageBase64 && <img src={imageBase64} alt="Preview" className="mt-4 h-32 w-auto rounded-lg object-cover shadow-md border border-slate-600" />}
                            </div>
                            
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition flex justify-center items-center gap-2 text-lg">
                                    <Megaphone size={20} /> Broadcast Need to Public Platform
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'pledges' && (
                    <div className="space-y-6">
                        <div className="border-b border-slate-700 pb-4 mb-4">
                            <h2 className="text-2xl font-bold text-slate-100">Incoming Pledges</h2>
                            <p className="text-sm text-slate-400">Track and verify donations arriving at your camp.</p>
                        </div>
                        
                        {pledges.length === 0 ? (
                            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                                <Package size={48} className="mx-auto text-slate-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-400">No pledges received yet.</h3>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {pledges.map(p => (
                                    <div key={p.id} className="p-5 rounded-xl border border-slate-700 bg-slate-800 shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-extrabold text-blue-400 text-lg">{p.quantity}x</span>
                                                <h3 className="font-bold text-slate-100 text-lg">{p.need?.itemName}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${p.status === 'collected' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-orange-900/50 text-orange-400'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 mt-1">Donor: <span className="font-medium text-slate-300">{p.donorName}</span> • {p.donorPhone} • {p.donorEmail}</p>
                                        </div>
                                        
                                        {p.status === 'pending' ? (
                                            <button onClick={() => handleUpdatePledge(p.id!, 'collected')}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2">
                                                <CheckCircle size={18} /> Verify Collected
                                            </button>
                                        ) : (
                                            <span className="text-emerald-500 font-bold flex items-center gap-2 bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-500/30">
                                                <CheckCircle size={18} /> Completed
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && <CampManagerAnalytics />}
            </div>
        </div>
    );
};

export default CampDashboard;
