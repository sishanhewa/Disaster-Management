import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Camp } from '../types';

const CampDashboard: React.FC = () => {
    const [camps, setCamps] = useState<Camp[]>([]);
    const [selectedCamp, setSelectedCamp] = useState('');

    // New Need Form State
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('Food');
    const [qty, setQty] = useState('');
    const [imageBase64, setImageBase64] = useState<string>('');
    const [urgency, setUrgency] = useState('High');

    // Dashboard Data
    const [pledges, setPledges] = useState<any[]>([]);

    // Get the logged in manager
    const managerStr = localStorage.getItem('user');
    const manager = managerStr ? JSON.parse(managerStr) : null;

    useEffect(() => {
        if (manager && manager.id) {
            fetchManagerCamps();
            fetchManagerPledges();
        }
    }, []);

    const fetchManagerCamps = async () => {
        try {
            if (!manager?.id) return;
            const data = await api.camps.getByManager(manager.id);
            setCamps(data);
            if (data.length > 0) {
                const firstId = data[0].id;
                if (firstId) setSelectedCamp(firstId);
            }
        } catch (error) {
            console.error("Error fetching camps", error);
        }
    };

    const fetchManagerPledges = async () => {
        try {
            if (!manager?.id) return;
            const data = await api.pledges.getByManager(manager.id);
            setPledges(data);
        } catch (error) {
            console.error("Error fetching pledges", error);
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBroadcastNeed = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCamp) return alert("Please select a camp first");

        try {
            await api.needs.create({
                camp: { id: selectedCamp } as any,
                itemName,
                category,
                quantityRequired: parseInt(qty),
                urgency: urgency,
                imageBase64: imageBase64 || undefined
            });
            alert("Need Broadcasted to Donors!");
            setItemName(''); setQty(''); setImageBase64(''); setUrgency('High');
        } catch (err) { alert("Failed to broadcast need."); }
    };

    const handleMarkCollected = async (pledgeId: string) => {
        try {
            await api.pledges.updateStatus(pledgeId, 'COLLECTED');
            alert('Marked as Collected!');
            fetchManagerPledges();
        } catch (error) {
            alert('Failed to update pledge status');
        }
    }

    if (!manager) return <div className="p-8 text-center bg-red-900/30 text-red-400 rounded-xl border border-red-500/40">Access Denied: Please log in as a Camp Manager.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold border-b border-slate-700 pb-2 text-slate-100">Camp Manager Dashboard</h1>

            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-yellow-300">
                You are managing <strong>{camps.length}</strong> camps. Select a camp below to manage items.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Broadcast Need Panel */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 order-1">
                    <h2 className="text-xl font-semibold mb-4 text-red-400">Broadcast Urgent Need</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-slate-300 mb-1">Select Your Camp</label>
                        <select
                            value={selectedCamp}
                            onChange={e => setSelectedCamp(e.target.value)}
                            className="w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">-- Choose Camp --</option>
                            {camps.map(c => <option key={c.id} value={c.id}>{c.campName} ({c.district})</option>)}
                        </select>
                    </div>

                    <form onSubmit={handleBroadcastNeed} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300">Item Name</label>
                            <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g. Blankets, Rice" required
                                className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-300">Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Food</option>
                                    <option>Medicine</option>
                                    <option>Clothing</option>
                                    <option>Shelter</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300">Urgency</label>
                                <select value={urgency} onChange={e => setUrgency(e.target.value)} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300">Qty Needed</label>
                                <input type="number" value={qty} onChange={e => setQty(e.target.value)} min="1" required
                                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 shadow-sm border p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300">Reference Image (Optional)</label>
                            <input type="file" accept="image/*" onChange={handleImageUpload}
                                className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-800/50" />
                            {imageBase64 && <img src={imageBase64} alt="Preview" className="mt-2 h-24 rounded object-cover" />}
                        </div>
                        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold w-full hover:bg-red-500 disabled:opacity-50 transition" disabled={!selectedCamp}>
                            Publish Urgent Need to Donors
                        </button>
                    </form>
                </div>

                {/* Incoming Pledges Panel */}
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 order-2">
                    <h2 className="text-xl font-semibold mb-4 text-emerald-400">Incoming Donor Pledges</h2>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                        {pledges.length === 0 && <p className="text-slate-500 italic">No pledges received yet.</p>}

                        {pledges.map((pledge: any) => (
                            <div key={pledge.id} className="border border-slate-600 rounded-lg p-4 bg-slate-700/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-100">{pledge.quantity}x {pledge.need?.itemName}</h4>
                                        <p className="text-xs text-blue-400">To: {pledge.need?.camp?.campName}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${pledge.status.toLowerCase() === 'collected' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30'}`}>
                                        {pledge.status}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-400 mb-3 bg-slate-700 p-2 rounded border border-slate-600">
                                    <p><strong className="text-slate-300">Donor:</strong> {pledge.donorName || (pledge.donor ? pledge.donor.fullName : 'Anonymous')}</p>
                                    <p><strong className="text-slate-300">Contact:</strong> {pledge.donorPhone || 'N/A'}</p>
                                </div>

                                {pledge.status.toLowerCase() !== 'collected' && (
                                    <button
                                        onClick={() => handleMarkCollected(pledge.id)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 px-3 rounded text-sm transition"
                                    >
                                        Mark Items as Collected
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CampDashboard;
