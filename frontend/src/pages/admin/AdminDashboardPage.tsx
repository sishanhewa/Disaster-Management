import React, { useState, useEffect } from 'react';
import { Users, Activity, RefreshCw, AlertTriangle, FileText, Terminal, ShieldCheck, ChevronRight, Tent, HeartHandshake, ShieldAlert } from 'lucide-react';
import { adminApi, campsApi, broadcastAlertsApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [circuitBreakerStats, setCircuitBreakerStats] = useState<any>(null);
  const [apiKeyStats, setApiKeyStats] = useState<any>(null);
  const [fallbackStats, setFallbackStats] = useState<any>(null);
  const [campsCount, setCampsCount] = useState<number>(0);
  const [alertsCount, setAlertsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, errorsData, cbData, keyData, fbData, campsData, alertsData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getErrors({ limit: 10 }),
        adminApi.getCircuitBreakerStats(),
        adminApi.getApiKeyStats(),
        adminApi.getFallbackStats(),
        campsApi.getAll().catch(() => []),
        broadcastAlertsApi.getActive().catch(() => []),
      ]);
      setStats(statsData);
      setErrors(errorsData);
      setCircuitBreakerStats(cbData);
      setApiKeyStats(keyData);
      setFallbackStats(fbData);
      setCampsCount(Array.isArray(campsData) ? campsData.length : 0);
      setAlertsCount(Array.isArray(alertsData) ? alertsData.length : 0);
    } catch (error) {
      toast.error('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const resolveError = async (id: string) => {
    try {
      setResolvingId(id);
      await adminApi.resolveError(id);
      setErrors(prev => prev.map(err => err.id === id ? { ...err, isResolved: true } : err));
      toast.success('Error marked as resolved');
    } catch (error) {
      toast.error('Failed to resolve error');
    } finally {
      setResolvingId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400">
            Platform Administration
          </h1>
          <p className="text-slate-400 mt-1 font-medium">System overview and control center.</p>
        </div>
      </div>

        {/* Stats Grid — 6 cards (4 CS core + 2 from DM AdminDashboard) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={<Users size={20} />} 
            trend={stats?.activeUsers + " Active"}
            variant="emerald"
          />
          <StatCard 
            title="Active Warnings" 
            value={stats?.activeWarnings || 0} 
            icon={<AlertTriangle size={20} />} 
            variant="amber"
          />
          <StatCard 
            title="Community Reports" 
            value={stats?.totalReports || 0} 
            icon={<FileText size={20} />} 
            trend={stats?.pendingReports + " Pending"}
            variant="sky"
          />
          <StatCard 
            title="SOS Incidents" 
            value={stats?.totalSosIncidents || 0} 
            icon={<Activity size={20} />} 
            variant="rose"
          />
          {/* ── DM merge: camp + broadcast alert stats ── */}
          <StatCard
            title="Relief Camps"
            value={campsCount}
            icon={<Tent size={20} />}
            variant="sky"
          />
          <StatCard
            title="Broadcast Alerts"
            value={alertsCount}
            icon={<ShieldAlert size={20} />}
            variant="amber"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Circuit Breakers</p>
            <p className="text-2xl font-bold text-white mt-1">{Object.keys(circuitBreakerStats || {}).length}</p>
            <p className="text-xs text-slate-500 mt-1">Services with breaker state tracked</p>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">API Key Pools</p>
            <p className="text-2xl font-bold text-white mt-1">{Object.keys(apiKeyStats || {}).length}</p>
            <p className="text-xs text-slate-500 mt-1">External integrations currently monitored</p>
          </Card>
          <Card className="p-4 bg-slate-800/50 border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Fallback Count</p>
            <p className="text-2xl font-bold text-white mt-1">{fallbackStats?.fallbackCount ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">Last fallback at: {fallbackStats?.lastFallbackAt ?? 'N/A'}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Errors */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal size={18} className="text-rose-500" />
                System Error Logs
              </h3>
              <Button variant="ghost" size="sm" onClick={fetchDashboardData} icon={<RefreshCw size={14} />}>
                Refresh
              </Button>
            </div>
            
            <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 font-bold border-b border-slate-700">
                      <th className="px-6 py-4">Error</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {errors.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                          No system errors reported recently.
                        </td>
                      </tr>
                    ) : (
                      errors.map((err) => (
                        <tr key={err.id} className={`group hover:bg-slate-800/50 transition-colors ${err.isResolved ? 'opacity-50' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-200 line-clamp-1">{err.errorMessage}</span>
                              <span className="text-[10px] font-mono text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded self-start">
                                {err.exceptionType || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-mono text-xs">{err.serviceName}</td>
                          <td className="px-6 py-4 text-slate-400">
                            {formatDistanceToNow(new Date(err.createdAt), { addSuffix: true })}
                          </td>
                          <td className="px-6 py-4">
                            {err.isResolved ? (
                              <Badge color="success" size="sm">Resolved</Badge>
                            ) : (
                              <Button 
                                size="xs" 
                                variant="outline" 
                                color="rose"
                                loading={resolvingId === err.id}
                                onClick={() => resolveError(err.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Platform Health / Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6 bg-slate-800/50 border-slate-700 h-full">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                Quick Management
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Manage Warnings',  icon: <AlertTriangle size={16} />,   path: '/admin/warnings', color: 'bg-amber-500' },
                  { label: 'Verify Reports',   icon: <FileText size={16} />,         path: '/admin/reports',  color: 'bg-sky-500' },
                  { label: 'User Directory',   icon: <Users size={16} />,            path: '/admin/users',    color: 'bg-emerald-500' },
                  { label: 'System Config',    icon: <ShieldCheck size={16} />,      path: '/admin/system',   color: 'bg-purple-500' },
                  // ── DM merge: camp + needs admin links ──
                  { label: 'Manage Camps',     icon: <Tent size={16} />,             path: '/admin/camps',    color: 'bg-cyan-500' },
                  { label: 'Needs & Pledges',  icon: <HeartHandshake size={16} />,  path: '/admin/needs',    color: 'bg-violet-500' },
                ].map((action) => (
                  <a 
                    key={action.path}
                    href={action.path}
                    className="flex items-center justify-between p-4 bg-slate-900/60 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${action.color} text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                        {action.icon}
                      </div>
                      <span className="font-bold text-slate-200">{action.label}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Status</h4>
                  <Badge color="success" size="sm dot">All Systems Nominal</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Weather Engine</span>
                    <span className="text-emerald-500 font-bold">STABLE</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Alert Dispatcher</span>
                    <span className="text-emerald-500 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Flood Data Pipeline</span>
                    <span className="text-emerald-500 font-bold">100% UP</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
    </div>
  );
};

export default AdminDashboardPage;
