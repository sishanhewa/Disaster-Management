import React, { useEffect, useRef, useState } from 'react';
import { needsApi, pledgesApi, campsApi } from '../../api/endpoints';
import type { ReliefNeed, ReliefPledge, Camp } from '../../types/relief';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';
import {
  Download, TrendingUp, Package, Users, Tent, AlertTriangle,
  CheckCircle, Clock, BarChart2, PieChartIcon,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Colour palette ───────────────────────────────────────────────
const PALETTE = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
const URGENCY_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#22d3ee',
};

// ─── Helpers ──────────────────────────────────────────────────────
const pct = (a: number, b: number) => (b === 0 ? 0 : Math.round((a / b) * 100));

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; sub?: string; accent: string }> =
  ({ icon, label, value, sub, accent }) => (
    <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-6 overflow-hidden shadow-xl">
      <div className={`absolute inset-0 opacity-10 ${accent}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-4xl font-black text-white">{value}</p>
          {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl ${accent} bg-opacity-20`}>{icon}</div>
      </div>
    </div>
  );

// ─── Component ────────────────────────────────────────────────────
const ReliefOversightAnalytics: React.FC = () => {
  const [needs, setNeeds] = useState<ReliefNeed[]>([]);
  const [pledges, setPledges] = useState<ReliefPledge[]>([]);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([needsApi.getAll(), campsApi.getAll()])
      .then(([n, c]) => { setNeeds(n); setCamps(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Derived stats ──────────────────────────────────────────────
  const totalRequired = needs.reduce((s, n) => s + (n.quantityRequired || 0), 0);
  const totalPledged  = needs.reduce((s, n) => s + (n.quantityPledged || 0), 0);
  const totalReceived = needs.reduce((s, n) => s + (n.quantityReceived || 0), 0);
  const activeNeeds   = needs.filter(n => n.isActive).length;
  const fulfilledNeeds = needs.filter(n => (n.quantityPledged || 0) >= n.quantityRequired).length;

  // Urgency breakdown
  const urgencyData = Object.entries(
    needs.reduce<Record<string, number>>((acc, n) => {
      const k = (n.urgency || 'unknown').toLowerCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  // Category breakdown
  const categoryData = Object.entries(
    needs.reduce<Record<string, { required: number; pledged: number }>>((acc, n) => {
      const k = n.category || 'Other';
      if (!acc[k]) acc[k] = { required: 0, pledged: 0 };
      acc[k].required += n.quantityRequired || 0;
      acc[k].pledged  += n.quantityPledged  || 0;
      return acc;
    }, {})
  ).map(([name, v]) => ({ name, ...v }));

  // Per-camp breakdown
  const campBreakdown = camps.map(c => {
    const campNeeds = needs.filter(n => n.camp?.id === c.id);
    const req = campNeeds.reduce((s, n) => s + (n.quantityRequired || 0), 0);
    const pled = campNeeds.reduce((s, n) => s + (n.quantityPledged || 0), 0);
    return { name: c.campName, district: c.district, needs: campNeeds.length, required: req, pledged: pled, pct: pct(pled, req) };
  }).filter(c => c.needs > 0).sort((a, b) => b.needs - a.needs);

  // Fulfillment gauge
  const fulfillmentRate = pct(totalPledged, totalRequired);
  const radialData = [{ name: 'Fulfillment', value: fulfillmentRate, fill: fulfillmentRate > 70 ? '#10b981' : fulfillmentRate > 40 ? '#f59e0b' : '#ef4444' }];

  // ── PDF Export ─────────────────────────────────────────────────
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
      const pageH = H;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, W, imgH);
        y += pageH;
      }
      pdf.save(`SIDMS_Relief_Oversight_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center gap-3">
            <BarChart2 className="text-indigo-400" size={30} /> Relief Oversight Analytics
          </h2>
          <p className="text-slate-400 mt-1 text-sm">National snapshot of aid needs, pledges and fulfilment across all camps.</p>
        </div>
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold px-5 py-3 rounded-xl shadow-lg transition-all"
        >
          <Download size={18} /> {exporting ? 'Generating PDF…' : 'Download PDF Report'}
        </button>
      </div>

      {/* ── Printable Report Content ─────────────────────────────── */}
      <div ref={reportRef} className="space-y-8 bg-slate-900 rounded-2xl p-6">

        {/* Report header (inside printable area) */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-6">
          <div>
            <h1 className="text-2xl font-black text-white">SIDMS · Relief Oversight Report</h1>
            <p className="text-slate-400 text-sm mt-1">Generated: {new Date().toLocaleString('en-LK', { dateStyle: 'full', timeStyle: 'short' })}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-widest">Confidential</span>
            <p className="text-slate-500 text-xs mt-2">Sri Lanka Integrated Disaster Management System</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={<Tent size={24} className="text-indigo-400" />}    label="Active Camps"       value={camps.length}   sub={`${camps.length} registered`}  accent="bg-indigo-600" />
          <StatCard icon={<AlertTriangle size={24} className="text-red-400" />} label="Active Needs"    value={activeNeeds}    sub={`${fulfilledNeeds} fulfilled`}  accent="bg-red-600" />
          <StatCard icon={<Package size={24} className="text-amber-400" />}  label="Items Required"    value={totalRequired.toLocaleString()} sub="units needed"   accent="bg-amber-600" />
          <StatCard icon={<CheckCircle size={24} className="text-emerald-400" />} label="Items Pledged" value={totalPledged.toLocaleString()} sub={`${pct(totalPledged, totalRequired)}% covered`} accent="bg-emerald-600" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fulfilment gauge */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center justify-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Fulfilment</h3>
            <div className="relative">
              <RadialBarChart width={200} height={200} innerRadius={60} outerRadius={90}
                data={[{ value: 100, fill: '#1e293b' }, radialData[0]]}
                startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={8} background={false} />
              </RadialBarChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{fulfillmentRate}%</span>
                <span className="text-xs text-slate-400">pledged</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center">
              <div><p className="text-slate-400 text-[10px] uppercase">Required</p><p className="font-bold text-slate-200 text-sm">{totalRequired.toLocaleString()}</p></div>
              <div><p className="text-slate-400 text-[10px] uppercase">Pledged</p><p className="font-bold text-emerald-400 text-sm">{totalPledged.toLocaleString()}</p></div>
              <div><p className="text-slate-400 text-[10px] uppercase">Received</p><p className="font-bold text-cyan-400 text-sm">{totalReceived.toLocaleString()}</p></div>
            </div>
          </div>

          {/* Urgency donut */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><PieChartIcon size={16} /> Needs by Urgency</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {urgencyData.map((entry, i) => (
                    <Cell key={i} fill={URGENCY_COLORS[entry.name.toLowerCase()] || PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category bar */}
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><BarChart2 size={16} /> Items by Category</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                <Bar dataKey="required" name="Required" fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="pledged"  name="Pledged"  fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-Camp breakdown table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center gap-2">
            <Tent size={18} className="text-indigo-400" />
            <h3 className="font-bold text-slate-200">Per-Camp Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {['Camp', 'District', 'Active Needs', 'Items Required', 'Items Pledged', 'Fulfilment'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campBreakdown.map((c, i) => (
                  <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3 font-semibold text-slate-200">{c.name}</td>
                    <td className="px-4 py-3 text-slate-400">{c.district}</td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full text-xs font-bold">{c.needs}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{c.required.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{c.pledged.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 min-w-[60px]">
                          <div className={`h-2 rounded-full ${c.pct >= 80 ? 'bg-emerald-500' : c.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${c.pct}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-300 w-8">{c.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {campBreakdown.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-slate-500">No camp data available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Needs detail table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-5 border-b border-slate-700 flex items-center gap-2">
            <Package size={18} className="text-amber-400" />
            <h3 className="font-bold text-slate-200">All Needs Detail</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  {['Item', 'Camp', 'Category', 'Urgency', 'Required', 'Pledged', 'Received', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {needs.map((n, i) => {
                  const isMet = (n.quantityPledged || 0) >= n.quantityRequired;
                  return (
                    <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="px-4 py-3 font-semibold text-slate-200">{n.itemName}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{n.camp?.campName || '—'}</td>
                      <td className="px-4 py-3"><span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">{n.category}</span></td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase"
                          style={{ background: (URGENCY_COLORS[(n.urgency||'').toLowerCase()] || '#475569') + '33', color: URGENCY_COLORS[(n.urgency||'').toLowerCase()] || '#94a3b8' }}>
                          {n.urgency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{n.quantityRequired}</td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">{n.quantityPledged || 0}</td>
                      <td className="px-4 py-3 text-cyan-400">{n.quantityReceived || 0}</td>
                      <td className="px-4 py-3">
                        {isMet
                          ? <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle size={12} />Fulfilled</span>
                          : <span className="flex items-center gap-1 text-amber-400 text-xs font-bold"><Clock size={12} />Pending</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer watermark */}
        <div className="border-t border-slate-700 pt-4 flex items-center justify-between text-slate-600 text-xs">
          <span>SIDMS · Sri Lanka Integrated Disaster Management System</span>
          <span>Report generated on {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ReliefOversightAnalytics;
