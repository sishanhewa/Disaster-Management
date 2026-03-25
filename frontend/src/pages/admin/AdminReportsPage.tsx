import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, CheckCircle2, 
  XCircle, Clock, Eye, MapPin, AlertCircle, 
  CheckSquare, Image as ImageIcon, MessageSquare, RefreshCw, Trash2
} from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const AdminReportsPage: React.FC = () => {
  const PAGE_SIZE = 8;
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, VERIFIED, REJECTED, ARCHIVED
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity'>('newest');
  const [page, setPage] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
  }, [filter, sortBy]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filter, sortBy]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllReports({
        status: filter,
        size: 200,
        sort: sortBy === 'oldest' ? 'createdAt,asc' : 'createdAt,desc',
        q: searchTerm.trim() || undefined,
      });
      setReports(data.content || []);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!status || status.length > 50) {
      toast.error('Status is invalid');
      return;
    }

    const reason = status === 'REJECTED' ? prompt('Reason for rejection (min 5 chars):') : null;
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
      await adminApi.updateReportStatus(id, { status, rejectionReason: reason?.trim() || null });
      toast.success(`Report ${status.toLowerCase()} successfully`);
      fetchReports();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to update report status'));
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('Delete this report permanently? This cannot be undone.')) return;
    try {
      setActionLoading(id);
      await adminApi.deleteReport(id);
      toast.success('Report deleted');
      fetchReports();
    } catch {
      toast.error('Failed to delete report');
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityColor = (sev: string): "extreme" | "critical" | "warning" | "info" => {
    switch (sev) {
      case 'EXTREME': return 'extreme';
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'warning';
      case 'MODERATE': return 'warning';
      default: return 'info';
    }
  };

  const severityRank: Record<string, number> = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4, EXTREME: 5 };

  const visibleReports = reports
    .filter((report) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        String(report.category || '').toLowerCase().includes(q) ||
        String(report.description || '').toLowerCase().includes(q) ||
        String(report.spatialUnitName || '').toLowerCase().includes(q) ||
        String(report.status || '').toLowerCase().includes(q) ||
        String(report.userId || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'severity') {
        return (severityRank[b.severityAssessment] || 0) - (severityRank[a.severityAssessment] || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(visibleReports.length / PAGE_SIZE));
  const pagedReports = visibleReports.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
            Incident Reports
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Review and verify community-submitted reports.</p>
        </div>
      </div>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
              {['PENDING', 'VERIFIED', 'REJECTED', 'ARCHIVED'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filter === f ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search reports"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'severity')}
                className="border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="severity">Severity</option>
              </select>
              <Button icon={<RefreshCw size={18} />} variant="ghost" onClick={fetchReports}>Refresh</Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="py-20 flex justify-center">
            <RefreshCw className="animate-spin text-sky-500" size={32} />
          </div>
        ) : visibleReports.length === 0 ? (
          <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 text-slate-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No reports found for this status.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pagedReports.map((report) => (
              <Card key={report.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group">
                <div className="flex flex-col lg:flex-row h-full">
                  {/* Photo Section (Sidebar on larger screens) */}
                  <div className="w-full lg:w-48 xl:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col shrink-0">
                    {report.photoUrls && report.photoUrls.length > 0 ? (
                      <div className="grid grid-cols-1 gap-1 flex-1">
                        <div className="relative aspect-square lg:aspect-auto h-full">
                          <img 
                            src={report.photoUrls[0]} 
                            alt="Report" 
                            className="w-full h-full object-cover"
                          />
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
                        <Badge variant={getSeverityColor(report.severityAssessment)}>
                          {report.severityAssessment}
                        </Badge>
                        <Badge variant="neutral">{report.category}</Badge>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock size={12} /> {format(new Date(report.createdAt), 'MMM d, HH:mm')}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <CheckSquare size={12} className="text-emerald-500" /> {report.confirmCount ?? 0} Confirm
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <XCircle size={12} className="text-rose-500" /> {report.denyCount ?? 0} Deny
                        </span>
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

                      <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                        <MapPin size={14} className="text-emerald-500" />
                        <span>
                          {typeof report.lat === 'number' && typeof report.lng === 'number'
                            ? `Located at ${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}`
                            : 'Location unavailable'}
                        </span>
                        <button className="text-sky-500 hover:underline ml-auto font-bold">View on Map</button>
                      </div>
                    </div>

                    <div className="w-full lg:w-48 flex flex-col justify-between shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/50 pt-4 lg:pt-0 lg:pl-6 space-y-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reporter</p>
                        <p className="text-sm text-white font-medium truncate">{report.reporterName || 'Anonymous'}</p>
                      </div>

                      {filter === 'PENDING' ? (
                        <div className="space-y-2">
                          <Button 
                            className="w-full" 
                            variant="primary" 
                            size="sm"
                            icon={<CheckCircle2 size={16} />}
                            loading={actionLoading === report.id}
                            onClick={() => updateStatus(report.id, 'VERIFIED')}
                          >
                            Verify
                          </Button>
                          <Button 
                            className="w-full" 
                            variant="secondary" 
                            size="sm"
                            icon={<XCircle size={16} />}
                            loading={actionLoading === report.id}
                            onClick={() => updateStatus(report.id, 'REJECTED')}
                          >
                            Reject
                          </Button>
                          <Button
                            className="w-full text-rose-500"
                            variant="secondary"
                            size="sm"
                            icon={<Trash2 size={16} />}
                            loading={actionLoading === report.id}
                            onClick={() => deleteReport(report.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Badge variant={filter === 'VERIFIED' ? 'active' : 'critical'} className="w-full justify-center py-2">
                            {filter}
                          </Badge>
                          <p className="text-[10px] text-slate-500 text-center">Status updated by Admin</p>
                          <Button
                            className="w-full text-rose-500"
                            variant="secondary"
                            size="sm"
                            icon={<Trash2 size={16} />}
                            loading={actionLoading === report.id}
                            onClick={() => deleteReport(report.id)}
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

        {visibleReports.length > PAGE_SIZE && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Prev
            </Button>
            <span className="text-xs text-slate-500 px-2">Page {page + 1} of {totalPages}</span>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminReportsPage;
