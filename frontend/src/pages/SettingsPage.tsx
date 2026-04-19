import React, { useState, useEffect } from 'react';
import { 
  Settings, Bell, Shield, Wind, Languages, 
  Moon, Sun, Monitor, Clock, Plus, Edit2, Trash2, 
  Power, AlertTriangle, Thermometer, Zap, Loader2, Globe, Save
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usersApi, alertRulesApi } from '../api/endpoints';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-hot-toast';
import CreateAlertRuleModal from '../components/settings/CreateAlertRuleModal';

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore() as any; // Cast to any to bypass temporary store sync issues if any
  const [loading, setLoading] = useState(false);
  const [alertRules, setAlertRules] = useState<any[]>([]);
  const [fetchingRules, setFetchingRules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

  // Local state for preferences to avoid too many store updates
  const [prefs, setPrefs] = useState({
    unitTemp: user?.unitTemp || 'C',
    unitWind: user?.unitWind || 'km/h',
    unitPrecip: user?.unitPrecip || 'mm',
    language: user?.language || 'en',
    theme: user?.theme || 'dark',
    notifEmail: user?.notifEmail ?? true,
    notifPush: user?.notifPush ?? true,
    notifInapp: user?.notifInapp ?? true,
    dndStart: user?.dndStart || '22:00',
    dndEnd: user?.dndEnd || '07:00',
  });

  useEffect(() => {
    fetchAlertRules();
  }, []);

  const fetchAlertRules = async () => {
    try {
      setFetchingRules(true);
      const data = await alertRulesApi.getAlertRules();
      setAlertRules(data);
    } catch (error) {
      console.error('Failed to fetch alert rules', error);
    } finally {
      setFetchingRules(false);
    }
  };

  const handlePrefChange = (key: string, value: any) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      await usersApi.updatePreferences(prefs);
      // Update local store as well
      if (!user) return;
      setUser({ ...user, ...prefs });
      toast.success('Preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (id: string) => {
    try {
      await alertRulesApi.toggleAlertRule(id);
      fetchAlertRules();
      toast.success('Rule toggled');
    } catch (error) {
      toast.error('Failed to toggle rule');
    }
  };

  const deleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert rule?')) return;
    try {
      await alertRulesApi.deleteAlertRule(id);
      setAlertRules(prev => prev.filter(r => r.id !== id));
      toast.success('Rule deleted');
    } catch (error) {
      toast.error('Failed to delete rule');
    }
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rule: any) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] p-6 rounded-xl border border-slate-700 font-sans space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            System Settings
          </h1>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            Preferences and system configurations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Navigation (Visual Only for now) */}
          <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-left font-medium">
              <Settings size={20} />
              General Preferences
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg text-left transition-colors">
              <Bell size={20} />
              Notifications & DND
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg text-left transition-colors">
              <Shield size={20} />
              Privacy & Security
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Preferences Section */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Settings size={18} className="text-emerald-500" />
                Units & Language
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Thermometer size={14} /> Temperature Unit
                  </label>
                  <div className="flex p-1 bg-slate-900/50 border border-slate-700 rounded-lg">
                    {['C', 'F'].map(u => (
                      <button
                        key={u}
                        onClick={() => handlePrefChange('unitTemp', u)}
                        className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${
                          prefs.unitTemp === u ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        °{u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Wind size={14} /> Wind Speed Unit
                  </label>
                  <select 
                    value={prefs.unitWind}
                    onChange={(e) => handlePrefChange('unitWind', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  >
                    <option value="km/h">km/h</option>
                    <option value="m/s">m/s</option>
                    <option value="mph">mph</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Languages size={14} /> Language
                  </label>
                  <select 
                    value={prefs.language}
                    onChange={(e) => handlePrefChange('language', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  >
                    <option value="en">English</option>
                    <option value="si">Sinhala (සිංහල)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                  </select>
                </div>

              </div>

              <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-end">
                <Button onClick={savePreferences} loading={loading}>
                  Save Preferences
                </Button>
              </div>
            </Card>

            {/* Notifications & DND */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Bell size={18} className="text-emerald-500" />
                Notification Channels
              </h3>

              <div className="space-y-4">
                {[
                  { id: 'notifEmail', label: 'Email Notifications', desc: 'Receive critical alerts via your registered email' },
                  { id: 'notifPush', label: 'Push Notifications', desc: 'Real-time browser notifications for weather updates' },
                  { id: 'notifInapp', label: 'In-App Notifications', desc: 'Alerts and updates within the SIDMS platform' },
                ].map(n => (
                  <div key={n.id} className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-700/50">
                    <div>
                      <p className="text-white font-medium">{n.label}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => handlePrefChange(n.id, !((prefs as any)[n.id]))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-2 ring-offset-2 ring-offset-slate-900 ${
                        (prefs as any)[n.id] ? 'bg-emerald-500 ring-emerald-500/50' : 'bg-slate-700 ring-slate-700/50'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        (prefs as any)[n.id] ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <Clock size={14} className="text-amber-500" /> Do Not Disturb (DND)
                </h4>
                <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">From</label>
                    <input 
                      type="time" 
                      value={prefs.dndStart}
                      onChange={(e) => handlePrefChange('dndStart', e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:ring-0 p-0 text-xl font-medium"
                    />
                  </div>
                  <div className="w-px h-8 bg-slate-700" />
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">To</label>
                    <input 
                      type="time" 
                      value={prefs.dndEnd}
                      onChange={(e) => handlePrefChange('dndEnd', e.target.value)}
                      className="w-full bg-transparent border-none text-white focus:ring-0 p-0 text-xl font-medium"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-slate-500 italic">Critical disaster warnings will bypass DND settings.</p>
              </div>
            </Card>

            {/* Alert Rules Section */}
            <Card className="p-6 bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Custom Alert Rules
                </h3>
                <Button size="sm" icon={<Plus size={16} />} onClick={openCreateModal}>
                  Create Rule
                </Button>
              </div>

              <div className="space-y-3">
                {fetchingRules ? (
                  <div className="flex flex-col items-center py-12 text-slate-500">
                    <Loader2 className="animate-spin mb-4" />
                    <p>Fetching your custom rules...</p>
                  </div>
                ) : alertRules.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
                    <Zap size={32} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-500 text-sm">No alert rules configured yet.</p>
                    <button onClick={openCreateModal} className="mt-2 text-emerald-500 text-sm font-bold hover:underline">
                      Add your first rule
                    </button>
                  </div>
                ) : (
                  alertRules.map(rule => (
                    <div key={rule.id} className={`p-4 rounded-xl border transition-all ${
                      rule.isActive ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-900/20 border-slate-800 opacity-60'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white">{rule.name}</h4>
                            <Badge variant={rule.isActive ? 'active' : 'neutral'} size="sm">
                              {rule.isActive ? 'Active' : 'Paused'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">
                            Triggers when <span className="text-emerald-400 font-mono">{rule.parameter}</span> {rule.operator} {rule.threshold} in <span className="text-white">{rule.spatialUnitName}</span>
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Clock size={10} /> Cooldown: {rule.cooldownHours}h
                            </span>
                            {rule.lastTriggeredAt && (
                              <span className="text-[10px] text-amber-500/80 flex items-center gap-1">
                                <Zap size={10} /> Last triggered: {new Date(rule.lastTriggeredAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleRule(rule.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              rule.isActive ? 'text-amber-500 hover:bg-amber-500/10' : 'text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                            title={rule.isActive ? 'Pause' : 'Activate'}
                          >
                            <Power size={16} />
                          </button>
                          <button 
                            onClick={() => openEditModal(rule)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteRule(rule.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <CreateAlertRuleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAlertRules}
        initialData={editingRule}
      />
    </>
  );
};

export default SettingsPage;
