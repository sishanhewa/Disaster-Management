import React, { useState, useEffect } from 'react';
import { 
  Bell, Plus, Edit2, Trash2, Power, AlertTriangle, 
  Clock, Zap, Loader2, Info, TrendingUp, TrendingDown,
  Activity, MapPin, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { alertRulesApi } from '../api/endpoints';
import { Badge } from '../components/common/Badge';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import CreateAlertRuleModal from '../components/settings/CreateAlertRuleModal';
import { toast } from 'react-hot-toast';

// Aggregation type display mapping
const AGGREGATION_DISPLAY: Record<string, { label: string; icon: React.ReactNode; desc: string }> = {
  'CURRENT': { label: 'Current', icon: <Activity size={14} />, desc: 'Current value only' },
  'MAX': { label: 'Maximum', icon: <TrendingUp size={14} />, desc: 'Highest value in window' },
  'MIN': { label: 'Minimum', icon: <TrendingDown size={14} />, desc: 'Lowest value in window' },
  'AVG': { label: 'Average', icon: <Activity size={14} />, desc: 'Average across window' },
  'SUM': { label: 'Total', icon: <Zap size={14} />, desc: 'Accumulated sum (rainfall, etc.)' },
};

// Window hour display
const WINDOW_DISPLAY: Record<number, string> = {
  1: 'Current (1h)',
  3: 'Next 3 hours',
  6: 'Next 6 hours',
  12: 'Next 12 hours',
  24: 'Next 24 hours',
  48: 'Next 2 days',
  72: 'Next 3 days',
  168: 'Next week',
};

// Parameter display mapping
const PARAMETER_DISPLAY: Record<string, { label: string; unit: string }> = {
  'precipitation_mm': { label: 'Precipitation', unit: 'mm' },
  'temp_c': { label: 'Temperature', unit: '°C' },
  'wind_speed_kmh': { label: 'Wind Speed', unit: 'km/h' },
  'humidity_pct': { label: 'Humidity', unit: '%' },
  'pressure_hpa': { label: 'Pressure', unit: 'hPa' },
  'uv_index': { label: 'UV Index', unit: '' },
  'cloud_cover_pct': { label: 'Cloud Cover', unit: '%' },
};

const AlertsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [alertRules, setAlertRules] = useState<any[]>([]);
  const [fetchingRules, setFetchingRules] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);

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
      toast.error('Failed to load alert rules');
    } finally {
      setFetchingRules(false);
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

  const formatOperator = (op: string) => {
    switch (op) {
      case 'GT': case '>': return '>';
      case 'LT': case '<': return '<';
      case 'GTE': case '>=': return '≥';
      case 'LTE': case '<=': return '≤';
      case 'EQ': case '=': return '=';
      default: return op;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-700/50">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">My Alert Rules</h1>
              <p className="text-slate-400 text-sm mt-1">
                Custom weather alerts with forecast aggregation
              </p>
            </div>
          </div>
        </div>
        <Button 
          onClick={openCreateModal} 
          icon={<Plus size={18} />}
          className="shrink-0"
        >
          Create New Rule
        </Button>
      </div>

      {/* How It Works Info Card */}
      <Card className="p-5 bg-gradient-to-r from-slate-800/80 to-slate-800/40 border-slate-700/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
            <Info size={20} className="text-blue-400" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white">How Alert Rules Work</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Alert rules monitor weather forecasts for your chosen locations. 
              Unlike simple "current weather" alerts, these evaluate <span className="text-emerald-400 font-medium">forecast windows</span> using
              aggregation like MAX (maximum), SUM (total rainfall), or AVG (average temperature).
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-1 rounded-md bg-slate-900/50 text-xs text-slate-500 font-mono border border-slate-700">
                Example: "Alert me if rain SUM exceeds 50mm in next 6 hours"
              </span>
              <span className="px-2 py-1 rounded-md bg-slate-900/50 text-xs text-slate-500 font-mono border border-slate-700">
                Example: "Alert me if temp MAX exceeds 40°C in next 24 hours"
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Rules</p>
          <p className="text-2xl font-black text-white mt-1">{alertRules.length}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {alertRules.filter(r => r.isActive).length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Triggered (7d)</p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {alertRules.filter(r => r.lastTriggeredAt && 
              new Date(r.lastTriggeredAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Limit</p>
          <p className="text-2xl font-black text-slate-400 mt-1">{alertRules.length}/20</p>
        </div>
      </div>

      {/* Alert Rules List */}
      <Card className="p-6 bg-slate-800/50 border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            Your Alert Rules
          </h3>
          {alertRules.length > 0 && (
            <span className="text-sm text-slate-500">
              {alertRules.filter(r => r.isActive).length} active
            </span>
          )}
        </div>

        <div className="space-y-3">
          {fetchingRules ? (
            <div className="flex flex-col items-center py-16 text-slate-500">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p>Loading your alert rules...</p>
            </div>
          ) : alertRules.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Bell size={28} className="text-slate-600" />
              </div>
              <h4 className="text-white font-bold mb-2">No alert rules yet</h4>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                Create custom alerts to get notified when weather conditions match your criteria.
                Monitor rainfall, temperature, wind speed, and more.
              </p>
              <Button size="sm" onClick={openCreateModal} icon={<Plus size={16} />}>
                Create Your First Rule
              </Button>
            </div>
          ) : (
            alertRules.map(rule => {
              const aggInfo = AGGREGATION_DISPLAY[rule.aggregationType] || AGGREGATION_DISPLAY['CURRENT'];
              const paramInfo = PARAMETER_DISPLAY[rule.parameter] || { label: rule.parameter, unit: '' };
              const windowLabel = WINDOW_DISPLAY[rule.forecastWindowHours] || `Next ${rule.forecastWindowHours} hours`;
              
              return (
                <div 
                  key={rule.id} 
                  className={`group p-5 rounded-xl border transition-all hover:border-slate-600 ${
                    rule.isActive 
                      ? 'bg-slate-900/50 border-slate-700' 
                      : 'bg-slate-900/20 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Rule Header */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-bold text-white text-lg">{rule.name}</h4>
                        <Badge variant={rule.isActive ? 'active' : 'neutral'} size="sm">
                          {rule.isActive ? 'Active' : 'Paused'}
                        </Badge>
                        {rule.severityThreshold && (
                          <Badge 
                            variant={rule.severityThreshold === 'EXTREME' ? 'error' : 
                                     rule.severityThreshold === 'CRITICAL' ? 'warning' : 'info'} 
                            size="sm"
                          >
                            {rule.severityThreshold}
                          </Badge>
                        )}
                      </div>

                      {/* Rule Condition */}
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="text-slate-400">When</span>
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-xs">
                          {aggInfo.label}
                        </span>
                        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 font-medium">
                          {paramInfo.label}
                        </span>
                        <span className="text-slate-400 font-mono">
                          {formatOperator(rule.operator)} {rule.threshold}{paramInfo.unit}
                        </span>
                        <span className="text-slate-500">in</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin size={12} className="text-slate-500" />
                          {rule.spatialUnitName}
                        </span>
                      </div>

                      {/* Rule Details Row */}
                      <div className="flex flex-wrap items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock size={12} />
                          <span>{windowLabel}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          {aggInfo.icon}
                          <span>{aggInfo.desc}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Bell size={12} />
                          <span>Cooldown: {rule.cooldownHours}h</span>
                        </div>
                        {rule.lastTriggeredAt && (
                          <div className="flex items-center gap-1.5 text-xs text-amber-500/80">
                            <Zap size={12} />
                            <span>Last: {new Date(rule.lastTriggeredAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => toggleRule(rule.id)}
                        className={`p-2.5 rounded-lg transition-colors ${
                          rule.isActive 
                            ? 'text-amber-500 hover:bg-amber-500/10' 
                            : 'text-emerald-500 hover:bg-emerald-500/10'
                        }`}
                        title={rule.isActive ? 'Pause Rule' : 'Activate Rule'}
                      >
                        <Power size={18} />
                      </button>
                      <button 
                        onClick={() => openEditModal(rule)}
                        className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Rule"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteRule(rule.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Rule"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-slate-800/30 border-slate-700/50">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            MAX Aggregation
          </h4>
          <p className="text-sm text-slate-400">
            Use for "peak" conditions. Example: "Alert if temperature reaches 40°C at any point in next 24 hours."
          </p>
        </Card>
        <Card className="p-5 bg-slate-800/30 border-slate-700/50">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Zap size={16} className="text-blue-500" />
            SUM Aggregation
          </h4>
          <p className="text-sm text-slate-400">
            Use for accumulated values. Example: "Alert if total rainfall exceeds 100mm over next 3 days."
          </p>
        </Card>
        <Card className="p-5 bg-slate-800/30 border-slate-700/50">
          <h4 className="font-bold text-white mb-2 flex items-center gap-2">
            <Activity size={16} className="text-amber-500" />
            AVG Aggregation
          </h4>
          <p className="text-sm text-slate-400">
            Use for sustained conditions. Example: "Alert if average humidity stays above 85% for 12 hours."
          </p>
        </Card>
      </div>

      <CreateAlertRuleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAlertRules}
        initialData={editingRule}
      />
    </div>
  );
};

export default AlertsPage;
