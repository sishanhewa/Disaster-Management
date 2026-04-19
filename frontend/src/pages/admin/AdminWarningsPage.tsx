import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Plus, Search,
  MapPin, Clock, CheckCircle2, XCircle, 
  Trash2, Edit2, RotateCcw
} from 'lucide-react';
import { adminApi, disastersApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import CreateWarningModal from '../../components/admin/CreateWarningModal';

const AdminWarningsPage: React.FC = () => {
  const PAGE_SIZE = 8;
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, EXPIRED, PROPOSED
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity'>('newest');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarning, setEditingWarning] = useState<any>(null);

  useEffect(() => {
    fetchWarnings();
  }, [filter, sortBy]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, severityFilter, sortBy, filter]);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      let data;
      if (filter === 'PROPOSED') {
        data = await disastersApi.getProposedWarnings();
        if (!Array.isArray(data)) data = data.content;
      } else if (filter === 'ACTIVE') {
        data = await disastersApi.getActiveWarnings();
        if (!Array.isArray(data)) data = data.content;
      } else {
        data = await adminApi.getAllWarnings({
          size: 200,
          sort: sortBy === 'oldest' ? 'createdAt,asc' : 'createdAt,desc',
        });
        if (!Array.isArray(data)) data = data.content;
      }
      setWarnings(data || []);
    } catch (error) {
      toast.error('Failed to load warnings');
    } finally {
      setLoading(false);
    }
  };

  const resolveWarning = async (id: string) => {
    if (!confirm('Mark this warning as resolved? It will be removed from active status.')) return;
    try {
      await adminApi.resolveWarning(id);
      toast.success('Warning resolved');
      fetchWarnings();
    } catch (error) {
      toast.error('Failed to resolve warning');
    }
  };

  const deleteWarning = async (id: string) => {
    if (!confirm('Hard delete this warning from history? This action is IRREVERSIBLE.')) return;
    try {
      await adminApi.hardDeleteWarning(id);
      toast.success('Warning permanently deleted');
      fetchWarnings();
    } catch (error) {
      toast.error('Failed to delete warning');
    }
  };

  const approveProposed = async (id: string) => {
    try {
      await disastersApi.approveProposedWarning(id);
      toast.success('Proposed warning approved');
      fetchWarnings();
    } catch (error) {
      toast.error('Failed to approve warning');
    }
  };

  const rejectProposed = async (id: string) => {
    const reason = prompt('Rejection reason (min 5 chars):');
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
      fetchWarnings();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, 'Failed to reject warning'));
    }
  };

  const openCreateModal = () => {
    setEditingWarning(null);
    setIsModalOpen(true);
  };

  const openEditModal = (w: any) => {
    setEditingWarning(w);
    setIsModalOpen(true);
  };

  const severityRank: Record<string, number> = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4, EXTREME: 5 };

  const visibleWarnings = warnings
    .filter((w) => {
      if (severityFilter !== 'ALL' && w.severity !== severityFilter) {
        return false;
      }
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        String(w.headline || '').toLowerCase().includes(q) ||
        String(w.bulletinText || '').toLowerCase().includes(q) ||
        String(w.category || '').toLowerCase().includes(q) ||
        String(w.areaText || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'severity') {
        return (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(visibleWarnings.length / PAGE_SIZE));
  const pagedWarnings = visibleWarnings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <>
      <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Warning Dispatcher
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Create, manage, and dispatch emergency alerts.</p>
        </div>
      </div>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-slate-700">
              {['ALL', 'ACTIVE', 'PROPOSED'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    filter === f ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search warnings..." 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none placeholder:text-slate-600"
                />
              </div>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EXTREME'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'severity')}
                className="border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="severity">Severity</option>
              </select>
              <Button icon={<Plus size={18} />} onClick={openCreateModal} variant="primary">
                New Warning
              </Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="py-20 flex justify-center">
            <RotateCcw className="animate-spin text-amber-500" size={32} />
          </div>
        ) : visibleWarnings.length === 0 ? (
          <div className="py-20 text-center bg-slate-800/20 rounded-3xl border border-dashed border-slate-700 text-slate-500">
            <AlertTriangle size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No warnings match your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pagedWarnings.map((w) => (
              <Card key={w.id} className="bg-slate-800/50 border-slate-700 overflow-hidden group">
                <div className="flex flex-col lg:flex-row">
                  <div className={`w-2 lg:w-3 shrink-0 ${
                    w.severity === 'EXTREME' ? 'bg-purple-600' :
                    w.severity === 'CRITICAL' ? 'bg-red-500' :
                    w.severity === 'HIGH' ? 'bg-orange-500' : 'bg-amber-500'
                  }`} />
                  
                  <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="neutral">
                          {w.category}
                        </Badge>
                        <Badge variant={
                          w.severity === 'EXTREME' ? 'extreme' : w.severity === 'CRITICAL' ? 'critical' : 'warning'
                        }>{w.severity}</Badge>
                        {w.status === 'PROPOSED' && <Badge variant="info">PROPOSED</Badge>}
                        <span className="text-slate-500 text-xs flex items-center gap-1 ml-auto lg:ml-0">
                          <Clock size={12} /> Issued: {format(new Date(w.createdAt), 'MMM d, HH:mm')}
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
                      <div className="text-right hidden md:block mb-auto">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Expires At</p>
                        <p className="text-sm text-rose-500 font-bold">{w.expiresAt ? format(new Date(w.expiresAt), 'MMM d, HH:mm') : 'N/A'}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        {w.status === 'PROPOSED' ? (
                          <>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              icon={<CheckCircle2 size={16} />}
                              onClick={() => approveProposed(w.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              icon={<XCircle size={16} />}
                              onClick={() => rejectProposed(w.id)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              icon={<Edit2 size={16} />}
                              onClick={() => openEditModal(w)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              icon={<CheckCircle2 size={16} />}
                              onClick={() => resolveWarning(w.id)}
                            >
                              Resolve
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              icon={<Trash2 size={16} />}
                              onClick={() => deleteWarning(w.id)}
                              className="text-rose-500"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {visibleWarnings.length > PAGE_SIZE && (
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

      <CreateWarningModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchWarnings}
        initialData={editingWarning}
      />
    </>
  );
};

export default AdminWarningsPage;
