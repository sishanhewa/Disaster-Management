import React, { useEffect, useRef, useState } from 'react';
import { needsApi, pledgesApi, campsApi } from '../../api/endpoints';
import type { ReliefNeed, ReliefPledge, Camp } from '../../types/relief';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import {
  Download, Package, CheckCircle, Clock, AlertTriangle, TrendingUp,
  Users, Tent, BarChart2, HeartHandshake,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ── Constants ──────────────────────────────────────────────────────
const PALETTE = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
const URGENCY_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22d3ee',
};
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', collected: '#10b981', delivered: '#6366f1',
};

const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

// ── Stat card ─────────────────────────────────────────────────────
const MiniStat: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string }> =
  ({ icon, label, value, color }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4 shadow-lg">
      <div className={`p-2.5 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  );

// ── Main component ────────────────────────────────────────────────
const CampManagerAnalytics: React.FC = () => {
  const [needs, setNeeds] = useState<ReliefNeed[]>([]);
  const [pledges, setPledges] = useState<ReliefPledge[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Get manager from localStorage
  const manager = (() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  })();

  useEffect(() => {
    if (!manager?.id) { setLoading(false); return; }
    Promise.all([
      needsApi.getByManager(manager.id),
      pledgesApi.getByManager(manager.id),
      campsApi.getByManager(manager.id),
    ])
      .then(([n, p, c]) => { setNeeds(n); setPledges(p); setCamps(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Derived ────────────────────────────────────────────────────
  const totalRequired = needs.reduce((s, n) => s + (n.quantityRequired || 0), 0);
  const totalPledged  = needs.reduce((s, n) => s + (n.quantityPledged  || 0), 0);
  const totalReceived = needs.reduce((s, n) => s + (n.quantityReceived || 0), 0);
  const activeNeeds   = needs.filter(n => n.isActive).length;
  const pendingPledges   = pledges.filter(p => p.status === 'pending').length;
  const collectedPledges = pledges.filter(p => p.status === 'collected').length;

  // Category chart
  const categoryData = Object.entries(
    needs.reduce<Record<string, { required: number; pledged: number }>>((acc, n) => {
      const k = n.category || 'Other';
      if (!acc[k]) acc[k] = { required: 0, pledged: 0 };
      acc[k].required += n.quantityRequired || 0;
      acc[k].pledged  += n.quantityPledged  || 0;
      return acc;
    }, {})
  ).map(([name, v]) => ({ name, ...v }));

  // Urgency breakdown
  const urgencyData = Object.entries(
    needs.reduce<Record<string, number>>((acc, n) => {
      const k = (n.urgency || 'unknown').toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // Pledge status pie
  const pledgeStatusData = Object.entries(
    pledges.reduce<Record<string, number>>((acc, p) => {
      const k = p.status || 'pending';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // Timeline — pledges by date
  const timelineData = Object.entries(
    pledges.reduce<Record<string, number>>((acc, p) => {
      const d = p.createdAt ? p.createdAt.slice(0, 10) : 'Unknown';
      acc[d] = (acc[d] || 0) + (p.quantity || 0);
      return acc;
    }, {})
  ).sort(([a], [b]) => a.localeCompare(b))
    .map(([date, units]) => ({ date: date.slice(5), units })); // "MM-DD"

  // ── PDF Export ────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, useCORS: true,
        backgroundColor: '#0f172a',
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = pdf.internal.pageSize.getWidth();
      const H = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * W) / canvas.width;
      let y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, W, imgH);
        y += H;
      }
      const name = manager?.fullName?.replace(/\s+/g, '_') || 'Manager';
      pdf.save(`SIDMS_Camp_Report_${name}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  if (!manager || manager.role !== 'camp_manager') {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>Please log in as a Camp Manager to view analytics.</p>
      </div>
    );
  }

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
    </div>
  );

  const fulfillmentRate = pct(totalPledged, totalRequired);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
            <BarChart2 className="text-emerald-400" size={30} /> My Camp Analytics
          </h2>
          <p className="text-slate-400 mt-1 text-sm">Personal performance dashboard for <span className="text-white font-semibold">{manager.fullName}</span>.</p>
        </div>
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition-all"
        >
          <Download size={18} /> {exporting ? 'Generating PDF…' : 'Download My PDF Report'}
        </button>
      </div>

      {/* Printable area */}
      <div ref={reportRef} className="space-y-8 bg-slate-900 rounded-2xl p-6">

        {/* Report header */}
        <div className="flex items-start justify-between border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white">SIDMS · Camp Manager Report</h1>
            <p className="text-slate-400 text-sm mt-1">Manager: <strong className="text-white">{manager.fullName}</strong></p>
            <p className="text-slate-400 text-sm">Camps managed: <strong className="text-white">{camps.map(c => c.campName).join(', ') || '—'}</strong></p>
            <p className="text-slate-500 text-xs mt-1">Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-widest">Camp Report</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniStat icon={<Tent size={20} className="text-indigo-300" />}        label="Camps Managed"    value={camps.length}             color="bg-indigo-600/20" />
          <MiniStat icon={<AlertTriangle size={20} className="text-red-300" />}  label="Active Needs"     value={activeNeeds}              color="bg-red-600/20" />
          <MiniStat icon={<HeartHandshake size={20} className="text-amber-300" />} label="Total Pledges"  value={pledges.length}           color="bg-amber-600/20" />
          <MiniStat icon={<Package size={20} className="text-emerald-300" />}    label="Units Collected"  value={pledges.filter(p => p.status === 'collected').reduce((s, p) => s + (p.quantity || 0), 0)} color="bg-emerald-600/20" />
        </div>

        {/* Fulfilment progress bar */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-bold text-slate-300 text-sm uppercase tracking-widest">Overall Items Fulfilment</h3>
            <span className={`text-2xl font-black ${fulfillmentRate >= 80 ? 'text-emerald-400' : fulfillmentRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{fulfillmentRate}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-600">
            <div
              className={`h-4 rounded-full transition-all duration-1000 ${fulfillmentRate >= 80 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : fulfillmentRate >= 50 ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-red-700 to-red-500'}`}
              style={{ width: `${fulfillmentRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>{totalPledged.toLocaleString()} pledged</span>
            <span>{totalRequired.toLocaleString()} required</span>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Items by Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Bar dataKey="required" name="Required" fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="pledged"  name="Pledged"  fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Urgency */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Needs by Urgency</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {urgencyData.map((entry, i) => (
                    <Cell key={i} fill={URGENCY_COLORS[entry.name.toLowerCase()] || PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pledge status */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pledge Status Breakdown</h3>
            {pledgeStatusData.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No pledges yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pledgeStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} (${Math.round(percent * 100)}%)`} labelLine={false}>
                    {pledgeStatusData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.name.toLowerCase()] || PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pledge timeline */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Pledge Inflow Over Time</h3>
            {timelineData.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No pledge timeline data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timelineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="units" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3, fill: '#22d3ee' }} name="Units Pledged" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Needs detail */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center gap-2">
            <Package size={18} className="text-emerald-400" />
            <h3 className="font-bold text-slate-200">My Broadcasted Needs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {['Item', 'Category', 'Urgency', 'Required', 'Pledged', 'Received', '%'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {needs.map((n, i) => {
                  const p = pct(n.quantityPledged || 0, n.quantityRequired);
                  return (
                    <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="px-4 py-3 font-semibold text-slate-200">{n.itemName}</td>
                      <td className="px-4 py-3"><span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">{n.category}</span></td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                          style={{ background: (URGENCY_COLORS[(n.urgency || '').toLowerCase()] || '#475569') + '33', color: URGENCY_COLORS[(n.urgency || '').toLowerCase()] || '#94a3b8' }}>
                          {n.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{n.quantityRequired}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{n.quantityPledged || 0}</td>
                      <td className="px-4 py-3 text-cyan-400">{n.quantityReceived || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-700 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${p >= 80 ? 'bg-emerald-500' : p >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${p}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-400">{p}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {needs.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 text-slate-500">No needs broadcasted yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pledges detail */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center gap-2">
            <HeartHandshake size={18} className="text-amber-400" />
            <h3 className="font-bold text-slate-200">Incoming Pledges Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {['Donor', 'Item', 'Qty', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pledges.map((p, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3 font-semibold text-slate-200">{p.donorName || 'Anonymous'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{(p.need as any)?.itemName || '—'}</td>
                    <td className="px-4 py-3 text-indigo-400 font-bold">{p.quantity}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                        style={{ background: (STATUS_COLORS[p.status || 'pending'] || '#475569') + '33', color: STATUS_COLORS[p.status || 'pending'] || '#94a3b8' }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
                {pledges.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500">No pledges received yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 pt-4 flex items-center justify-between text-slate-600 text-xs">
          <span>SIDMS · Sri Lanka Integrated Disaster Management System</span>
          <span>Report generated on {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CampManagerAnalytics;
