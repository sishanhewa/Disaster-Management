import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search,
  MapPin, Clock, CheckCircle2, XCircle,
  Trash2, Edit2, RotateCcw,
  ShieldCheck, Check, Image as ImageIcon,
  RefreshCw, FileText
} from 'lucide-react';
import { adminApi, disastersApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import CreateWarningModal from '../../components/admin/CreateWarningModal';

const AdminDisastersPage: React.FC = () => {
  const PAGE_SIZE = 8;
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'reports' | 'proposed'>('broadcasts');
  
  // Warnings State
  const [warnings, setWarnings] = useState<any[]>([]);
  const [warningSearch, setWarningSearch] = useState('');
  const [warningStatusFilter, setWarningStatusFilter] = useState('ACTIVE');
  const [warningSort, setWarningSort] = useState('createdAt,desc');
  const [warningPage, setWarningPage] = useState(0);
  const [loadingWarnings, setLoadingWarnings] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [editingWarning, setEditingWarning] = useState<any>(null);

  // Reports State
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [reportFilter, setReportFilter] = useState('PENDING'); // PENDING, VERIFIED, REJECTED
  const [reportSearch, setReportSearch] = useState('');
  const [reportSort, setReportSort] = useState('createdAt,desc');
  const [reportPage, setReportPage] = useState(0);
  
  // Proposed State
  const [proposedWarnings, setProposedWarnings] = useState<any[]>([]);
  const [proposedSearch, setProposedSearch] = useState('');
  const [proposedSeverityFilter, setProposedSeverityFilter] = useState('ALL');
  const [proposedSort, setProposedSort] = useState('createdAt,desc');
  const [proposedPage, setProposedPage] = useState(0);
  const [loadingProposed, setLoadingProposed] = useState(false);

  // Action State
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'broadcasts') fetchWarnings();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'proposed') fetchProposed();
  }, [activeTab, reportFilter, reportSort, warningSort]);

  useEffect(() => {
    setWarningPage(0);
  }, [warningSearch, warningStatusFilter, warningSort]);

  useEffect(() => {
    setReportPage(0);
  }, [reportSearch, reportFilter, reportSort]);

  useEffect(() => {
    setProposedPage(0);
  }, [proposedSearch, proposedSeverityFilter, proposedSort]);

  const normalize = (value: unknown) => String(value ?? '').toLowerCase();

  const warningRows = useMemo(() => {
    const searched = warnings.filter((w) => {
      if (warningStatusFilter !== 'ALL' && w.status !== warningStatusFilter) return false;
      if (!warningSearch.trim()) return true;
      const q = warningSearch.trim().toLowerCase();
      return (
        normalize(w.headline).includes(q)
        || normalize(w.bulletinText).includes(q)
        || normalize(w.category).includes(q)
        || normalize(w.areaText).includes(q)
      );
    });

    if (warningSort === 'severity,desc') {
      const rank: Record<string, number> = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4, EXTREME: 5 };
      return [...searched].sort((a, b) => (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0));
    }

    return searched;
  }, [warnings, warningSearch, warningStatusFilter, warningSort]);

  const reportRows = useMemo(() => {
    const q = reportSearch.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => (
      normalize(r.category).includes(q)
      || normalize(r.description).includes(q)
      || normalize(r.spatialUnitName).includes(q)
      || normalize(r.status).includes(q)
      || normalize(r.userId).includes(q)
    ));
  }, [reports, reportSearch]);

  const proposedRows = useMemo(() => {
    const searched = proposedWarnings.filter((w) => {
      if (proposedSeverityFilter !== 'ALL' && w.severity !== proposedSeverityFilter) return false;
      if (!proposedSearch.trim()) return true;
      const q = proposedSearch.trim().toLowerCase();
      return (
        normalize(w.headline).includes(q)
        || normalize(w.bulletinText).includes(q)
        || normalize(w.category).includes(q)
      );
    });

    if (proposedSort === 'severity,desc') {
      const rank: Record<string, number> = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4, EXTREME: 5 };
      return [...searched].sort((a, b) => (rank[b.severity] ?? 0) - (rank[a.severity] ?? 0));
    }
    if (proposedSort === 'createdAt,asc') {
      return [...searched].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return [...searched].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [proposedWarnings, proposedSearch, proposedSeverityFilter, proposedSort]);

  const pagedWarningRows = useMemo(() => warningRows.slice(warningPage * PAGE_SIZE, (warningPage + 1) * PAGE_SIZE), [warningRows, warningPage]);
  const pagedReportRows = useMemo(() => reportRows.slice(reportPage * PAGE_SIZE, (reportPage + 1) * PAGE_SIZE), [reportRows, reportPage]);
  const pagedProposedRows = useMemo(() => proposedRows.slice(proposedPage * PAGE_SIZE, (proposedPage + 1) * PAGE_SIZE), [proposedRows, proposedPage]);

  const warningPages = Math.max(1, Math.ceil(warningRows.length / PAGE_SIZE));
  const reportPages = Math.max(1, Math.ceil(reportRows.length / PAGE_SIZE));
  const proposedPages = Math.max(1, Math.ceil(proposedRows.length / PAGE_SIZE));

  const fetchWarnings = async () => {
    try {
      setLoadingWarnings(true);
      const data = await adminApi.getAllWarnings({ size: 200, sort: warningSort });
      setWarnings(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      toast.error('Failed to load warnings');
    } finally {
      setLoadingWarnings(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoadingReports(true);
      const data = await adminApi.getAllReports({ status: reportFilter, size: 200, sort: reportSort });
      setReports(data.content || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchProposed = async () => {
    try {
      setLoadingProposed(true);
      const data = await disastersApi.getProposedWarnings({ size: 200 });
      setProposedWarnings(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      toast.error('Failed to load proposed warnings');
    } finally {
      setLoadingProposed(false);
    }
  };

  // --- Broadcast Actions ---
  const resolveWarning = async (id: string) => {
    if (!confirm('Mark this warning as resolved? It will be removed from active status.')) return;
    try {
      await adminApi.resolveWarning(id);
      toast.success('Warning resolved');
      fetchWarnings();
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        toast.error('Warning no longer exists on backend. Refreshing list.');
      } else {
        toast.error('Failed to resolve warning');
      }
      fetchWarnings();
    }
  };

  const deleteWarning = async (id: string) => {
    if (!confirm('Hard delete this warning from history? This action is IRREVERSIBLE.')) return;
    try {
      await adminApi.hardDeleteWarning(id);
      toast.success('Warning permanently deleted');
      fetchWarnings();
    } catch (error) {
      if ((error as any)?.response?.status === 404) {
        toast.error('Warning no longer exists on backend. Refreshing list.');
      } else {
        toast.error('Failed to delete warning');
      }
      fetchWarnings();
    }
  };

  // --- Proposed Actions ---
  const approveProposed = async (id: string) => {
    try {
      await disastersApi.approveProposedWarning(id);
      toast.success('Proposed warning approved');
      fetchProposed();
      if (activeTab === 'broadcasts') fetchWarnings();
    } catch (error) {
      toast.error('Failed to approve warning');
    }
  };

  const rejectProposed = async (id: string) => {
    const reason = prompt('Reason for rejection:');
    if (reason === null) return;
    const normalizedReason = reason.trim();
    if (normalizedReason.length < 5) {
      toast.error('Please provide a rejection reason with at least 5 characters');
      return;
    }
    if (normalizedReason.length > 500) {
      toast.error('Rejection reason must be at most 500 characters');
      return;
    }
    try {
      await disastersApi.rejectProposedWarning(id, normalizedReason);
      toast.success('Proposed warning rejected');
      fetchProposed();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to reject warning'));
    }
  };

  // --- Report Actions ---
  const updateReportStatus = async (id: string, status: string) => {
    if (!status || status.length > 50) {
      toast.error('Status is invalid');
      return;
    }

    const reason = status === 'REJECTED' ? prompt('Reason for rejection:') : null;
    if (status === 'REJECTED' && reason === null) return;

    if (status === 'REJECTED') {
      const normalizedReason = (reason || '').trim();
      if (normalizedReason.length < 5) {
        toast.error('Please provide a rejection reason with at least 5 characters');
        return;
      }
      if (normalizedReason.length > 500) {
        toast.error('Rejection reason must be at most 500 characters');
        return;
      }
    }

    try {
      setActionLoading(id);
      await adminApi.updateReportStatus(id, { status, rejectionReason: reason || null });
      toast.success(`Report ${status.toLowerCase()} successfully`);
      fetchReports();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to update report status'));
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Permanently delete this report and its confirmations/photos? This cannot be undone.')) return;
    try {
      setActionLoading(id);
      await adminApi.deleteReport(id);
      toast.success('Report deleted successfully');
      fetchReports();
      fetchProposed();
    } catch (error) {
      toast.error('Failed to delete report');
    } finally {
      setActionLoading(null);
    }
  };

  const openEditWarning = async (warningId: string) => {
    try {
      setActionLoading(warningId);
      const warning = await disastersApi.getWarning(warningId);
      setEditingWarning(warning);
      setIsWarningModalOpen(true);
    } catch (error) {
      toast.error('Failed to load warning details for editing');
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityColor = (sev: string): "extreme" | "critical" | "warning" | "info" | "success" | "neutral" | "active" => {
    switch (sev) {
      case 'EXTREME': return 'extreme';
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'warning';
      case 'MODERATE': return 'warning';
      default: return 'info';
    }
  };

  return (
    <>
      <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500">
              Disasters & Community
            </h1>
            <p className="text-slate-400 mt-1 font-medium">Manage official warnings and moderate community-reported incidents.</p>
          </div>
          {activeTab === 'broadcasts' && (
            <Button variant="primary" icon={<Plus size={18} />} onClick={() => { setEditingWarning(null); setIsWarningModalOpen(true); }}>
              Create Warning
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'broadcasts'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Official Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'reports'
              ? 'border-sky-500 text-sky-500'
              : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Community Moderation Queue
            {/* Could add badge for pending count here */}
          </button>
          <button
            onClick={() => setActiveTab('proposed')}
            className={`px-4 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'proposed'
              ? 'border-purple-500 text-purple-500'
              : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Proposed Warnings
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'broadcasts' && (
          <div className="space-y-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    value={warningSearch}
                    onChange={(e) => setWarningSearch(e.target.value)}
                    placeholder="Search warnings"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={warningStatusFilter}
                    onChange={(e) => setWarningStatusFilter(e.target.value)}
                    className="border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {['ALL', 'ACTIVE', 'RESOLVED', 'REJECTED', 'PROPOSED'].map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <select
                    value={warningSort}
                    onChange={(e) => setWarningSort(e.target.value)}
                    className="border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="createdAt,desc">Newest</option>
                    <option value="createdAt,asc">Oldest</option>
                    <option value="severity,desc">Severity</option>
                  </select>
                </div>
              </div>
            </Card>

            {loadingWarnings ? (
              <div className="py-20 flex justify-center"><RotateCcw className="animate-spin text-amber-500" size={32} /></div>
            ) : warningRows.length === 0 ? (
              <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 text-slate-500">
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">No warnings found for the current search and filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pagedWarningRows.map((w) => (
                  <Card key={w.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group">
                    <div className="flex flex-col lg:flex-row">
                      <div className={`w-2 lg:w-3 shrink-0 ${w.severity === 'EXTREME' ? 'bg-purple-600' :
                        w.severity === 'CRITICAL' ? 'bg-red-500' :
                        w.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'}`} />
                      
                      <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="neutral">{w.category}</Badge>
                            <Badge variant={getSeverityColor(w.severity)}>{w.severity}</Badge>
                            <span className="text-slate-500 text-xs flex items-center gap-1 ml-auto lg:ml-0">
                              <Clock size={12} /> {format(new Date(w.createdAt), 'MMM d, HH:mm')}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white">{w.headline}</h3>
                          <p className="text-sm text-slate-400 line-clamp-2 italic">"{w.bulletinText}"</p>
                          
                          <div className="flex flex-wrap gap-2 pt-2">
                            {w.targetedUnits?.slice(0, 5).map((unit: any) => (
                              <span key={unit.pcode} className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-slate-400 flex items-center gap-1">
                                <MapPin size={8} /> {unit.name}
                              </span>
                            ))}
                            {w.targetedUnits?.length > 5 && (
                              <span className="text-[10px] text-slate-500 font-bold">+{w.targetedUnits.length - 5} more</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" size="sm" icon={<Edit2 size={16} />}
                              loading={actionLoading === w.id}
                              onClick={() => openEditWarning(w.id)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="primary" size="sm" icon={<CheckCircle2 size={16} />}
                              onClick={() => resolveWarning(w.id)}
                            >
                              Resolve
                            </Button>
                            <Button 
                              variant="danger" size="sm" icon={<Trash2 size={16} />}
                              onClick={() => deleteWarning(w.id)} className="text-rose-500"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {warningRows.length > PAGE_SIZE && (
              <div className="flex justify-center gap-2">
                <Button variant="secondary" size="sm" disabled={warningPage === 0} onClick={() => setWarningPage((p) => Math.max(0, p - 1))}>Prev</Button>
                <span className="px-3 py-2 text-xs text-slate-400">Page {warningPage + 1} of {warningPages}</span>
                <Button variant="secondary" size="sm" disabled={warningPage >= warningPages - 1} onClick={() => setWarningPage((p) => Math.min(warningPages - 1, p + 1))}>Next</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700 w-max">
                  {['PENDING', 'VERIFIED', 'REJECTED', 'ARCHIVED'].map(f => (
                    <button
                      key={f}
                      onClick={() => setReportFilter(f)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        reportFilter === f ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      placeholder="Search reports"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                    />
                  </div>
                  <select
                    value={reportSort}
                    onChange={(e) => setReportSort(e.target.value)}
                    className="border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="createdAt,desc">Newest</option>
                    <option value="createdAt,asc">Oldest</option>
                  </select>
                </div>
              </div>
            </Card>

            {loadingReports ? (
              <div className="py-20 flex justify-center"><RefreshCw className="animate-spin text-sky-500" size={32} /></div>
            ) : reportRows.length === 0 ? (
              <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 text-slate-500">
                <FileText size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">No reports found for this status.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pagedReportRows.map((report) => (
                  <Card key={report.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group">
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="w-full lg:w-48 xl:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col shrink-0">
                        {report.photoUrls && report.photoUrls.length > 0 ? (
                          <div className="grid grid-cols-1 gap-1 flex-1">
                            <div className="relative aspect-square lg:aspect-auto h-full">
                              <img src={report.photoUrls[0]} alt="Report" className="w-full h-full object-cover" />
                              {report.photoUrls.length > 1 && (
                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold border border-white/20">
                                  +{report.photoUrls.length - 1} photos
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 min-h-[120px] flex flex-col items-center justify-center text-slate-600 space-y-2">
                            <ImageIcon size={32} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No Evidence</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-6 flex flex-col lg:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={getSeverityColor(report.severityAssessment)}>{report.severityAssessment}</Badge>
                            <Badge variant="neutral">{report.category}</Badge>
                            <span className="text-slate-500 text-xs flex items-center gap-1">
                              <Clock size={12} /> {format(new Date(report.createdAt), 'MMM d, HH:mm')}
                            </span>
                            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                              <Check size={12} /> {report.confirmCount ?? 0} Confirmations
                            </span>
                            <span className="text-rose-400 text-xs font-bold">{report.denyCount ?? 0} Denials</span>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-bold text-white text-lg flex items-center gap-2">
                              {report.category} Incident
                              <span className="text-xs font-normal text-slate-500 font-mono">#{report.id.substring(0, 8)}</span>
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed italic">
                              "{report.description || 'No description provided.'}"
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                            <MapPin size={14} className="text-emerald-500" />
                            {typeof report.lat === 'number' && typeof report.lng === 'number'
                              ? `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`
                              : 'Location unavailable'}
                          </div>
                        </div>

                        <div className="w-full lg:w-48 flex flex-col justify-between shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/50 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reporter</p>
                            <p className="text-sm text-white font-medium truncate">{report.userId ? `User ${String(report.userId).substring(0, 8)}` : 'Unknown'}</p>
                          </div>

                          {reportFilter === 'PENDING' ? (
                            <div className="space-y-2">
                              <Button 
                                className="w-full" variant="primary" size="sm" icon={<CheckCircle2 size={16} />}
                                loading={actionLoading === report.id} onClick={() => updateReportStatus(report.id, 'VERIFIED')}
                              >
                                Verify (Publish)
                              </Button>
                              <Button 
                                className="w-full text-rose-400" variant="secondary" size="sm" icon={<XCircle size={16} />}
                                loading={actionLoading === report.id} onClick={() => updateReportStatus(report.id, 'REJECTED')}
                              >
                                Reject
                              </Button>
                              <Button
                                className="w-full text-rose-500" variant="secondary" size="sm" icon={<Trash2 size={16} />}
                                loading={actionLoading === report.id} onClick={() => deleteReport(report.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Badge variant={reportFilter === 'VERIFIED' ? 'active' : 'critical'} className="w-full justify-center py-2">
                                {reportFilter}
                              </Badge>
                              <Button
                                className="w-full text-rose-500" variant="secondary" size="sm" icon={<Trash2 size={16} />}
                                loading={actionLoading === report.id} onClick={() => deleteReport(report.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {reportRows.length > PAGE_SIZE && (
              <div className="flex justify-center gap-2">
                <Button variant="secondary" size="sm" disabled={reportPage === 0} onClick={() => setReportPage((p) => Math.max(0, p - 1))}>Prev</Button>
                <span className="px-3 py-2 text-xs text-slate-400">Page {reportPage + 1} of {reportPages}</span>
                <Button variant="secondary" size="sm" disabled={reportPage >= reportPages - 1} onClick={() => setReportPage((p) => Math.min(reportPages - 1, p + 1))}>Next</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'proposed' && (
          <div className="space-y-4">
            <Card className="p-4 bg-slate-800/50 border-slate-700">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    value={proposedSearch}
                    onChange={(e) => setProposedSearch(e.target.value)}
                    placeholder="Search proposed warnings"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={proposedSeverityFilter}
                    onChange={(e) => setProposedSeverityFilter(e.target.value)}
                    className="border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EXTREME'].map((severity) => (
                      <option key={severity} value={severity}>{severity}</option>
                    ))}
                  </select>
                  <select
                    value={proposedSort}
                    onChange={(e) => setProposedSort(e.target.value)}
                    className="border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="createdAt,desc">Newest</option>
                    <option value="createdAt,asc">Oldest</option>
                    <option value="severity,desc">Severity</option>
                  </select>
                </div>
              </div>
            </Card>

            {loadingProposed ? (
              <div className="py-20 flex justify-center"><RefreshCw className="animate-spin text-purple-500" size={32} /></div>
            ) : proposedRows.length === 0 ? (
              <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 text-slate-500">
                <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-lg">No proposed warnings awaiting review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pagedProposedRows.map((w) => (
                  <Card key={w.id} className="bg-slate-800/50 border-purple-500/30 overflow-hidden shadow-lg shadow-purple-900/20">
                    <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="info">PROPOSED SYSTEM ALERT</Badge>
                          <Badge variant={getSeverityColor(w.severity)}>{w.severity}</Badge>
                          <span className="text-slate-500 text-xs flex items-center gap-1 ml-auto lg:ml-0">
                            <Clock size={12} /> {format(new Date(w.createdAt), 'MMM d, HH:mm')}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white">{w.headline}</h3>
                        <p className="text-sm text-slate-400 line-clamp-2 italic">"{w.bulletinText}"</p>
                      </div>

                      <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost" size="sm" icon={<Edit2 size={16} />}
                            loading={actionLoading === w.id}
                            onClick={() => openEditWarning(w.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="primary" size="sm" icon={<CheckCircle2 size={16} />}
                            onClick={() => approveProposed(w.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="danger" size="sm" icon={<XCircle size={16} />}
                            onClick={() => rejectProposed(w.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="danger" size="sm" icon={<Trash2 size={16} />}
                            onClick={() => deleteWarning(w.id)}
                            className="text-rose-500"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {proposedRows.length > PAGE_SIZE && (
              <div className="flex justify-center gap-2">
                <Button variant="secondary" size="sm" disabled={proposedPage === 0} onClick={() => setProposedPage((p) => Math.max(0, p - 1))}>Prev</Button>
                <span className="px-3 py-2 text-xs text-slate-400">Page {proposedPage + 1} of {proposedPages}</span>
                <Button variant="secondary" size="sm" disabled={proposedPage >= proposedPages - 1} onClick={() => setProposedPage((p) => Math.min(proposedPages - 1, p + 1))}>Next</Button>
              </div>
            )}
          </div>
        )}

      </div>

      <CreateWarningModal 
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onSuccess={() => {
            fetchWarnings();
            fetchProposed();
        }}
        initialData={editingWarning}
      />
    </>
  );
};

export default AdminDisastersPage;
