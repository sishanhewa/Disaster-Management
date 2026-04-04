import React, { useState, useEffect } from 'react';
import { campsApi, needsApi, pledgesApi, mediaApi } from '../../api/endpoints';
import { useAuthStore } from '../../store/authStore';
import type { Camp, ReliefNeed, ReliefPledge } from '../../types/relief';
import { LayoutDashboard, Megaphone, ClipboardList, Package, CheckCircle, Clock } from 'lucide-react';

// Ported from Disaster-Management-master CampDashboard.tsx
// Auth: localStorage.getItem('user') → useAuthStore | manager.role → user.roles.includes
// API: api.camps/needs/pledges → campsApi/needsApi/pledgesApi
// Image: imageBase64 base64 inline upload → mediaApi.upload() (Cloudinary) → imageUrl

const CampDashboard: React.FC = () => {
    const user = useAuthStore(state => state.user);
    const [camps, setCamps] = useState<Camp[]>([]);
    const [needs, setNeeds] = useState<ReliefNeed[]>([]);
    const [pledges, setPledges] = useState<ReliefPledge[]>([]);
    const [selectedCamp, setSelectedCamp] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'overview' | 'active_requests' | 'new_request' | 'pledges'>('overview');
    const [isLoading, setIsLoading] = useState(true);

    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('Food');
    const [qty, setQty] = useState('');
    const [urgency, setUrgency] = useState('high');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const isResponder = user?.roles?.some(r => ['responder', 'RESPONDER', 'admin', 'ADMIN'].includes(r));

    const loadData = async () => {
        if (!user?.id) { setIsLoading(false); return; }
        try {
            const c = await campsApi.getByManager(user.id);
            setCamps(c);
            if (c.length > 0 && c[0].id) setSelectedCamp(c[0].id);

            const n = await needsApi.getByManager(user.id);
            setNeeds(n.sort((a: ReliefNeed, b: ReliefNeed) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));

            const p = await pledgesApi.getByManager(user.id);
            setPledges(p.sort((a: ReliefPledge, b: ReliefPledge) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
        } catch (error) {
            console.error('Error loading dashboard data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleBroadcastNeed = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let imageUrl: string | undefined;
            if (imageFile) {
                const uploadResult = await mediaApi.upload(imageFile, 'relief-needs');
                imageUrl = uploadResult.url;
            }
            await needsApi.create({
                camp: { id: selectedCamp },
                itemName,
                category,
                quantityRequired: parseInt(qty),
                urgency,
                imageUrl,
            });
            alert('Urgent need broadcasted successfully!');
            setItemName(''); setQty(''); setImageFile(null); setImagePreview(null);
            loadData();
            setActiveTab('active_requests');
        } catch (error) {
            alert('Failed to broadcast need.');
        }
    };

    const handleUpdatePledge = async (id: string, status: string) => {
        try {
            await pledgesApi.updateStatus(id, status);
            loadData();
        } catch (e) { alert('Failed to update pledge.'); }
    };

    const handleToggleNeedStatus = async (id: string, currentStatus: boolean) => {
        try {
            await needsApi.updateStatus(id, !currentStatus);
            loadData();
        } catch (e) { alert('Failed to update request status.'); }
    };

    if (!isResponder) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-8 text-center bg-slate-800 text-slate-300 rounded-xl border border-slate-700 shadow-xl">
                <h2 className="text-xl font-bold text-red-400 mb-2">Access Denied</h2>
                <p>You must be logged in with a Camp Manager or Admin account to view this dashboard.</p>
            </div>
        );
    }

    if (isLoading) return <div className="text-center text-slate-400 py-20 text-lg">Loading Management Systems...</div>;

    const activeNeedsCount = needs.filter(n => n.isActive).length;
    const pendingPledgesCount = pledges.filter(p => p.status === 'pending').length;
    const itemsCollectedCount = pledges.filter(p => p.status === 'collected').reduce((acc, p) => acc + p.quantity, 0);

    return (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex flex-col gap-2">
                <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl mb-4 text-center">
                    <div className="w-16 h-16 bg-blue-900/50 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold uppercase border border-blue-500/30">
                        {user?.displayName?.charAt(0)}
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{user?.displayName}</h3>
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
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Manager Dashboard</h2>
                            <p className="text-slate-400 mt-1 text-sm font-medium">Select a camp to view customized reporting</p>
                            <select value={selectedCamp} onChange={(e) => setSelectedCamp(e.target.value)}
                                className="mt-3 w-full md:w-auto bg-slate-800 border-none rounded-xl px-4 py-3 text-slate-100 font-bold focus:ring-2 focus:ring-blue-500 shadow-lg cursor-pointer">
                                {camps.map(c => <option key={c.id} value={c.id}>{c.campName} ({c.district})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-5">
                                <div className="p-3 bg-red-900/30 text-red-500 rounded-xl border border-red-500/30"><ClipboardList size={28} /></div>
                                <div><p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Needs</p><h3 className="text-3xl font-extrabold text-slate-100 mt-1">{activeNeedsCount}</h3></div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-5">
                                <div className="p-3 bg-orange-900/30 text-orange-500 rounded-xl border border-orange-500/30"><Clock size={28} /></div>
                                <div><p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Pending Pledges</p><h3 className="text-3xl font-extrabold text-slate-100 mt-1">{pendingPledgesCount}</h3></div>
                            </div>
                            <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-5">
                                <div className="p-3 bg-emerald-900/30 text-emerald-500 rounded-xl border border-emerald-500/30"><CheckCircle size={28} /></div>
                                <div><p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Items Collected</p><h3 className="text-3xl font-extrabold text-slate-100 mt-1">{itemsCollectedCount}</h3></div>
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
                                                <div className="w-16 h-16 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-500"><Package size={24} /></div>
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
                                        <button onClick={() => handleToggleNeedStatus(n.id!, n.isActive!)}
                                            className={`px-4 py-2 font-bold rounded-lg text-sm transition shadow ${n.isActive ? 'bg-slate-700 hover:bg-red-600/80 text-white border border-slate-600 hover:border-red-500' : 'bg-slate-700/50 hover:bg-slate-600 text-slate-300'}`}>
                                            {n.isActive ? 'Close Request' : 'Reopen Request'}
                                        </button>
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
                                        <option>Food</option><option>Medicine</option><option>Clothing</option>
                                        <option>Shelter</option><option>Hygiene</option><option>Other</option>
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
                                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelect}
                                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer transition" />
                                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-32 w-auto rounded-lg object-cover shadow-md border border-slate-600" />}
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
            </div>
        </div>
    );
};

export default CampDashboard;
