import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AlertTriangle, Plus, Pencil, Trash2, MapPin, Users, Skull, DollarSign,
    Save, X, CheckCircle, Clock, Siren, Shield, Filter, ChevronDown, ChevronUp
} from 'lucide-react';
import IncidentMap from './IncidentMap';

const API = 'http://localhost:8080/api/incidents';

const DISTRICTS = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Mullaitivu', 'Vavuniya', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
];

const HAZARDS = [
    { value: 'Flood', icon: '🌊', color: 'text-blue-400' },
    { value: 'Landslide', icon: '⛰️', color: 'text-amber-400' },
    { value: 'Cyclone', icon: '🌀', color: 'text-purple-400' },
    { value: 'Drought', icon: '☀️', color: 'text-orange-400' },
    { value: 'Tsunami', icon: '🌊', color: 'text-red-400' },
    { value: 'Earthquake', icon: '📳', color: 'text-yellow-400' },
    { value: 'Accident', icon: '🚗', color: 'text-slate-400' },
    { value: 'Fire', icon: '🔥', color: 'text-orange-500' },
    { value: 'Building Collapse', icon: '🏗️', color: 'text-slate-500' },
    { value: 'Epidemic', icon: '🦠', color: 'text-emerald-400' },
    { value: 'Other', icon: '❓', color: 'text-slate-300' },
];

const SEVERITY_CONFIG: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-600' },
    moderate: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', badge: 'bg-yellow-600' },
    high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-600' },
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-600' },
};

const STATUS_CONFIG: Record<string, { icon: any; text: string; color: string }> = {
    reported: { icon: Siren, text: 'Reported', color: 'text-red-400' },
    responding: { icon: Shield, text: 'Responding', color: 'text-orange-400' },
    contained: { icon: Clock, text: 'Contained', color: 'text-yellow-400' },
    resolved: { icon: CheckCircle, text: 'Resolved', color: 'text-emerald-400' },
};

interface Incident {
    id?: string;
    title: string;
    district: string;
    hazardType: string;
    severity: string;
    affectedPeople: number;
    casualties: number;
    damageEstimateLkr: number;
    responseStatus: string;
    description: string;
    latitude: number | null;
    longitude: number | null;
    reportedBy: string;
    incidentDate: string;
    createdAt?: string;
}

const EMPTY: Incident = {
    title: '', district: 'Colombo', hazardType: 'Flood', severity: 'moderate',
    affectedPeople: 0, casualties: 0, damageEstimateLkr: 0, responseStatus: 'reported',
    description: '', latitude: null, longitude: null, reportedBy: '',
    incidentDate: new Date().toISOString().slice(0, 16),
};

