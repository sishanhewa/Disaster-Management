import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Need } from '../types';

const NeedsRegistry: React.FC = () => {
    const [needs, setNeeds] = useState<Need[]>([]);

    const fetchNeeds = async () => {
        try {
            const data = await api.needs.getAll();
            setNeeds(data);
        } catch (error) {
            console.error("Error fetching needs", error);
        }
    };

    useEffect(() => {
        fetchNeeds();
    }, []);

    const [pledgingNeed, setPledgingNeed] = useState<Need | null>(null);

    // Pledge Form State
    const [pledgeQty, setPledgeQty] = useState<string>('');
    const [donorName, setDonorName] = useState<string>('');
    const [donorEmail, setDonorEmail] = useState<string>('');
    const [donorPhone, setDonorPhone] = useState<string>('');

    const submitPledge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pledgingNeed) return;

        const qtyInt = parseInt(pledgeQty);
        if (isNaN(qtyInt) || qtyInt <= 0) return alert("Invalid quantity");

        try {
            await api.pledges.create({
                need: { id: pledgingNeed.id } as any,
                quantity: qtyInt,
                donorName: donorName || "Anonymous",
                donorEmail: donorEmail || "anon@test.com",
                donorPhone: donorPhone || "N/A"
            });
            alert('Pledge successful! Thank you.');
            setPledgingNeed(null);
            setPledgeQty(''); setDonorName(''); setDonorEmail(''); setDonorPhone('');
            fetchNeeds();
        } catch (error) {
            alert('Error making pledge.');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-slate-100">Urgent Needs Registry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {needs.length === 0 ? <p className="text-slate-400">No active needs right now. Thank you!</p> : null}

                {needs.map((need, idx) => (
                    <div key={idx} className="border border-slate-700 rounded-xl shadow-lg bg-slate-800 overflow-hidden hover:shadow-xl transition flex flex-col">
                        {need.imageBase64 && (
                            <img src={need.imageBase64} alt={need.itemName} className="w-full h-48 object-cover border-b border-slate-700" />
                        )}
                        {!need.imageBase64 && (
                            <div className="w-full h-16 bg-slate-700 border-b border-slate-600 flex items-center justify-center text-slate-400 text-sm">
                                No Image Provided
                            </div>
                        )}
                        <div className="p-4 flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-blue-400">{need.itemName}</h3>
                                <span className="text-xs bg-red-900/50 text-red-400 border border-red-500/40 px-2 py-1 rounded-full uppercase font-bold">
                                    {need.urgency}
                                </span>
                            </div>

                            <div className="mb-4 text-sm text-slate-300 bg-slate-700/50 p-2 rounded border border-slate-600">
                                <p className="font-bold flex justify-between items-center">
                                    <span>{need.camp?.campName} ({need.camp?.district})</span>
                                    <Link
                                        to={`/camp/${need.camp?.id}`}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 font-bold"
                                    >
                                        View Camp Page
                                    </Link>
                                </p>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1 text-slate-300">
                                    <span>Progress</span>
                                    <span>{need.quantityPledged} / {need.quantityRequired} pledged</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full"
                                        style={{ width: `${Math.min((need.quantityPledged / need.quantityRequired) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <button
                                onClick={() => setPledgingNeed(need)}
                                disabled={need.quantityPledged >= need.quantityRequired}
                                className={`w-full py-2 rounded font-bold mt-auto ${need.quantityPledged >= need.quantityRequired
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    }`}
                            >
                                {need.quantityPledged >= need.quantityRequired ? 'Goal Met' : 'Pledge Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pledge Modal Form */}
            {pledgingNeed && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col transform transition-all border border-slate-700">
                        <div className="p-5 border-b border-slate-700 bg-emerald-600 text-white flex justify-between items-center">
                            <h3 className="text-xl font-bold">Pledge to Donate</h3>
                            <button onClick={() => setPledgingNeed(null)} className="text-emerald-100 hover:text-white font-bold text-xl">✕</button>
                        </div>
                        <form onSubmit={submitPledge} className="p-5 overflow-y-auto">
                            <div className="mb-4 bg-slate-700/50 p-3 rounded border border-slate-600">
                                <p className="text-sm text-slate-400">You are pledging:</p>
                                <p className="font-bold text-lg text-slate-100">{pledgingNeed.itemName}</p>
                                <p className="text-sm font-medium text-blue-400">{pledgingNeed.camp.campName}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Quantity <span className="text-red-400">*</span></label>
                                    <input type="number" value={pledgeQty} onChange={e => setPledgeQty(e.target.value)} required min="1" max={pledgingNeed.quantityRequired - pledgingNeed.quantityPledged}
                                        className="w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder={`E.g., ${Math.min(10, pledgingNeed.quantityRequired - pledgingNeed.quantityPledged)}`} />
                                </div>
                                <hr className="border-slate-700" />
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Full Name (Optional)</label>
                                    <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)}
                                        className="w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Leave blank to remain anonymous" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Email Address</label>
                                    <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                                        className="w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="donor@test.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Phone Number</label>
                                    <input type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)}
                                        className="w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="077-XXXXXXX" />
                                </div>
                            </div>

                            <div className="mt-6">
                                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg shadow transition">
                                    Confirm Pledge
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NeedsRegistry;
