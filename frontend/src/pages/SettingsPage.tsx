import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, Bell, Shield, Wind, Languages, 
  Moon, Sun, Monitor, Clock, Thermometer, Zap, 
  Globe, Save, UserCheck, ChevronRight, BellRing
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { usersApi } from '../api/endpoints';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { toast } from 'react-hot-toast';
import VerificationSection from '../components/settings/VerificationSection';

const SettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore() as any;
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'verification'>('general');
  const generalRef = useRef<HTMLDivElement | null>(null);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const verificationRef = useRef<HTMLDivElement | null>(null);

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
    notifSms: user?.notifSms ?? false,
    dndStart: user?.dndStart || '22:00',
    dndEnd: user?.dndEnd || '07:00',
  });

  const handlePrefChange = (key: string, value: any) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    try {
      setLoading(true);
      await usersApi.updatePreferences(prefs);
      if (!user) return;
      setUser({ ...user, ...prefs });
      toast.success('Preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (section: 'general' | 'notifications' | 'verification') => {
    setActiveSection(section);
    const targets: Record<'general' | 'notifications' | 'verification', React.RefObject<HTMLDivElement | null>> = {
      general: generalRef,
      notifications: notificationsRef,
      verification: verificationRef,
    };
    targets[section].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <button
              type="button"
              onClick={() => scrollToSection('general')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                activeSection === 'general'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Settings size={20} />
              General Preferences
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeSection === 'notifications'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  : 'text-slate-400 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Bell size={20} />
              Notifications & DND
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('verification')}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                activeSection === 'verification' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <UserCheck size={18} />
              <span className="font-medium">Verification & Security</span>
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Preferences Section */}
            <div ref={generalRef}>
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
            </div>

            {/* Notifications & DND */}
            <div ref={notificationsRef}>
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
            </div>

            {/* Alert Rules - Link to dedicated page */}
            <Link to="/alerts" className="block">
              <Card className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-amber-500/20 hover:border-amber-500/40 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <BellRing size={24} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        My Alert Rules
                        <ChevronRight size={18} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-sm text-slate-400">
                        Manage custom weather alerts with forecast aggregation
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-slate-500">Includes</p>
                    <p className="text-xs text-amber-400">MAX, SUM, AVG aggregations</p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Verification & Volunteer Section */}
            <div ref={verificationRef}>
              <VerificationSection />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default SettingsPage;