const IncidentTracker = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Incident | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterHazard, setFilterHazard] = useState('all');
    const [expanded, setExpanded] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API);
            setIncidents(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const validateForm = (): boolean => {
        setValidationError(null);
        if (!editing) return false;
        
        if (!editing.title || editing.title.trim().length < 3) {
            setValidationError('Title must be at least 3 characters long.');
            return false;
        }
        if (editing.affectedPeople < 0) {
            setValidationError('Affected people cannot be negative.');
            return false;
        }
        if (editing.casualties < 0) {
            setValidationError('Casualties cannot be negative.');
            return false;
        }
        if (editing.damageEstimateLkr < 0) {
            setValidationError('Damage estimate cannot be negative.');
            return false;
        }
        if (editing.incidentDate) {
            const date = new Date(editing.incidentDate);
            if (date.getTime() > Date.now()) {
                setValidationError('Incident date cannot be in the future.');
                return false;
            }
        }
        return true;
    };

    const save = async () => {
        if (!editing || !validateForm()) return;
        setSaving(true);
        try {
            if (editing.id) {
                await axios.put(`${API}/${editing.id}`, editing);
            } else {
                await axios.post(API, editing);
            }
            setEditing(null); setIsNew(false); fetchAll();
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    const remove = async (id: string) => {
        if (!confirm('Delete this incident record permanently?')) return;
        try { await axios.delete(`${API}/${id}`); fetchAll(); } catch (e) { console.error(e); }
    };

    const filtered = incidents.filter(i =>
        (filterStatus === 'all' || i.responseStatus === filterStatus) &&
        (filterHazard === 'all' || i.hazardType === filterHazard)
    );

    // Stats
    const activeCount = incidents.filter(i => i.responseStatus !== 'resolved').length;
    const totalAffected = incidents.reduce((s, i) => s + (i.affectedPeople || 0), 0);
    const totalCasualties = incidents.reduce((s, i) => s + (i.casualties || 0), 0);
    const totalDamage = incidents.reduce((s, i) => s + (i.damageEstimateLkr || 0), 0);

    return (
        <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-900 via-orange-900 to-amber-900 p-6 border-b border-red-700">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-amber-300 flex items-center gap-3">
                            <Siren size={32} /> Disaster Incident Tracker
                        </h1>
                        <p className="text-red-300/70 mt-1">
                            Record, track, and manage disaster events across Sri Lanka
                        </p>
                    </div>
                    <button onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }}
                        className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-lg">
                        <Plus size={18} /> Report Incident
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                
                {/* Embedded Geospatial Map */}
                <div className="mb-6">
                    <IncidentMap 
                        incidents={filtered} 
                        isReportingMode={!!editing}
                        selectedLat={editing?.latitude}
                        selectedLon={editing?.longitude}
                        onLocationSelect={(lat, lon) => {
                            if (editing) setEditing({...editing, latitude: lat, longitude: lon});
                        }}
                    />
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                        <AlertTriangle size={20} className="text-red-400 mx-auto mb-1" />
                        <p className="text-2xl font-black text-red-400">{activeCount}</p>
                        <p className="text-[10px] uppercase text-slate-500 tracking-widest">Active Incidents</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                        <Users size={20} className="text-blue-400 mx-auto mb-1" />
                        <p className="text-2xl font-black text-blue-300">{totalAffected.toLocaleString()}</p>
                        <p className="text-[10px] uppercase text-slate-500 tracking-widest">People Affected</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                        <Skull size={20} className="text-orange-400 mx-auto mb-1" />
                        <p className="text-2xl font-black text-orange-300">{totalCasualties}</p>
                        <p className="text-[10px] uppercase text-slate-500 tracking-widest">Casualties</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center">
                        <DollarSign size={20} className="text-emerald-400 mx-auto mb-1" />
                        <p className="text-2xl font-black text-emerald-300">Rs.{(totalDamage / 1e6).toFixed(1)}M</p>
                        <p className="text-[10px] uppercase text-slate-500 tracking-widest">Damage Estimate</p>
                    </div>
                </div>

                {/* Create/Edit Form */}
                {editing && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            {isNew ? <><Plus size={18} /> Report New Incident</> : <><Pencil size={18} /> Edit Incident</>}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Incident Title *</label>
                                <input type="text" value={editing.title}
                                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                                    placeholder="e.g., Flash flood in Ratnapura town center"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Incident Date *</label>
                                <input type="datetime-local" value={editing.incidentDate}
                                    onChange={e => setEditing({ ...editing, incidentDate: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">District *</label>
                                <select value={editing.district} onChange={e => setEditing({ ...editing, district: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500">
                                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Incident Type *</label>
                                <select value={editing.hazardType} onChange={e => setEditing({ ...editing, hazardType: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500">
                                    {HAZARDS.map(h => <option key={h.value} value={h.value}>{h.icon} {h.value}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Severity *</label>
                                <select value={editing.severity} onChange={e => setEditing({ ...editing, severity: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500">
                                    <option value="low">🟢 Low</option>
                                    <option value="moderate">🟡 Moderate</option>
                                    <option value="high">🟠 High</option>
                                    <option value="critical">🔴 Critical</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Response Status</label>
                                <select value={editing.responseStatus} onChange={e => setEditing({ ...editing, responseStatus: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500">
                                    <option value="reported">🚨 Reported</option>
                                    <option value="responding">🛡️ Responding</option>
                                    <option value="contained">⏳ Contained</option>
                                    <option value="resolved">✅ Resolved</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Affected People</label>
                                <input type="number" min={0} value={editing.affectedPeople}
                                    onChange={e => setEditing({ ...editing, affectedPeople: +e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Casualties</label>
                                <input type="number" min={0} value={editing.casualties}
                                    onChange={e => setEditing({ ...editing, casualties: +e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Damage Estimate (LKR)</label>
                                <input type="number" min={0} value={editing.damageEstimateLkr}
                                    onChange={e => setEditing({ ...editing, damageEstimateLkr: +e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Reported By</label>
                                <input type="text" value={editing.reportedBy}
                                    onChange={e => setEditing({ ...editing, reportedBy: e.target.value })}
                                    placeholder="Name or agency"
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Location Coordinates</label>
                                <div className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-400 flex items-center justify-between">
                                    <span>
                                        {editing.latitude ? `${editing.latitude.toFixed(4)}, ${editing.longitude?.toFixed(4)}` : 'Click map to pin (Optional)'}
                                    </span>
                                    <MapPin size={14} className={editing.latitude ? 'text-blue-400' : 'text-slate-600'} />
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Description</label>
                                <textarea value={editing.description} rows={2}
                                    onChange={e => setEditing({ ...editing, description: e.target.value })}
                                    placeholder="Detailed description of the incident, impact, and actions taken..."
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 items-end">
                            {validationError && (
                                <p className="text-red-400 text-xs font-bold bg-red-500/10 px-3 py-1.5 rounded border border-red-500/20">
                                    ⚠️ {validationError}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => { setEditing(null); setIsNew(false); setValidationError(null); }}
                                    className="px-4 py-2 rounded-lg border border-slate-600 text-slate-400 hover:text-slate-200 text-sm flex items-center gap-1 transition">
                                    <X size={14} /> Cancel
                                </button>
                                <button onClick={save}
                                    disabled={saving || !editing.title || !editing.district}
                                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 transition disabled:opacity-50">
                                    <Save size={14} /> {saving ? 'Saving...' : isNew ? 'Create Incident' : 'Update Incident'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-4 items-center">
                    <Filter size={14} className="text-slate-500" />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500">
                        <option value="all">All Statuses</option>
                        <option value="reported">🚨 Reported</option>
                        <option value="responding">🛡️ Responding</option>
                        <option value="contained">⏳ Contained</option>
                        <option value="resolved">✅ Resolved</option>
                    </select>
                    <select value={filterHazard} onChange={e => setFilterHazard(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500">
                        <option value="all">All Incident Types</option>
                        {HAZARDS.map(h => <option key={h.value} value={h.value}>{h.icon} {h.value}</option>)}
                    </select>
                    <span className="text-xs text-slate-500 ml-auto">{filtered.length} of {incidents.length} incidents</span>
                </div>

                {/* Incidents List */}
                {loading ? (
                    <div className="py-16 text-center text-slate-400 animate-pulse">Loading incidents from database...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center text-slate-500">
                        <Siren size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No incidents found. Click "Report Incident" to log one.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(inc => {
                            const sev = SEVERITY_CONFIG[inc.severity] || SEVERITY_CONFIG.moderate;
                            const status = STATUS_CONFIG[inc.responseStatus] || STATUS_CONFIG.reported;
                            const StatusIcon = status.icon;
                            const hazard = HAZARDS.find(h => h.value === inc.hazardType);
                            const isExpanded = expanded === inc.id;

                            return (
                                <div key={inc.id} className={`rounded-xl border transition ${sev.bg} ${sev.border}`}>
                                    {/* Main Row */}
                                    <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : inc.id!)}>
                                        {/* Hazard icon */}
                                        <div className="text-2xl flex-shrink-0">{hazard?.icon || '⚠️'}</div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className={`text-sm font-bold ${sev.text}`}>{inc.title}</h3>
                                                <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded text-white ${sev.badge}`}>{inc.severity}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                                                <span className="flex items-center gap-1"><MapPin size={10} /> {inc.district}</span>
                                                <span>{inc.hazardType}</span>
                                                <span className={`flex items-center gap-1 ${status.color}`}>
                                                    <StatusIcon size={10} /> {status.text}
                                                </span>
                                                <span>{inc.incidentDate ? new Date(inc.incidentDate).toLocaleDateString() : ''}</span>
                                            </div>
                                        </div>

                                        {/* Quick Stats */}
                                        <div className="hidden md:flex gap-4 text-center flex-shrink-0">
                                            <div>
                                                <p className="text-xs font-bold text-blue-300">{(inc.affectedPeople || 0).toLocaleString()}</p>
                                                <p className="text-[9px] text-slate-500">Affected</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-orange-300">{inc.casualties || 0}</p>
                                                <p className="text-[9px] text-slate-500">Casualties</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-emerald-300">Rs.{((inc.damageEstimateLkr || 0) / 1e6).toFixed(1)}M</p>
                                                <p className="text-[9px] text-slate-500">Damage</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button onClick={e => { e.stopPropagation(); setEditing({ ...inc }); setIsNew(false); }}
                                                className="p-2 rounded-lg hover:bg-slate-700/50 text-blue-400 transition" title="Edit">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={e => { e.stopPropagation(); remove(inc.id!); }}
                                                className="p-2 rounded-lg hover:bg-red-900/30 text-red-400 transition" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                            {isExpanded ? <ChevronUp size={14} className="self-center text-slate-500" /> : <ChevronDown size={14} className="self-center text-slate-500" />}
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                                <div className="bg-slate-900/50 rounded-lg p-2.5">
                                                    <p className="text-[9px] text-slate-500 uppercase">Affected People</p>
                                                    <p className="text-sm font-bold text-blue-300">{(inc.affectedPeople || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="bg-slate-900/50 rounded-lg p-2.5">
                                                    <p className="text-[9px] text-slate-500 uppercase">Casualties</p>
                                                    <p className="text-sm font-bold text-orange-300">{inc.casualties || 0}</p>
                                                </div>
                                                <div className="bg-slate-900/50 rounded-lg p-2.5">
                                                    <p className="text-[9px] text-slate-500 uppercase">Damage Estimate</p>
                                                    <p className="text-sm font-bold text-emerald-300">Rs. {(inc.damageEstimateLkr || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="bg-slate-900/50 rounded-lg p-2.5">
                                                    <p className="text-[9px] text-slate-500 uppercase">Reported By</p>
                                                    <p className="text-sm font-bold text-slate-300">{inc.reportedBy || '—'}</p>
                                                </div>
                                            </div>
                                            {inc.description && (
                                                <div className="mt-3 bg-slate-900/50 rounded-lg p-3">
                                                    <p className="text-[9px] text-slate-500 uppercase mb-1">Description</p>
                                                    <p className="text-xs text-slate-300 leading-relaxed">{inc.description}</p>
                                                </div>
                                            )}
                                            <p className="text-[9px] text-slate-600 mt-2">
                                                ID: {inc.id?.substring(0, 8)}... • Created: {inc.createdAt ? new Date(inc.createdAt).toLocaleString() : '—'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IncidentTracker;
