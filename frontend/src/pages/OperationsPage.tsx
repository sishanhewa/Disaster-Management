import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert, Activity, Users, MapPin,
  Plus, Edit2, Trash2, CheckCircle2,
  Clock, Phone, Building2, Truck, LifeBuoy, AlertTriangle,
  UserPlus, ChevronRight, RefreshCw, X, Navigation,
  Battery, HeartPulse, Info, Lock, Radio, Zap,
  CheckCheck, Circle, Filter, ArrowRight, AlertCircle,
  Shield, User, Ambulance
} from 'lucide-react';
import { adminApi, emergencyApi } from '../api/endpoints';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/authStore';

type Tab = 'resources' | 'tasks' | 'sos';
type TaskFilter = 'all' | 'open' | 'mine' | 'assigned' | 'completed';

const OperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('sos');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('open');
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuthStore();

  const isSystemAdmin = isAdmin();
  const userRoles = user?.roles || [];

  const canManage = isSystemAdmin || userRoles.some(r =>
    ['responder', 'RESPONDER', 'govt_official', 'GOVT_OFFICIAL'].includes(r)
  );
  const isVolunteer = userRoles.some(r => ['volunteer', 'VOLUNTEER'].includes(r));
  const hasAccess = canManage || isVolunteer;

  // Data
  const [resources, setResources] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [activeSos, setActiveSos] = useState<any[]>([]);

  // Modals
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSosTaskModalOpen, setIsSosTaskModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [sosForTask, setSosForTask] = useState<any>(null);

  // Form States
  const [resourceForm, setResourceForm] = useState({
    name: '',
    district: '',
    resourceType: 'AMBULANCE',
    phone: '',
    address: '',
    notes: '',
    isActive: true,
    lat: 6.9271,
    lng: 79.8612
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    requiredAssetType: '',
    lat: 6.9271,
    lng: 79.8612,
    radiusKm: 5.0,
    sosIncidentId: null as string | null,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'resources') {
        const data = await emergencyApi.getAvailableResources();
        setResources(data);
      } else if (activeTab === 'tasks') {
        const [tasksData, volunteersData] = await Promise.all([
          canManage ? emergencyApi.getAllTasks() : emergencyApi.getAvailableTasks(),
          canManage ? adminApi.listVolunteers() : Promise.resolve([])
        ]);
        setTasks(tasksData);
        setVolunteers(volunteersData);
      } else if (activeTab === 'sos') {
        const data = await adminApi.getActiveSos();
        setActiveSos(data);
      }
    } catch (error) {
      toast.error('Failed to load operations data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, canManage]);

  useEffect(() => {
    if (hasAccess) {
      fetchData();
    }
  }, [activeTab, hasAccess]);

  // ── Access Guard ─────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
            <Lock className="text-rose-500" size={44} />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase mb-3">Restricted Access</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            The Operations Hub is restricted to authorized personnel only.
            Contact your administrator to request access as a
            <span className="text-sky-400 font-bold"> Responder</span>,
            <span className="text-amber-400 font-bold"> Government Official</span>, or
            <span className="text-emerald-400 font-bold"> Volunteer</span>.
          </p>
          <div className="mt-8 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-left space-y-3">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Emergency Contacts</p>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Phone size={14} className="text-rose-500" /> <span className="font-bold">119</span> — Emergency Services
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Radio size={14} className="text-sky-500" /> <span className="font-bold">118</span> — Fire & Rescue
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Resource Handlers ───────────────────────────
  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!resourceForm.phone.trim()) {
      toast.error('Phone number is required for emergency resources');
      return;
    }
    try {
      setLoading(true);
      if (selectedItem) {
        await adminApi.updateResource(selectedItem.id, resourceForm);
        toast.success('Resource updated');
      } else {
        await adminApi.createResource(resourceForm);
        toast.success('Resource deployed');
      }
      setIsResourceModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!canManage || !confirm('Remove this resource from the grid?')) return;
    try {
      await adminApi.deleteResource(id);
      toast.success('Resource removed');
      setResources(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error('Failed to remove resource');
    }
  };

  // ── Task Handlers ───────────────────────────────
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    try {
      setLoading(true);
      if (selectedItem) {
        await adminApi.updateTask(selectedItem.id, taskForm);
        toast.success('Task updated');
      } else {
        await emergencyApi.createTask(taskForm);
        toast.success('Task broadcast');
      }
      setIsTaskModalOpen(false);
      setIsSosTaskModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!canManage || !confirm('Delete this task?')) return;
    try {
      await adminApi.deleteTask(id);
      toast.success('Task deleted');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleAcceptTask = async (id: string) => {
    try {
      await emergencyApi.acceptTask(id);
      toast.success('Task accepted! You are now en route.');
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to accept task');
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await emergencyApi.completeTask(id);
      toast.success('Task marked as complete!');
      fetchData();
    } catch {
      toast.error('Failed to complete task');
    }
  };

  const handleAssignTask = async (taskId: string, volunteerId: string) => {
    try {
      await adminApi.assignTask(taskId, volunteerId);
      toast.success('Volunteer dispatched');
      setIsAssignModalOpen(false);
      fetchData();
    } catch {
      toast.error('Failed to assign task');
    }
  };

  // ── SOS Handlers ────────────────────────────────
  const handleRespondSos = async (sosId: string) => {
    try {
      await adminApi.respondToSos(sosId);
      toast.success('You are now responding to this SOS');
      fetchData();
    } catch {
      toast.error('Failed to respond to SOS');
    }
  };

  const handleSosStatus = async (sosId: string, status: string) => {
    try {
      await adminApi.updateSosStatus(sosId, status);
      toast.success(`SOS status updated to ${status}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openCreateTaskFromSos = (sos: any) => {
    setSosForTask(sos);
    setTaskForm({
      title: `SOS Response – ${sos.userDisplayName || 'Citizen'}`,
      description: `Emergency response task for SOS incident. Medical notes: ${sos.medicalNotes || 'none'}. Contact: ${sos.contactPhone || 'none'}`,
      priority: 'CRITICAL',
      requiredAssetType: '',
      lat: sos.lat,
      lng: sos.lng,
      radiusKm: 5.0,
      sosIncidentId: sos.id,
    });
    setIsSosTaskModalOpen(true);
  };

  // ── Helpers ─────────────────────────────────────
  const getPriorityVariant = (p: string): any => {
    switch (p) {
      case 'CRITICAL': return 'critical';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'warning';
      default: return 'info';
    }
  };

  const getSosStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'ASSIGNED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'EN_ROUTE': return 'text-sky-400 bg-sky-400/10 border-sky-400/20';
      case 'RESOLVED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getTaskStatusStyle = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-emerald-400';
      case 'ASSIGNED': return 'text-blue-400';
      case 'EN_ROUTE': return 'text-sky-400';
      case 'COMPLETED': return 'text-slate-400';
      default: return 'text-slate-500';
    }
  };

  const getFilteredTasks = () => {
    switch (taskFilter) {
      case 'open': return tasks.filter(t => t.status === 'OPEN');
      case 'mine': return tasks.filter(t =>
        t.assignedVolunteerId === user?.id || t.assignedResponderId === user?.id
      );
      case 'assigned': return tasks.filter(t => ['ASSIGNED', 'EN_ROUTE'].includes(t.status));
      case 'completed': return tasks.filter(t => t.status === 'COMPLETED');
      default: return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  // Stats
  const stats = [
    { label: 'Resources', value: resources.length || '—', icon: Truck, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { label: 'Open Tasks', value: tasks.filter(t => t.status === 'OPEN').length || '—', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active SOS', value: activeSos.filter(s => s.status !== 'RESOLVED').length || '—', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-400/10', pulse: true },
    { label: 'En Route', value: tasks.filter(t => t.status === 'EN_ROUTE').length || '—', icon: Navigation, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ──────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
            <Activity className="text-sky-500" size={32} />
            OPERATIONS HUB
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
            {canManage ? 'Tactical Command & Coordination' : 'Volunteer Task Portal'}
          </p>
        </div>
        <div className="flex gap-2">
          {canManage && activeTab === 'resources' && (
            <Button icon={<Plus size={18} />} onClick={() => {
              setSelectedItem(null);
              setResourceForm({ name: '', district: '', resourceType: 'AMBULANCE', phone: '', address: '', notes: '', isActive: true, lat: 6.9271, lng: 79.8612 });
              setIsResourceModalOpen(true);
            }}>Add Resource</Button>
          )}
          {canManage && activeTab === 'tasks' && (
            <Button icon={<Plus size={18} />} variant="primary" onClick={() => {
              setSelectedItem(null);
              setTaskForm({ title: '', description: '', priority: 'MEDIUM', requiredAssetType: '', lat: 6.9271, lng: 79.8612, radiusKm: 5.0, sosIncidentId: null });
              setIsTaskModalOpen(true);
            }}>Create Task</Button>
          )}
          <Button variant="ghost" icon={<RefreshCw size={18} />} onClick={fetchData} disabled={loading}>Refresh</Button>
        </div>
      </div>

      {/* ── Stats Row ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-800/20 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg} relative`}>
              <s.icon className={`${s.color} ${s.pulse ? 'animate-pulse' : ''}`} size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ──────────────────────────────── */}
      <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit shadow-inner">
        <button
          onClick={() => setActiveTab('sos')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'sos' ? 'bg-slate-800 text-rose-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <ShieldAlert size={16} /> Live SOS
          {activeSos.filter(s => s.status === 'PENDING').length > 0 && (
            <span className="w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
              {activeSos.filter(s => s.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-slate-800 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Users size={16} /> Tasks
        </button>
        {canManage && (
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'resources' ? 'bg-slate-800 text-sky-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Truck size={16} /> Resources
          </button>
        )}
      </div>

      {/* ── Loading ───────────────────────────── */}
      {loading && !resources.length && !tasks.length && !activeSos.length ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <Activity className="animate-spin text-sky-500" size={48} />
          <p className="text-slate-500 font-black tracking-widest uppercase text-xs">Syncing Tactical Data...</p>
        </div>
      ) : (

        <div className="grid grid-cols-1 gap-6">

          {/* ── SOS View ──────────────────────────── */}
          {activeTab === 'sos' && (
            <div className="space-y-6">
              {!canManage ? (
                <div className="py-16 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
                  <Lock className="mx-auto text-slate-700 mb-4" size={40} />
                  <p className="text-slate-500 font-bold">SOS monitoring is restricted to responders and administrators.</p>
                </div>
              ) : activeSos.length === 0 ? (
                <div className="py-20 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl col-span-full">
                  <ShieldAlert className="mx-auto text-slate-700 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">Standby. No active SOS broadcasts detected.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeSos.map(sos => (
                    <Card key={sos.id} className={`border-2 overflow-hidden shadow-2xl group ${sos.status === 'RESOLVED' ? 'bg-slate-900/50 border-slate-700/30 opacity-60' : 'bg-slate-950 border-rose-500/30 shadow-rose-950/20'}`}>
                      {/* Header */}
                      <div className="p-4 bg-rose-600/10 flex justify-between items-center border-b border-rose-500/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`text-rose-500 ${sos.status === 'PENDING' ? 'animate-pulse' : ''}`} size={20} />
                          <span className="text-xs font-black text-rose-500 uppercase tracking-tighter">
                            {sos.status === 'PENDING' ? 'DISTRESS SIGNAL' : sos.status === 'RESOLVED' ? 'CASE CLOSED' : 'RESPONSE ACTIVE'}
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${getSosStatusStyle(sos.status)}`}>
                          {sos.status?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="p-6 space-y-5">
                        {/* Caller Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                              {sos.userDisplayName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h4 className="font-black text-white text-lg tracking-tight leading-none">{sos.userDisplayName || 'Unknown Citizen'}</h4>
                              <p className="text-xs text-rose-400 font-bold mt-1 flex items-center gap-1">
                                <Phone size={12} /> {sos.contactPhone || sos.userPhone || 'No contact provided'}
                              </p>
                              {sos.assignedToName && (
                                <p className="text-xs text-sky-400 font-bold mt-0.5 flex items-center gap-1">
                                  <Shield size={12} /> Responder: {sos.assignedToName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {sos.batteryLevel != null && (
                              <div className="flex items-center gap-1.5 text-rose-500 justify-end">
                                <Battery size={16} />
                                <span className="font-black text-sm">{Math.round(sos.batteryLevel)}%</span>
                              </div>
                            )}
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Battery</p>
                          </div>
                        </div>

                        {/* Notes & Location */}
                        <div className="space-y-2">
                          {sos.medicalNotes && (
                            <div className="flex items-start gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                              <Info className="text-sky-500 shrink-0 mt-0.5" size={16} />
                              <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Medical / Situational</p>
                                <p className="text-sm text-slate-200 font-medium leading-relaxed italic">"{sos.medicalNotes}"</p>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                              <MapPin className="text-rose-500 shrink-0" size={16} />
                              <div className="text-[10px] font-black uppercase text-slate-500">
                                GPS<p className="text-xs text-white tracking-tight mt-0.5">{sos.lat?.toFixed(4)}, {sos.lng?.toFixed(4)}</p>
                              </div>
                            </div>
                            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex items-center gap-2">
                              <Clock className="text-amber-500 shrink-0" size={16} />
                              <div className="text-[10px] font-black uppercase text-slate-500">
                                ELAPSED<p className="text-xs text-white tracking-tight mt-0.5">{formatDistanceToNow(new Date(sos.createdAt))} ago</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {sos.status !== 'RESOLVED' && (
                          <div className="flex flex-col gap-2 pt-1">
                            {sos.status === 'PENDING' && (
                              <Button
                                className="w-full h-11 font-black uppercase tracking-widest"
                                variant="danger"
                                size="lg"
                                icon={<Radio size={18} />}
                                onClick={() => handleRespondSos(sos.id)}
                              >
                                Respond to SOS
                              </Button>
                            )}
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 font-bold"
                                variant="secondary"
                                size="md"
                                icon={<Plus size={16} />}
                                onClick={() => openCreateTaskFromSos(sos)}
                              >
                                Create Task
                              </Button>
                              {sos.status === 'ASSIGNED' && (
                                <Button
                                  variant="secondary"
                                  size="md"
                                  className="text-sky-400"
                                  onClick={() => handleSosStatus(sos.id, 'EN_ROUTE')}
                                >
                                  Mark En Route
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="md"
                                className="text-emerald-400 from-emerald-500/10 border border-emerald-500/20"
                                icon={<CheckCircle2 size={16} />}
                                onClick={() => handleSosStatus(sos.id, 'RESOLVED')}
                              >
                                Close
                              </Button>
                              <button
                                className="p-2 text-slate-500 hover:text-white"
                                onClick={() => window.open(`https://maps.google.com/?q=${sos.lat},${sos.lng}`)}>
                                <Navigation size={18} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tasks View ─────────────────────────── */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                {(['open', ...(canManage ? ['all', 'assigned'] : []), 'mine', 'completed'] as TaskFilter[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setTaskFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${taskFilter === f
                      ? 'bg-slate-800 text-sky-400 border-sky-500/30'
                      : 'text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                  >
                    {f === 'mine' ? '✦ Mine' : f === 'all' ? 'All Tasks' : f === 'open' ? 'Open' : f === 'assigned' ? 'In Progress' : 'Completed'}
                    {f === 'open' && tasks.filter(t => t.status === 'OPEN').length > 0 && (
                      <span className="ml-1.5 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        {tasks.filter(t => t.status === 'OPEN').length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {filteredTasks.length === 0 ? (
                <div className="py-20 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
                  <Users className="mx-auto text-slate-700 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">No {taskFilter !== 'all' ? taskFilter : ''} tasks found.</p>
                </div>
              ) : filteredTasks.map(task => {
                const isMyTask = task.assignedVolunteerId === user?.id || task.assignedResponderId === user?.id;
                return (
                  <Card key={task.id} className={`p-6 flex flex-col md:flex-row gap-6 items-start md:items-center transition-all border ${isMyTask ? 'bg-sky-950/20 border-sky-500/20 hover:border-sky-500/40' : 'bg-slate-800/20 border-slate-800 hover:border-emerald-500/30'}`}>
                    {/* Priority color stripe */}
                    <div className={`hidden md:block w-1 h-16 rounded-full shrink-0 ${task.priority === 'CRITICAL' ? 'bg-rose-500' : task.priority === 'HIGH' ? 'bg-orange-500' : task.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-600'}`} />

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant={getPriorityVariant(task.priority)} size="sm" className="font-black">{task.priority}</Badge>
                        <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getTaskStatusStyle(task.status)}`}>
                          <Circle size={7} className="fill-current" /> {task.status?.replace('_', ' ')}
                        </span>
                        {task.sosIncidentId && (
                          <span className="text-[10px] text-rose-400 font-black uppercase flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                            <ShieldAlert size={10} /> SOS Linked
                          </span>
                        )}
                        {isMyTask && (
                          <span className="text-[10px] text-sky-400 font-black uppercase flex items-center gap-1 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                            <User size={10} /> Assigned to Me
                          </span>
                        )}
                        <h3 className="font-bold text-white text-lg tracking-tight w-full md:w-auto">{task.title}</h3>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-2 max-w-2xl">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-black uppercase tracking-widest pt-1">
                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-600" /> {task.createdAt ? formatDistanceToNow(new Date(task.createdAt)) + ' ago' : '—'}</span>
                        <span className="flex items-center gap-1.5 text-blue-500"><Navigation size={12} /> {task.radiusKm}km Radius</span>
                        {task.lat && <span className="flex items-center gap-1.5"><MapPin size={12} /> {task.lat.toFixed(3)}, {task.lng.toFixed(3)}</span>}
                        {task.requiredAssetType && <span className="flex items-center gap-1.5 text-amber-500"><Truck size={12} /> {task.requiredAssetType}</span>}
                      </div>
                      {/* Assigned info */}
                      {(task.assignedVolunteerName || task.assignedResponderName) && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {task.assignedResponderName && (
                            <span className="flex items-center gap-1.5 text-[10px] bg-sky-500/10 text-sky-400 px-2 py-1 rounded-lg border border-sky-500/20 font-bold">
                              <Shield size={10} /> {task.assignedResponderName}
                            </span>
                          )}
                          {task.assignedVolunteerName && (
                            <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20 font-bold">
                              <User size={10} /> {task.assignedVolunteerName}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto shrink-0">
                      {/* Volunteer actions */}
                      {(isVolunteer || canManage) && task.status === 'OPEN' && !isMyTask && (
                        <Button
                          variant="primary"
                          size="md"
                          className="font-bold"
                          icon={<CheckCircle2 size={16} />}
                          onClick={() => handleAcceptTask(task.id)}
                        >
                          Accept Task
                        </Button>
                      )}
                      {isMyTask && task.status !== 'COMPLETED' && (
                        <Button
                          variant="secondary"
                          size="md"
                          icon={<CheckCheck size={16} />}
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {/* Manager actions */}
                      {canManage && (
                        <div className="flex items-center gap-2">
                          {task.status === 'OPEN' && !task.assignedVolunteerName && (
                            <Button
                              variant="secondary"
                              size="md"
                              icon={<UserPlus size={16} />}
                              onClick={() => { setSelectedItem(task); setIsAssignModalOpen(true); }}
                            >
                              Assign
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" icon={<Edit2 size={14} />} onClick={() => {
                            setSelectedItem(task);
                            setTaskForm({ ...task, sosIncidentId: task.sosIncidentId || null });
                            setIsTaskModalOpen(true);
                          }} />
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400" icon={<Trash2 size={14} />} onClick={() => handleDeleteTask(task.id)} />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* ── Resources View ─────────────────────── */}
          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl">
                  <Truck className="mx-auto text-slate-700 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">No tactical resources deployed in this sector.</p>
                </div>
              ) : resources.map(resource => (
                <Card key={resource.id} className="bg-slate-800/20 border-slate-800 hover:border-sky-500/30 transition-all group relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full border uppercase tracking-widest ${resource.isActive ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-rose-400 bg-rose-400/10 border-rose-400/20'}`}>
                      {resource.isActive ? 'AVAILABLE' : 'BUSY'}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-2xl ${resource.resourceType === 'HOSPITAL' ? 'bg-rose-500/10 text-rose-500' : resource.resourceType === 'POLICE' ? 'bg-blue-500/10 text-blue-500' : resource.resourceType === 'HELICOPTER' ? 'bg-purple-500/10 text-purple-500' : 'bg-sky-500/10 text-sky-500'}`}>
                        {resource.resourceType === 'HOSPITAL' ? <Building2 size={28} /> :
                          resource.resourceType === 'POLICE' ? <ShieldAlert size={28} /> :
                            resource.resourceType === 'HELICOPTER' ? <Zap size={28} /> :
                              resource.resourceType === 'AMBULANCE' ? <HeartPulse size={28} /> : <Truck size={28} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-white text-lg tracking-tight leading-tight">{resource.name}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                          {resource.resourceType} • {resource.district}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-xl p-3 space-y-2 border border-slate-800/50">
                      {resource.phone && (
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500 uppercase tracking-tighter flex items-center gap-1"><Phone size={10} /> Contact</span>
                          <span className="text-sky-400">{resource.phone}</span>
                        </div>
                      )}
                      {resource.address && (
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-500 uppercase tracking-tighter flex items-center gap-1"><MapPin size={10} /> Address</span>
                          <span className="text-slate-300 truncate max-w-[140px]">{resource.address}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500 uppercase tracking-tighter">GPS</span>
                        <span className="text-sky-400">{resource.lat?.toFixed(4)}, {resource.lng?.toFixed(4)}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                      {canManage && (
                        <>
                          <Button size="sm" variant="ghost" icon={<Edit2 size={14} />} onClick={() => {
                            setSelectedItem(resource);
                            setResourceForm({
                              name: resource.name || '',
                              district: resource.district || '',
                              resourceType: resource.resourceType || 'AMBULANCE',
                              phone: resource.phone || '',
                              address: resource.address || '',
                              notes: resource.notes || '',
                              isActive: resource.isActive ?? true,
                              lat: resource.lat || 6.9271,
                              lng: resource.lng || 79.8612
                            });
                            setIsResourceModalOpen(true);
                          }} />
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400" icon={<Trash2 size={14} />} onClick={() => handleDeleteResource(resource.id)} />
                        </>
                      )}
                      <Button size="sm" variant="secondary" icon={<Navigation size={12} />}
                        onClick={() => window.open(`https://maps.google.com/?q=${resource.lat},${resource.lng}`)}>
                        Navigate
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Resource Modal ─────────────────────── */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsResourceModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
            <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">
              {selectedItem ? 'Update Resource' : 'Deploy Resource'}
            </h3>
            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <Input label="Resource Name" placeholder="e.g. Central Response Unit 01" value={resourceForm.name}
                onChange={e => setResourceForm({ ...resourceForm, name: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="District / Sector" placeholder="e.g. Colombo 07" value={resourceForm.district}
                  onChange={e => setResourceForm({ ...resourceForm, district: e.target.value })} required />
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 h-12 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500"
                    value={resourceForm.resourceType}
                    onChange={e => setResourceForm({ ...resourceForm, resourceType: e.target.value })}>
                    <option value="AMBULANCE">Ambulance / Medical</option>
                    <option value="HOSPITAL">General Hospital</option>
                    <option value="FIRE_TRUCK">Fire & Rescue</option>
                    <option value="POLICE">Law Enforcement</option>
                    <option value="HELICOPTER">Air Rescue</option>
                    <option value="SHELTER">Safety Shelter</option>
                  </select>
                </div>
              </div>
              <Input
                label="Contact Phone"
                placeholder="e.g. 011-123-4567"
                icon={<Phone size={14} />}
                value={resourceForm.phone}
                onChange={e => setResourceForm({ ...resourceForm, phone: e.target.value })}
                required
              />
              <Input label="Address (Optional)" placeholder="Street address or landmark" value={resourceForm.address}
                onChange={e => setResourceForm({ ...resourceForm, address: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="LATITUDE" type="number" step="0.0001" value={resourceForm.lat}
                  onChange={e => setResourceForm({ ...resourceForm, lat: parseFloat(e.target.value) })} />
                <Input label="LONGITUDE" type="number" step="0.0001" value={resourceForm.lng}
                  onChange={e => setResourceForm({ ...resourceForm, lng: parseFloat(e.target.value) })} />
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input type="checkbox" id="isActive" checked={resourceForm.isActive}
                  onChange={e => setResourceForm({ ...resourceForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded accent-sky-500" />
                <label htmlFor="isActive" className="text-sm text-slate-300 font-medium cursor-pointer">Available / Active</label>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes (Optional)</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition min-h-[80px]"
                  placeholder="Additional operational notes..." value={resourceForm.notes}
                  onChange={e => setResourceForm({ ...resourceForm, notes: e.target.value })} />
              </div>
              <div className="pt-2">
                <Button className="w-full" size="lg" type="submit" disabled={loading}>
                  {selectedItem ? 'Update Resource' : 'Deploy to Grid'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── Task Modal ─────────────────────────── */}
      {(isTaskModalOpen || isSosTaskModalOpen) && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-800 p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setIsTaskModalOpen(false); setIsSosTaskModalOpen(false); }} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
              {isSosTaskModalOpen ? 'Create Task from SOS' : selectedItem ? 'Update Task' : 'Broadcast Task'}
            </h3>
            {isSosTaskModalOpen && sosForTask && (
              <div className="mb-6 px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3">
                <ShieldAlert className="text-rose-400 shrink-0" size={18} />
                <p className="text-xs text-rose-300 font-medium">
                  Creating task linked to SOS from <span className="font-black text-white">{sosForTask.userDisplayName || 'Citizen'}</span>
                </p>
              </div>
            )}
            {taskForm.sosIncidentId && !isSosTaskModalOpen && (
              <p className="mb-6 text-xs text-rose-400 font-bold flex items-center gap-2">
                <ShieldAlert size={14} /> Linked to SOS Incident
              </p>
            )}
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <Input label="Mission Title" placeholder="e.g. Flood Water Rescue Support" value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 h-12 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500"
                    value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option value="LOW">Routine (Low)</option>
                    <option value="MEDIUM">Operational (Medium)</option>
                    <option value="HIGH">Urgent (High)</option>
                    <option value="CRITICAL">Critical (Life Threat)</option>
                  </select>
                </div>
                <Input label="Required Asset (Optional)" placeholder="e.g. BOAT, MEDIC" value={taskForm.requiredAssetType}
                  onChange={e => setTaskForm({ ...taskForm, requiredAssetType: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mission Directives</label>
                <textarea className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500/50 outline-none transition min-h-[100px]"
                  placeholder="Precise instructions for field volunteers..."
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="LAT" type="number" step="0.0001" value={taskForm.lat}
                  onChange={e => setTaskForm({ ...taskForm, lat: parseFloat(e.target.value) })} />
                <Input label="LNG" type="number" step="0.0001" value={taskForm.lng}
                  onChange={e => setTaskForm({ ...taskForm, lng: parseFloat(e.target.value) })} />
                <Input label="RADIUS (KM)" type="number" value={taskForm.radiusKm}
                  onChange={e => setTaskForm({ ...taskForm, radiusKm: parseFloat(e.target.value) })} />
              </div>
              <div className="pt-2">
                <Button className="w-full" size="lg" variant="primary" type="submit" disabled={loading}>
                  {selectedItem ? 'Update Mission' : isSosTaskModalOpen ? 'Create & Link Task' : 'Broadcast Mission'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── Assignment Modal ───────────────────── */}
      {isAssignModalOpen && selectedItem && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 p-8 shadow-2xl relative">
            <button onClick={() => setIsAssignModalOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-sky-500/20">
                <UserPlus className="text-sky-500" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Dispatch Unit</h3>
              <p className="text-slate-500 text-xs font-medium mt-2">Assign a verified volunteer to <span className="text-white">"{selectedItem.title}"</span></p>
            </div>
            <div className="space-y-3">
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {volunteers.length === 0 ? (
                  <div className="py-10 text-center border border-slate-800 border-dashed rounded-2xl">
                    <Users className="mx-auto text-slate-800 mb-2" size={32} />
                    <p className="text-slate-600 text-xs font-bold uppercase">No standby units available</p>
                  </div>
                ) : volunteers.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => handleAssignTask(selectedItem.id, v.id)}
                    className="w-full text-left p-4 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-sky-500 hover:bg-sky-500/5 transition-all group flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-black text-white group-hover:bg-sky-500 transition-all shadow-lg">
                      {v.displayName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white group-hover:text-sky-400 transition-colors">{v.displayName}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{v.email}</p>
                    </div>
                    <ChevronRight className="ml-auto text-slate-600 group-hover:text-sky-500 transform group-hover:translate-x-1 transition-all" size={20} />
                  </button>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-slate-500" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OperationsPage;
