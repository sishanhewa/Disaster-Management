import React, { useState, useEffect } from 'react';
import {
  Tent, Plus, Edit2, Trash2, RefreshCw, Search,
  MapPin, CheckCircle, X,
} from 'lucide-react';
import { campsApi, authApi, adminApi } from '../../api/endpoints';
import { Badge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const AdminCampsPage: React.FC = () => {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCamp, setEditingCamp] = useState<any>(null);

  const [responders, setResponders] = useState<any[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState('');
  const [assignMode, setAssignMode] = useState<'existing' | 'new'>('existing');

  // Form state
  const [campName, setCampName] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPassword, setManagerPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchCamps(); }, []);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const [campsData, usersRes] = await Promise.all([
        campsApi.getAll(),
        adminApi.getAllUsers()
      ]);
      setCamps(campsData);
      
      const usersList = usersRes.content || usersRes;
      const filteredResponders = usersList.filter((u: any) => {
        const roleStr = (u.roles || []).join(',').toUpperCase();
        return roleStr.includes('RESPONDER') || roleStr.includes('ADMIN');
      });
      setResponders(filteredResponders);
    } catch {
      toast.error('Failed to load camps data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCamp(null);
    setCampName(''); setDistrict(''); setAddress('');
    setSelectedManagerId(''); setAssignMode('existing');
    setManagerName(''); setManagerEmail(''); setManagerPassword('');
    setIsModalOpen(true);
  };

  const openEditModal = (camp: any) => {
    setEditingCamp(camp);
    setCampName(camp.campName || '');
    setDistrict(camp.district || '');
    setAddress(camp.address || '');
    setSelectedManagerId(camp.manager?.id || '');
    setAssignMode('existing');
    setManagerName(''); setManagerEmail(''); setManagerPassword('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      let finalManagerId = selectedManagerId;

      if (assignMode === 'new' && managerEmail && managerPassword) {
        const regRes = await authApi.register({
          email: managerEmail,
          password: managerPassword,
          displayName: managerName || `${campName} Manager`,
        });
        finalManagerId = regRes.user?.id || regRes.id || '';
      }

      const campData: any = { campName, district, address };
      if (finalManagerId) {
        campData.manager = { id: finalManagerId };
      }

      if (editingCamp) {
        await campsApi.update(editingCamp.id, campData);
        toast.success('Camp updated successfully');
      } else {
        await campsApi.create(campData);
        toast.success('Camp created successfully');
      }
      
      setIsModalOpen(false);
      fetchCamps();
    } catch {
      toast.error(
        editingCamp
          ? 'Failed to update camp'
          : 'Failed to create camp. Manager email may already be taken.',
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete camp "${name}"? This cannot be undone.`)) return;
    try {
      setActionLoading(id);
      await campsApi.delete(id);
      setCamps(prev => prev.filter(c => c.id !== id));
      toast.success('Camp deleted');
    } catch {
      toast.error('Failed to delete camp');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = camps.filter(c =>
    c.campName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.district?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const districts = [...new Set(camps.map(c => c.district).filter(Boolean))];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-6 p-6">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
            Relief Camp Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium">
            Register, assign managers, and monitor active relief camps.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={openCreateModal}>
          New Camp
        </Button>
      </div>

      {/* ── Stat Row ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-800/50 border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400"><Tent size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Camps</p>
            <p className="text-2xl font-black text-white">{camps.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-black text-white">{camps.length}</p>
          </div>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400"><MapPin size={20} /></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Districts</p>
            <p className="text-2xl font-black text-white">{districts.length}</p>
          </div>
        </Card>
      </div>

      {/* ── Search ─────────────────────────────────────────────── */}
      <Card className="p-4 bg-slate-800/50 border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by camp name or district..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </Card>

      {/* ── Table ──────────────────────────────────────────────── */}
      <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 font-bold border-b border-slate-700">
                <th className="px-6 py-4">Camp</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Manager</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <RefreshCw className="animate-spin inline-block mr-2 text-cyan-500" />
                    <span className="text-slate-500 font-medium">Loading camps…</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                    {searchTerm
                      ? 'No camps match your search.'
                      : 'No camps registered yet. Click "New Camp" to add one.'}
                  </td>
                </tr>
              ) : (
                filtered.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                          <Tent size={16} />
                        </div>
                        <span className="font-bold text-slate-200">{camp.campName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-slate-400 text-xs">
                        <MapPin size={12} className="text-slate-600 shrink-0" />
                        <span className="line-clamp-2">{camp.address}, {camp.district}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {camp.manager ? (
                        <div>
                          <p className="text-slate-200 text-sm font-semibold">
                            {camp.manager.displayName || camp.manager.email}
                          </p>
                          <p className="text-slate-500 text-xs">{camp.manager.email}</p>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="active" size="sm">Active</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm" variant="ghost"
                          onClick={() => openEditModal(camp)}
                          icon={<Edit2 size={14} />}
                          className="text-sky-500"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm" variant="ghost"
                          onClick={() => handleDelete(camp.id, camp.campName)}
                          loading={actionLoading === camp.id}
                          icon={<Trash2 size={14} />}
                          className="text-rose-500"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Create / Edit Modal ────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingCamp ? 'Edit Camp' : 'Register New Camp'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Camp Details */}
              <div className="space-y-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Camp Details
                </h4>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">
                    Camp Name *
                  </label>
                  <input
                    required value={campName}
                    onChange={e => setCampName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                    placeholder="e.g. Colombo Central Relief"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">District *</label>
                    <input
                      required value={district}
                      onChange={e => setDistrict(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                      placeholder="e.g. Colombo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Address *</label>
                    <input
                      required value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500/50 outline-none"
                      placeholder="Full address"
                    />
                  </div>
                </div>
              </div>

              {/* Manager Section */}
              <div className="space-y-3 p-4 bg-blue-900/20 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                    Assign Camp Manager
                  </h4>
                  <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button 
                      type="button" 
                      onClick={() => setAssignMode('existing')} 
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded transition-colors ${assignMode === 'existing' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      Existing
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAssignMode('new')} 
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded transition-colors ${assignMode === 'new' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      New Account
                    </button>
                  </div>
                </div>

                {assignMode === 'existing' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-1">Select Active Responder</label>
                    <select
                      value={selectedManagerId}
                      onChange={e => setSelectedManagerId(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                    >
                      <option value="">-- Unassigned --</option>
                      {responders.map(r => (
                        <option key={r.id} value={r.id}>{r.displayName || r.username} ({r.email})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-1">Manager Name</label>
                      <input
                        value={managerName}
                        onChange={e => setManagerName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-1">Email</label>
                        <input
                          type="email" value={managerEmail}
                          onChange={e => setManagerEmail(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                          placeholder="manager@camp.lk"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-1">Password</label>
                        <input
                          type="password" value={managerPassword}
                          onChange={e => setManagerPassword(e.target.value)}
                          minLength={8}
                          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 outline-none"
                          placeholder="Min 8 chars"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button" variant="secondary" className="flex-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" loading={formLoading}>
                  {editingCamp ? 'Save Changes' : 'Create Camp'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCampsPage;
