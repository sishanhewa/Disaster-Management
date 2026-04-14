import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Waves, 
  Mountain, 
  Flame, 
  Wind, 
  CloudLightning, 
  MoreHorizontal,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
  Camera,
  X
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { mediaApi, reportsApi } from '../../api/endpoints';
import { SeverityBadge } from '../../components/common/SeverityBadge';
import { formatDistanceToNow } from 'date-fns';

const CATEGORY_ICONS: Record<string, any> = {
  FLOOD: Waves,
  LANDSLIDE: Mountain,
  FIRE: Flame,
  CYCLONE: Wind,
  STORM: CloudLightning,
  OTHER: MoreHorizontal,
};

const SEVERITY_ORDER: Record<string, number> = {
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  CRITICAL: 4,
  EXTREME: 5,
};

const EDITABLE_CATEGORIES = new Set(['FLOOD', 'LANDSLIDE', 'CYCLONE', 'FIRE', 'TSUNAMI', 'DROUGHT', 'STORM', 'LIGHTNING', 'HEAT_WAVE', 'COASTAL_EROSION', 'OTHER']);
const EDITABLE_SEVERITIES = new Set(['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EXTREME']);

export default function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'public' | 'mine'>('public');
  const [page, setPage] = useState(0);
  const [editingReport, setEditingReport] = useState<any | null>(null);
  const [editCategory, setEditCategory] = useState('OTHER');
  const [editSeverity, setEditSeverity] = useState('MODERATE');
  const [editDescription, setEditDescription] = useState('');
  const [editPhotos, setEditPhotos] = useState<string[]>([]);
  const [uploadingEditPhoto, setUploadingEditPhoto] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'severity'>('newest');
  const queryClient = useQueryClient();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'mine' || tab === 'public') {
      setActiveTab(tab);
      setPage(0);
    }
  }, [searchParams]);

  // Queries
  const { data: publicData, isLoading: loadingPublic } = useQuery({
    queryKey: ['publicReports', page],
    queryFn: () => reportsApi.getPublicReports({ page, size: 10 }),
    enabled: activeTab === 'public',
  });

  const { data: myData, isLoading: loadingMine } = useQuery({
    queryKey: ['myReports', page],
    queryFn: () => reportsApi.getMyReports({ page, size: 10 }),
    enabled: activeTab === 'mine',
  });

  // Confirm/Deny Mutation
  const verifyMutation = useMutation({
    mutationFn: ({ id, confirm }: { id: string; confirm: boolean }) => 
      reportsApi.confirmReport(id, confirm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicReports'] });
      toast.success('Response recorded!');
    },
  });

  const updateMyReportMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => reportsApi.updateMyReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReports'] });
      toast.success('Report updated');
      setEditingReport(null);
    },
    onError: () => toast.error('Failed to update report'),
  });

  const deleteMyReportMutation = useMutation({
    mutationFn: (id: string) => reportsApi.deleteMyReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReports'] });
      toast.success('Report deleted');
    },
    onError: () => toast.error('Failed to delete report'),
  });

  const currentData = activeTab === 'public' ? publicData : myData;
  const isLoading = activeTab === 'public' ? loadingPublic : loadingMine;

  const filteredReports = (currentData?.content || [])
    .filter((report: any) => {
      if (severityFilter !== 'ALL' && report.severityAssessment !== severityFilter) {
        return false;
      }
      if (!searchTerm.trim()) return true;

      const q = searchTerm.trim().toLowerCase();
      return (
        String(report.category || '').toLowerCase().includes(q) ||
        String(report.description || '').toLowerCase().includes(q) ||
        String(report.spatialUnitName || '').toLowerCase().includes(q) ||
        String(report.status || '').toLowerCase().includes(q)
      );
    })
    .sort((a: any, b: any) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'severity') {
        return (SEVERITY_ORDER[b.severityAssessment] || 0) - (SEVERITY_ORDER[a.severityAssessment] || 0);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const submitEdit = () => {
    const trimmedDescription = editDescription.trim();
    if (!editingReport) return;
    if (!EDITABLE_CATEGORIES.has(editCategory)) {
      toast.error('Please choose a valid category');
      return;
    }
    if (!EDITABLE_SEVERITIES.has(editSeverity)) {
      toast.error('Please choose a valid severity');
      return;
    }
    if (trimmedDescription.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }
    if (trimmedDescription.length > 4000) {
      toast.error('Description is too long (max 4000 characters)');
      return;
    }
    if (editPhotos.length < 1) {
      toast.error('At least one photo is required');
      return;
    }
    if (editPhotos.length > 3) {
      toast.error('Maximum 3 photos allowed');
      return;
    }

    updateMyReportMutation.mutate({
      id: editingReport.id,
      payload: {
        category: editCategory,
        description: trimmedDescription,
        severityAssessment: editSeverity,
        lat: editingReport.lat,
        lng: editingReport.lng,
        photoUrls: editPhotos,
      },
    });
  };

  const handleEditPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (editPhotos.length + files.length > 3) {
      toast.error('Maximum 3 photos allowed');
      return;
    }

    setUploadingEditPhoto(true);
    for (const file of files) {
      try {
        const { url } = await mediaApi.upload(file, 'reports');
        setEditPhotos((prev) => [...prev, url]);
      } catch {
        toast.error('Failed to upload image');
      }
    }
    setUploadingEditPhoto(false);
  };

  const removeEditPhoto = (index: number) => {
    setEditPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Community Incident Reports
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Crowdsourced real-time situational awareness across Sri Lanka.</p>
        </div>
        <Link 
          to="/reports/new"
          className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2 self-start"
        >
          <AlertCircle className="w-5 h-5" />
          Report Incident
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl mb-8 self-start w-fit">
        <button
          onClick={() => { setActiveTab('public'); setPage(0); setSearchParams({ tab: 'public' }); }}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'public' ? 'bg-slate-800 text-sky-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Public Reports
        </button>
        <button
          onClick={() => { setActiveTab('mine'); setPage(0); setSearchParams({ tab: 'mine' }); }}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
            activeTab === 'mine' ? 'bg-slate-800 text-sky-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          My Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search reports"
          className="border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
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
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
          <p className="text-slate-500 font-medium">Fetching reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-16 text-center">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">No reports found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {activeTab === 'public' 
              ? "There are no active verified reports at the moment. Check back later." 
              : "You haven't submitted any reports yet. Any incidents you report will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report: any) => (
            <ReportCard 
              key={report.id} 
              report={report} 
              isOwn={activeTab === 'mine'}
              onVerify={(id, confirm) => verifyMutation.mutate({ id, confirm })}
              onEdit={(report) => {
                setEditingReport(report);
                setEditCategory(report.category || 'OTHER');
                setEditSeverity(report.severityAssessment || 'MODERATE');
                setEditDescription(report.description || '');
                setEditPhotos(Array.isArray(report.photoUrls) ? report.photoUrls : []);
              }}
              onDelete={(id) => {
                if (confirm('Delete this pending report?')) {
                  deleteMyReportMutation.mutate(id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {currentData?.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: currentData.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-10 h-10 rounded-lg font-bold transition-all ${
                page === i ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {editingReport && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Edit Pending Report</h3>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {['FLOOD', 'LANDSLIDE', 'CYCLONE', 'FIRE', 'TSUNAMI', 'DROUGHT', 'STORM', 'LIGHTNING', 'HEAT_WAVE', 'COASTAL_EROSION', 'OTHER'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={editSeverity}
                onChange={(e) => setEditSeverity(e.target.value)}
                className="border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EXTREME'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              className="w-full border border-slate-600 bg-slate-700 text-slate-100 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-300">Photos (1-3 required)</p>
              <div className="grid grid-cols-4 gap-2">
                {editPhotos.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700">
                    <img src={url} alt="Report evidence" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeEditPhoto(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {editPhotos.length < 3 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500/50 text-slate-400">
                    <Camera className="w-4 h-4 mb-1" />
                    <span className="text-[10px]">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleEditPhotoUpload}
                      disabled={uploadingEditPhoto}
                    />
                  </label>
                )}
              </div>
              {uploadingEditPhoto && <p className="text-xs text-slate-400">Uploading photo...</p>}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingReport(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition border border-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                disabled={updateMyReportMutation.isPending}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-500 transition disabled:opacity-60"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportCard({ report, isOwn, onVerify, onEdit, onDelete }: {
  report: any;
  isOwn: boolean;
  onVerify: (id: string, confirm: boolean) => void;
  onEdit: (report: any) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = CATEGORY_ICONS[report.category] || MoreHorizontal;
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-800 p-2.5 rounded-xl text-sky-400">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{report.category}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        <SeverityBadge severity={report.severityAssessment} />
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span>{report.spatialUnitName || 'Unknown Location'}</span>
        </div>
        <p className="text-slate-300 text-sm line-clamp-3 italic leading-relaxed">"{report.description}"</p>
        
        {report.photoUrls?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {report.photoUrls.map((url: string, i: number) => (
              <img key={i} src={url} alt="Evidence" className="h-16 w-16 object-cover rounded-lg border border-slate-800" />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
        {isOwn ? (
          <div className="flex items-center gap-3 w-full">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              report.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
              report.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
              'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {report.status}
            </div>
            {report.status === 'PENDING' && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => onEdit(report)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(report.id)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/5 px-2 py-1 rounded-md">
                <ThumbsUp className="w-3.5 h-3.5" />
                {report.confirmCount}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-500/5 px-2 py-1 rounded-md">
                <ThumbsDown className="w-3.5 h-3.5" />
                {report.denyCount}
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => onVerify(report.id, true)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-500 transition-all border border-transparent hover:border-emerald-500/20"
                title="Verify Incident"
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onVerify(report.id, false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-500 transition-all border border-transparent hover:border-red-500/20"
                title="Report Inaccurate"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
