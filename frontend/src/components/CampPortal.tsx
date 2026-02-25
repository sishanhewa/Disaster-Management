import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Need, Camp } from '../types';

const CampPortal: React.FC = () => {
    const { campId } = useParams<{ campId: string }>();
    const [camp, setCamp] = useState<Camp | null>(null);
    const [needs, setNeeds] = useState<Need[]>([]);
    const [loading, setLoading] = useState(true);

    // Pledge Form State
    const [pledgingNeed, setPledgingNeed] = useState<Need | null>(null);
    const [pledgeQty, setPledgeQty] = useState<string>('1');
    const [donorName, setDonorName] = useState<string>('');
    const [donorEmail, setDonorEmail] = useState<string>('');
    const [donorPhone, setDonorPhone] = useState<string>('');

    useEffect(() => {
        if (campId) {
            fetchCampDetails();
            fetchCampNeeds();
        }
    }, [campId]);

    const fetchCampDetails = async () => {
        try {
            // Fetch all camps and filter (since we don't have a specific GET /camps/{id} endpoint yet)
            const data = await api.camps.getAll();
            const found = data.find((c: Camp) => c.id === campId);
            setCamp(found || null);
        } catch (error) {
            console.error("Error fetching camp details", error);
        }
    };

    const fetchCampNeeds = async () => {
        try {
            // Fetch all active needs and filter
            const data = await api.needs.getAll();
            const campNeeds = data.filter((n: Need) => n.camp?.id === campId);
            setNeeds(campNeeds);
        } catch (error) {
            console.error("Error fetching needs", error);
        } finally {
            setLoading(false);
        }
    };

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
            setPledgeQty('1'); setDonorName(''); setDonorEmail(''); setDonorPhone('');
            fetchCampNeeds();
        } catch (error) {
            alert('Error making pledge.');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading Camp Portal...</div>;

    if (!camp) return (
        <div className="p-8 text-center bg-red-900/30 text-red-400 rounded-xl border border-red-500/40">
            <h2>Camp Not Found</h2>
            <p className="mb-4">We couldn't locate the relief camp you are looking for.</p>
            <Link to="/" className="text-blue-400 underline">Return to Global Needs Registry</Link>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {/* Camp Header Hero */}
            <div className="bg-slate-800 text-white rounded-xl shadow-lg p-8 mb-8 border border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-slate-100">{camp.campName} Relief Portal</h1>
                        <p className="text-slate-400 text-lg flex items-center gap-2">
                            <span>📍 {camp.district} District</span> | <span>{camp.address}</span>
                        </p>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700 flex gap-4">
                    <p className="text-sm text-slate-400">Welcome to the dedicated portal for {camp.campName}. This page shows only the active, verified needs for this specific camp. Your donations mapped here go directly to this location.</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-slate-100">Urgent Needs for this Camp</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {needs.length === 0 ? (
                    <div className="col-span-full p-8 text-center bg-emerald-900/30 text-emerald-400 rounded-xl border border-emerald-500/30">
                        <h3 className="text-xl font-bold mb-2">All Needs Met!</h3>
                        <p>This camp currently has no active requests. Thank you to all donors!</p>
                        <Link to="/" className="inline-block mt-4 text-blue-400 hover:underline">View other camps in need</Link>
                    </div>
                ) : null}

                {needs.map((need, idx) => (
                    <div key={idx} className="border border-slate-700 rounded-xl shadow-lg bg-slate-800 overflow-hidden hover:shadow-xl transition flex flex-col">
                        {need.imageBase64 && (
                            <img src={need.imageBase64} alt={need.itemName} className="w-full h-48 object-cover border-b border-slate-700" />
                        )}
                        {!need.imageBase64 && (
                            <div className="w-full h-24 bg-slate-700 border-b border-slate-600 flex flex-col items-center justify-center text-slate-400">
                                <span className="font-bold text-lg text-slate-500">{need.category}</span>
                            </div>
                        )}
                        <div className="p-4 flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-blue-400">{need.itemName}</h3>
                                <span className="text-xs bg-red-900/50 text-red-400 border border-red-500/40 px-2 py-1 rounded-full uppercase font-bold">
                                    {need.urgency}
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1 text-slate-300">
                                    <span>Goal Progress</span>
                                    <span className="font-bold">{need.quantityPledged} / {need.quantityRequired} pledged</span>
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
                                className={`w-full py-2 rounded font-bold mt-auto transition ${need.quantityPledged >= need.quantityRequired
                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                                    }`}
                            >
                                {need.quantityPledged >= need.quantityRequired ? 'Goal Met' : 'Pledge to Donate'}
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
                            <h3 className="text-xl font-bold">Pledge to {camp.campName}</h3>
                            <button onClick={() => setPledgingNeed(null)} className="text-emerald-100 hover:text-white font-bold text-xl">✕</button>
                        </div>
                        <form onSubmit={submitPledge} className="p-5 overflow-y-auto">
                            <div className="mb-4 bg-slate-700/50 p-3 rounded border border-slate-600">
                                <p className="text-sm text-slate-400">You are pledging:</p>
                                <p className="font-bold text-lg text-slate-100">{pledgingNeed.itemName}</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1">Quantity <span className="text-red-400">*</span></label>
                                    <input type="number" value={pledgeQty} onChange={e => setPledgeQty(e.target.value)} required min="1" max={pledgingNeed.quantityRequired - pledgingNeed.quantityPledged}
                                        className="w-full rounded-md border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder={`Max: ${Math.max(0, pledgingNeed.quantityRequired - pledgingNeed.quantityPledged)}`} />
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

export default CampPortal;
