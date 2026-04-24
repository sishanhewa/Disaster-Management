import React, { useEffect, useState } from 'react';
import { needsApi, pledgesApi } from '../../api/endpoints';
import type { ReliefNeed } from '../../types/relief';
import { Search, HeartHandshake, MapPin, AlertCircle, Package, ArrowRight, X } from 'lucide-react';

// Ported from Disaster-Management-master NeedsRegistry.tsx
// API: api.needs.getAll() → needsApi.getAll() | api.pledges.create() → pledgesApi.create()
// Auth: no auth required (public page)
// Image: need.imageBase64 → need.imageUrl (Cloudinary URL)

const NeedsRegistry: React.FC = () => {
    const [needs, setNeeds] = useState<ReliefNeed[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [urgencyFilter, setUrgencyFilter] = useState('All');

    const [pledgingNeed, setPledgingNeed] = useState<ReliefNeed | null>(null);
    const [pledgeQty, setPledgeQty] = useState<string>('');
    const [donorName, setDonorName] = useState<string>('');
    const [donorEmail, setDonorEmail] = useState<string>('');
    const [donorPhone, setDonorPhone] = useState<string>('');

    const fetchNeeds = async () => {
        try {
            const data = await needsApi.getAll();
            setNeeds(data.filter((n: ReliefNeed) => n.isActive).sort((a: ReliefNeed, b: ReliefNeed) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
        } catch (error) {
            console.error('Error fetching needs', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchNeeds(); }, []);

    const submitPledge = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pledgingNeed) return;
        const qtyInt = parseInt(pledgeQty);
        if (isNaN(qtyInt) || qtyInt <= 0) return alert('Invalid quantity');
        try {
            await pledgesApi.create({
                need: { id: pledgingNeed.id },
                quantity: qtyInt,
                donorName: donorName || 'Anonymous',
                donorEmail: donorEmail || 'anon@test.com',
                donorPhone: donorPhone || 'N/A',
            });
            alert('Pledge successful! We deeply appreciate your support.');
            setPledgingNeed(null);
            setPledgeQty(''); setDonorName(''); setDonorEmail(''); setDonorPhone('');
            fetchNeeds();
        } catch (error) {
            alert('Error making pledge. Ensure your connection is stable.');
        }
    };

    const filteredNeeds = needs.filter(need => {
        const itemName = need.itemName || '';
        const campName = need.camp?.campName || '';
        const district = need.camp?.district || '';
        const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              campName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              district.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || (need.category || '').toLowerCase() === categoryFilter.toLowerCase();
        const matchesUrgency = urgencyFilter === 'All' || (need.urgency || '').toLowerCase() === urgencyFilter.toLowerCase();
        return matchesSearch && matchesCategory && matchesUrgency;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-slate-800/60 p-6 rounded-2xl border border-slate-700 shadow-lg backdrop-blur-sm">
                <div className="flex-1">
                    <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
                        <HeartHandshake className="text-emerald-400" size={32} /> Urgent Needs Registry
                    </h2>
                    <p className="text-slate-400 mt-2 font-medium">Browse direct supply requests from active relief camps and pledge your support instantly.</p>
                </div>
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input type="text" placeholder="Search items or camps..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full sm:w-64 transition" />
                    </div>
                    <div className="flex gap-2">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer w-full sm:w-auto font-medium">
                            <option value="All">All Categories</option>
                            <option value="Food">Food</option><option value="Medicine">Medicine</option>
                            <option value="Clothing">Clothing</option><option value="Shelter">Shelter</option>
                            <option value="Hygiene">Hygiene</option><option value="Other">Other</option>
                        </select>
                        <select value={urgencyFilter} onChange={e => setUrgencyFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer w-full sm:w-auto font-medium">
                            <option value="All">Any Urgency</option>
                            <option value="critical">Critical Only</option><option value="high">High</option>
                            <option value="medium">Medium</option><option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
            ) : filteredNeeds.length === 0 ? (
                <div className="text-center py-24 bg-slate-800/30 rounded-3xl border border-dashed border-slate-700 max-w-3xl mx-auto">
                    <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-slate-700">
                        <Search size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-300 mb-2">No matches found</h3>
                    <p className="text-slate-500 text-lg">Try adjusting your filters or search terms.</p>
                    {(searchTerm || categoryFilter !== 'All' || urgencyFilter !== 'All') && (
                        <button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setUrgencyFilter('All'); }}
                                className="mt-6 text-emerald-400 hover:text-emerald-300 font-bold tracking-wide transition">
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredNeeds.map((need) => {
                        const progress = Math.min((need.quantityPledged / need.quantityRequired) * 100, 100);
                        const isGoalMet = need.quantityPledged >= need.quantityRequired;
                        const urgencyColors: Record<string, string> = {
                            critical: 'bg-red-500/20 text-red-400 border-red-500/30',
                            high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
                            medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                            low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                        };
                        return (
                            <div key={need.id} className="group flex flex-col bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden hover:shadow-emerald-900/20 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative h-48 overflow-hidden bg-slate-900">
                                    {need.imageUrl ? (
                                        <img src={need.imageUrl} alt={need.itemName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                                            <Package size={40} className="mb-2 opacity-50" />
                                            <span className="text-sm font-medium tracking-wide uppercase">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg ${urgencyColors[need.urgency] || urgencyColors.medium}`}>
                                            {need.urgency}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1 rounded-full text-xs font-bold text-slate-300 shadow-lg">
                                        {need.category}
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="text-xl font-extrabold text-slate-100 mb-2 truncate" title={need.itemName}>{need.itemName}</h3>
                                    <div className="flex items-start gap-2 text-sm text-slate-400 mb-5 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                                        <MapPin size={16} className="mt-0.5 text-blue-400 shrink-0" />
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-slate-300 truncate" title={need.camp?.campName}>{need.camp?.campName}</p>
                                            <p className="text-xs mt-0.5">{need.camp?.district}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">Progress</p>
                                                <p className="text-sm font-bold text-slate-300"><span className={isGoalMet ? 'text-emerald-400' : 'text-blue-400'}>{need.quantityPledged}</span> / {need.quantityRequired}</p>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500">{Math.round(progress)}%</p>
                                        </div>
                                        <div className="w-full bg-slate-900 rounded-full h-2 mb-5 overflow-hidden border border-slate-700">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${isGoalMet ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
                                                style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <button onClick={() => setPledgingNeed(need)} disabled={isGoalMet}
                                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isGoalMet
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-900/50'}`}>
                                            {isGoalMet ? 'Goal Met' : <><span>Pledge Donation</span><ArrowRight size={18} /></>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pledge Modal */}
            {pledgingNeed && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-700">
                        <div className="relative h-32 bg-slate-900">
                            {pledgingNeed.imageUrl ? (
                                <img src={pledgingNeed.imageUrl} className="w-full h-full object-cover opacity-40 mix-blend-overlay" alt="" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 to-slate-900"></div>
                            )}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-800 to-transparent">
                                <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-1">Make a Pledge</span>
                                <h3 className="text-2xl font-extrabold text-white truncate">{pledgingNeed.itemName}</h3>
                            </div>
                            <button onClick={() => setPledgingNeed(null)} className="absolute top-4 right-4 bg-black/40 text-slate-300 hover:text-white p-2 rounded-full backdrop-blur-md transition">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={submitPledge} className="p-6">
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 mb-6 flex items-start gap-3">
                                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-slate-300">
                                    <p>You are committing to donate physical goods to:</p>
                                    <p className="font-bold text-white mt-0.5">{pledgingNeed.camp?.campName || 'Unknown Camp'}</p>
                                    <p className="text-xs text-slate-400">Currently needs {pledgingNeed.quantityRequired - (pledgingNeed.quantityPledged || 0)} more units.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-1.5">Donation Quantity <span className="text-red-400">*</span></label>
                                    <input type="number" value={pledgeQty} onChange={e => setPledgeQty(e.target.value)} required min="1" max={pledgingNeed.quantityRequired - pledgingNeed.quantityPledged}
                                        className="w-full rounded-xl border border-slate-600 bg-slate-900 text-slate-100 px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition text-lg"
                                        placeholder={`E.g., ${Math.min(10, pledgingNeed.quantityRequired - pledgingNeed.quantityPledged)}`} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Full Name (Optional)</label>
                                        <input type="text" value={donorName} onChange={e => setDonorName(e.target.value)}
                                            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number (Optional)</label>
                                        <input type="tel" value={donorPhone} onChange={e => setDonorPhone(e.target.value)}
                                            className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Email Address (Optional)</label>
                                    <input type="email" value={donorEmail} onChange={e => setDonorEmail(e.target.value)}
                                        className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-100 px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                                </div>
                            </div>
                            <button type="submit" className="mt-8 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition flex justify-center items-center gap-2 text-lg">
                                <HeartHandshake size={20} /> Confirm Donation Pledge
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeedsRegistry;
