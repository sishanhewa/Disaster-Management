import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Need } from '../types';

const TransparencyWall: React.FC = () => {
    const [needs, setNeeds] = useState<Need[]>([]);

    useEffect(() => {
        // We will just re-use the needs endpoint to show a transparency feed of what has been completely fulfilled.
        const fetchNeeds = async () => {
            try {
                const data = await api.needs.getAll();
                setNeeds(data);
            } catch (err) { console.error(err); }
        };
        fetchNeeds();
    }, []);

    const fulfilledNeeds = needs.filter(n => n.quantityReceived > 0 || n.quantityPledged >= n.quantityRequired);

    return (
        <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center border-b border-slate-700 pb-2 text-slate-100">Public Transparency Wall</h2>
            <p className="text-slate-400 text-center mb-8">Live updates of aid successfully reaching relief camps.</p>

            <div className="space-y-6">
                {fulfilledNeeds.length === 0 && <p className="text-center text-slate-500">No fulfilled donations yet. Be the first to pledge!</p>}

                {fulfilledNeeds.map((need, idx) => (
                    <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg flex items-start gap-4">
                        <div className="bg-emerald-900/50 p-3 rounded-full text-emerald-400 border border-emerald-500/30">
                            ✓
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">{new Date(need.createdAt || '').toLocaleDateString()}</p>
                            <h3 className="text-lg font-bold text-slate-100">
                                {need.quantityRequired}x {need.itemName} Goal Achieved!
                            </h3>
                            <p className="text-slate-400">
                                Thanks to generous donors, the goal for {need.camp?.campName} in {need.camp?.district} has been met.
                            </p>
                            <div className="mt-2 text-xs font-bold text-emerald-400 bg-emerald-900/30 px-2 py-1 inline-block rounded border border-emerald-500/30">
                                {need.quantityReceived} physically delivered so far.
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransparencyWall;
