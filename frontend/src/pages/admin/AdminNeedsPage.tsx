import React, { useState, useEffect } from 'react';
import {
  AlertCircle, CheckCircle2, Gift, RefreshCw,
  ToggleLeft, ToggleRight, ChevronDown, BarChart2,
} from 'lucide-react';
import { needsApi, pledgesApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ReliefOversightAnalytics from '../relief/ReliefOversightAnalytics';

/* ── Colour maps ────────────────────────────────────────────── */
const URGENCY_STYLE: Record<string, string> = {
  HIGH:   'text-rose-400 bg-rose-500/10 border border-rose-500/30',
  MEDIUM: 'text-amber-400 bg-amber-500/10 border border-amber-500/30',
  LOW:    'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30',
};

const PLEDGE_BADGE: Record<string, string> = {
  PENDING:   'amber',
  CONFIRMED: 'sky',
  DELIVERED: 'success',
};

const AdminNeedsPage: React.FC = () => {
  const [tab, setTab] = useState<'needs' | 'pledges' | 'analytics'>('needs');
  const [needs, setNeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  /* pledge drill-down */
  const [openNeedId, setOpenNeedId] = useState<string | null>(null);
  const [pledges, setPledges] = useState<any[]>([]);
  const [pledgesLoading, setPledgesLoading] = useState(false);
  const [pledgeActionLoading, setPledgeActionLoading] = useState<string | null>(null);

  useEffect(() => { fetchNeeds(); }, []);

  /* ── Data fetchers ────────────────────────────────────────── */
  const fetchNeeds = async () => {
    try {
      setLoading(true);
      const data = await needsApi.getAll();
      setNeeds(data);
    } catch {
      toast.error('Failed to load aid requests');
    } finally {
      setLoading(false);
    }
  };

  const toggleNeed = async (id: string, isActive: boolean) => {
    try {
      setToggleLoading(id);
      await needsApi.updateStatus(id, !isActive);
      setNeeds(prev => prev.map(n => n.id === id ? { ...n, isActive: !isActive } : n));
      toast.success(`Need marked as ${!isActive ? 'active' : 'fulfilled'}`);
    } catch {
      toast.error('Failed to update need status');
    } finally {
      setToggleLoading(null);
    }
  };

  const expandNeed = async (needId: string) => {
    if (openNeedId === needId) { setOpenNeedId(null); setPledges([]); return; }
    setOpenNeedId(needId);
    setPledgesLoading(true);
    try {
      const data = await pledgesApi.getByNeed(needId);
      setPledges(data);
    } catch {
      toast.error('Failed to load pledges');
    } finally {
      setPledgesLoading(false);
    }
  };

  const updatePledge = async (pledgeId: string, status: string) => {
    try {
      setPledgeActionLoading(pledgeId);
      await pledgesApi.updateStatus(pledgeId, status);
      setPledges(prev => prev.map(p => p.id === pledgeId ? { ...p, status } : p));
      toast.success('Pledge status updated');
    } catch {
      toast.error('Failed to update pledge');
    } finally {
      setPledgeActionLoading(null);
    }
  };

  /* ── Derived counts ───────────────────────────────────────── */
  const activeCount    = needs.filter(n => n.isActive).length;
  const fulfilledCount = needs.filter(n => !n.isActive).length;

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Needs &amp; Pledges Oversight
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Monitor aid requests across all camps and manage donation pledges.
          </p>
        </div>
        <Button variant="ghost" icon={<RefreshCw size={16} />} onClick={fetchNeeds}>
          Refresh
        </Button>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-800/50 border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400"><AlertCircle size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Active Requests</p>
            <p className="text-2xl font-black text-white">{activeCount}</p>
          </div>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Fulfilled</p>
            <p className="text-2xl font-black text-white">{fulfilledCount}</p>
          </div>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400"><Gift size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Requests</p>
            <p className="text-2xl font-black text-white">{needs.length}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700 w-fit">
        {(['needs', 'pledges', 'analytics'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === t
                ? t === 'analytics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t === 'analytics' && <BarChart2 size={14} />}
            {t === 'needs' ? 'Aid Requests' : t === 'pledges' ? 'Pledge Drill-Down' : 'Analytics & PDF'}
          </button>
        ))}
      </div>

      {/* ── Aid Requests Tab ──────────────────────────────────── */}
      {tab === 'needs' && (
        <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 font-bold border-b border-slate-700">
                  <th className="px-6 py-4">Item / Camp</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Urgency</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Posted</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <RefreshCw className="animate-spin inline-block mr-2 text-violet-500" />
                      <span className="text-slate-500">Loading aid requests…</span>
                    </td>
                  </tr>
                ) : needs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">
                      No aid requests found across any camp.
                    </td>
                  </tr>
                ) : (
                  needs.map(need => (
                    <tr
                      key={need.id}
                      className={`hover:bg-slate-800/30 transition-colors ${!need.isActive ? 'opacity-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-200">{need.itemName}</p>
                        <p className="text-xs text-slate-500">{need.camp?.campName || '—'}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300">{need.quantity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${URGENCY_STYLE[need.urgencyLevel] ?? URGENCY_STYLE.LOW}`}>
                          {need.urgencyLevel ?? 'LOW'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={need.isActive ? 'active' : 'neutral'} size="sm">
                          {need.isActive ? 'Active' : 'Fulfilled'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {need.createdAt
                          ? formatDistanceToNow(new Date(need.createdAt), { addSuffix: true })
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          size="sm" variant="ghost"
                          loading={toggleLoading === need.id}
                          onClick={() => toggleNeed(need.id, need.isActive)}
                          icon={
                            need.isActive
                              ? <ToggleRight size={14} className="text-emerald-400" />
                              : <ToggleLeft size={14} />
                          }
                          className={need.isActive ? 'text-emerald-400' : 'text-slate-400'}
                        >
                          {need.isActive ? 'Fulfil' : 'Reopen'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Pledge Drill-Down Tab ─────────────────────────────── */}
      {tab === 'pledges' && (
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <RefreshCw className="animate-spin inline-block mr-2" size={16} /> Loading…
            </div>
          ) : needs.length === 0 ? (
            <p className="text-slate-500 text-center py-20">No needs found.</p>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                Click a need to expand and view or update its pledges.
              </p>
              {needs.map(need => (
                <Card key={need.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                  {/* Accordion header */}
                  <button
                    onClick={() => expandNeed(need.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${need.isActive ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                      <span className="font-bold text-slate-200">{need.itemName}</span>
                      <span className="text-slate-500 text-xs">— {need.camp?.campName ?? '?'}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${URGENCY_STYLE[need.urgencyLevel] ?? URGENCY_STYLE.LOW}`}>
                        {need.urgencyLevel ?? 'LOW'}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-slate-500 transition-transform duration-200 ${openNeedId === need.id ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Accordion body */}
                  {openNeedId === need.id && (
                    <div className="border-t border-slate-700">
                      {pledgesLoading ? (
                        <p className="p-6 text-center text-slate-500 text-sm">
                          <RefreshCw className="animate-spin inline-block mr-2" size={14} /> Loading pledges…
                        </p>
                      ) : pledges.length === 0 ? (
                        <p className="p-6 text-center text-slate-600 text-sm italic">
                          No pledges for this need yet.
                        </p>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-slate-500 text-xs border-b border-slate-700/50 bg-slate-900/30">
                              <th className="px-6 py-3 text-left">Donor</th>
                              <th className="px-6 py-3 text-left">Qty</th>
                              <th className="px-6 py-3 text-left">Status</th>
                              <th className="px-6 py-3 text-left">Advance Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/30">
                            {pledges.map(pledge => (
                              <tr key={pledge.id} className="hover:bg-slate-800/20">
                                <td className="px-6 py-3">
                                  <p className="text-slate-200 font-semibold">
                                    {pledge.donor?.displayName || pledge.donor?.email || 'Anonymous'}
                                  </p>
                                  {pledge.donor?.email && pledge.donor?.displayName && (
                                    <p className="text-slate-500 text-xs">{pledge.donor.email}</p>
                                  )}
                                </td>
                                <td className="px-6 py-3 font-mono text-slate-300">{pledge.quantity}</td>
                                <td className="px-6 py-3">
                                  <Badge variant={PLEDGE_BADGE[pledge.status] as any ?? 'neutral'} size="sm">
                                    {pledge.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-3">
                                  <select
                                    value={pledge.status}
                                    onChange={e => updatePledge(pledge.id, e.target.value)}
                                    disabled={pledgeActionLoading === pledge.id}
                                    className="bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50"
                                  >
                                    <option value="PENDING">Pending</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="DELIVERED">Delivered</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Analytics Tab ─────────────────────────────────────── */}
      {tab === 'analytics' && (
        <div className="mt-2">
          <ReliefOversightAnalytics />
        </div>
      )}
    </div>
  );
};

export default AdminNeedsPage;
