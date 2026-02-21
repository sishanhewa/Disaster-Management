import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Plus, Pencil, Trash2, Shield, Save, X, Bell, BellOff } from 'lucide-react';

const API = 'http://localhost:8080/api/alerts';

interface Alert {
    id?: string;
    title: string;
    message: string;
    severity: string;
    active: boolean;
    createdAt?: string;
}

const EMPTY_ALERT: Alert = { title: '', message: '', severity: 'info', active: true };
const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', badge: 'bg-blue-600' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', badge: 'bg-yellow-600' },
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-300', badge: 'bg-red-600' },
};

const AlertsManager = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API);
            setAlerts(res.data);
        } catch (e) {
            console.error('Failed to fetch alerts', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAlerts(); }, []);

    const handleSave = async () => {
        if (!editingAlert?.title || !editingAlert?.message) return;
        setSaving(true);
        try {
            if (editingAlert.id) {
                await axios.put(`${API}/${editingAlert.id}`, editingAlert);
            } else {
                await axios.post(API, editingAlert);
            }
            setEditingAlert(null);
            setIsCreating(false);
            fetchAlerts();
        } catch (e) {
            console.error('Failed to save alert', e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this alert?')) return;
        try {
            await axios.delete(`${API}/${id}`);
            fetchAlerts();
        } catch (e) {
            console.error('Failed to delete alert', e);
        }
    };

    const handleToggleActive = async (alert: Alert) => {
        try {
            await axios.put(`${API}/${alert.id}`, { ...alert, active: !alert.active });
            fetchAlerts();
        } catch (e) {
            console.error('Failed to toggle alert', e);
        }
    };

    const openCreate = () => {
        setEditingAlert({ ...EMPTY_ALERT });
        setIsCreating(true);
    };

    const openEdit = (alert: Alert) => {
        setEditingAlert({ ...alert });
        setIsCreating(false);
    };

    const cancel = () => {
        setEditingAlert(null);
        setIsCreating(false);
    };

    const activeCount = alerts.filter(a => a.active).length;
    const criticalCount = alerts.filter(a => a.severity === 'critical' && a.active).length;

    return (
        <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900 via-orange-900 to-amber-900 p-6 border-b border-red-700">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-amber-300 flex items-center gap-3">
                            <Shield size={32} /> Disaster Risk Alerts
                        </h1>
                        <p className="text-red-300/70 mt-1">
                            Manage disaster warnings and risk alerts • {activeCount} active • {criticalCount} critical
                        </p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-lg"
                    >
                        <Plus size={18} /> New Alert
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                {/* Editor Modal */}
                {editingAlert && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            {isCreating ? <><Plus size={18} /> Create New Alert</> : <><Pencil size={18} /> Edit Alert</>}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Title *</label>
                                <input
                                    type="text"
                                    value={editingAlert.title}
                                    onChange={(e) => setEditingAlert({ ...editingAlert, title: e.target.value })}
                                    placeholder="e.g., Flood Warning — Kelani Ganga"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Severity *</label>
                                    <select
                                        value={editingAlert.severity}
                                        onChange={(e) => setEditingAlert({ ...editingAlert, severity: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500"
                                    >
                                        <option value="info">ℹ️ Info</option>
                                        <option value="warning">⚠️ Warning</option>
                                        <option value="critical">🚨 Critical</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editingAlert.active}
                                            onChange={(e) => setEditingAlert({ ...editingAlert, active: e.target.checked })}
                                            className="w-4 h-4 rounded"
                                        />
                                        <span className="text-sm text-slate-300">Active</span>
                                    </label>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-1 block">Message *</label>
                                <textarea
                                    value={editingAlert.message}
                                    onChange={(e) => setEditingAlert({ ...editingAlert, message: e.target.value })}
                                    placeholder="Describe the alert details, affected areas, and recommended actions..."
                                    rows={3}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                            <button onClick={cancel} className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 transition">
                                <X size={14} /> Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !editingAlert.title || !editingAlert.message}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={14} /> {saving ? 'Saving...' : isCreating ? 'Create Alert' : 'Update Alert'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Alerts List */}
                {loading ? (
                    <div className="text-center py-12 text-slate-400 animate-pulse">Loading alerts from database...</div>
                ) : alerts.length === 0 ? (
                    <div className="text-center py-16 text-slate-500">
                        <AlertTriangle size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No alerts found. Click "New Alert" to create one.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alerts.map(alert => {
                            const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
                            return (
                                <div
                                    key={alert.id}
                                    className={`rounded-xl border p-4 transition ${alert.active
                                            ? `${style.bg} ${style.border}`
                                            : 'bg-slate-800/40 border-slate-700/50 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className={`text-base font-bold ${alert.active ? style.text : 'text-slate-500'}`}>
                                                    {alert.title}
                                                </h3>
                                                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded text-white ${style.badge}`}>
                                                    {alert.severity}
                                                </span>
                                                {!alert.active && (
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-400">
                                                        INACTIVE
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm mt-1 ${alert.active ? 'text-slate-300' : 'text-slate-500'}`}>
                                                {alert.message}
                                            </p>
                                            <p className="text-[10px] text-slate-500 mt-2">
                                                Created: {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : '—'}
                                                {alert.id && <span className="ml-3">ID: {alert.id.substring(0, 8)}...</span>}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => handleToggleActive(alert)}
                                                className={`p-2 rounded-lg transition ${alert.active ? 'hover:bg-slate-700 text-yellow-400' : 'hover:bg-slate-700 text-emerald-400'}`}
                                                title={alert.active ? 'Deactivate' : 'Activate'}
                                            >
                                                {alert.active ? <BellOff size={16} /> : <Bell size={16} />}
                                            </button>
                                            <button
                                                onClick={() => openEdit(alert)}
                                                className="p-2 rounded-lg hover:bg-slate-700 text-blue-400 transition"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(alert.id!)}
                                                className="p-2 rounded-lg hover:bg-red-900/30 text-red-400 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsManager;
