import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Legend
} from 'recharts';
import { 
  TrendingUp,
  CloudRain,
  AlertTriangle,
  Calendar,
  History,
  Info,
  Thermometer,
  Loader2,
  ShieldAlert,
  Radar,
  Gauge,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { analyticsApi } from '../../api/endpoints';
import { SpatialUnitSearch } from '../../components/common/SpatialUnitSearch';
import { StatCard } from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

const CHART_COLORS = {
  temp: '#38BDF8',
  precip: '#34D399',
  forecast: '#A78BFA',
  upper: '#F59E0B',
  lower: '#3B82F6',
};

export default function AnalyticsPage() {
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'patterns'>('overview');
  const [showBriefing, setShowBriefing] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analyticsOverview', selectedUnit?.id],
    queryFn: () => analyticsApi.getOverview(selectedUnit.id),
    enabled: !!selectedUnit?.id,
  });

  const { data: accuracy } = useQuery({
    queryKey: ['analyticsAccuracy', selectedUnit?.id],
    queryFn: () => analyticsApi.getForecastAccuracy(selectedUnit.id, { days: 30, metric: 'all' }),
    enabled: !!selectedUnit?.id,
  });

  const { data: forecastHistory } = useQuery({
    queryKey: ['analyticsForecastHistory', selectedUnit?.id],
    queryFn: () => analyticsApi.getForecastHistory(selectedUnit.id, 'precipitation', { days: 30 }),
    enabled: !!selectedUnit?.id,
  });

  const historicalTrend = analytics?.historicalTrend || [];
  const forecast = analytics?.forecast || [];
  const anomalies = analytics?.anomalies || [];
  const monthlyAverages = analytics?.monthlyAverages || [];

  const trendSummary = useMemo(() => {
    if (historicalTrend.length < 2) return { deltaTemp: 0, deltaRain: 0 };
    const first = historicalTrend[0];
    const last = historicalTrend[historicalTrend.length - 1];
    return {
      deltaTemp: (last.tempMean ?? 0) - (first.tempMean ?? 0),
      deltaRain: (last.precipMm ?? 0) - (first.precipMm ?? 0),
    };
  }, [historicalTrend]);

  const simpleBriefing = useMemo(() => {
    if (!analytics) return '';

    const riskCount = anomalies.length;
    const rainDays = forecast.filter((f: any) => (f.predictedPrecip ?? 0) >= 5).length;
    const tempDirection = trendSummary.deltaTemp > 0.5 ? 'warming' : trendSummary.deltaTemp < -0.5 ? 'cooling' : 'stable';

    const lines = [
      `Temperature is currently ${tempDirection} over the recent period.`,
      rainDays > 0
        ? `Forecast suggests ${rainDays} wetter day${rainDays > 1 ? 's' : ''} in the next two weeks.`
        : 'Forecast suggests mostly low-rainfall conditions for the next two weeks.',
      riskCount > 0
        ? `There ${riskCount === 1 ? 'is' : 'are'} ${riskCount} active anomaly signal${riskCount > 1 ? 's' : ''} to monitor.`
        : 'No strong anomaly signals detected right now.',
      `Warning history includes ${analytics.warningHistory?.totalWarnings ?? 0} total warnings for this area chain.`,
    ];

    return lines.join(' ');
  }, [analytics, anomalies.length, forecast, trendSummary.deltaTemp]);

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-8 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-700">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Climate Analytics
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Easy-to-read trends, forecast confidence, and anomaly insights.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBriefing((v) => !v)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition border border-slate-600"
          >
            <Sparkles className="w-4 h-4" /> {showBriefing ? 'Hide Summary' : 'Show Summary'}
          </button>
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition border border-slate-600"
          >
            <Gauge className="w-4 h-4" /> {showAdvanced ? 'Basic View' : 'Advanced View'}
          </button>
        </div>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="lg:col-span-2">
            <p className="text-sm text-slate-400 mb-2">Choose a spatial unit</p>
            <div className="max-w-xl">
              <SpatialUnitSearch onSelect={setSelectedUnit} />
            </div>
          </div>
          {selectedUnit && (
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected</p>
              <p className="text-lg font-bold text-white mt-1">{selectedUnit.name}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> {selectedUnit.type} • {selectedUnit.pcode}
              </p>
            </div>
          )}
        </div>
      </Card>

      {!selectedUnit ? (
        <div className="py-16 text-center space-y-4">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-slate-700">
            <Radar className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Select a location to begin</h3>
          <p className="text-slate-400">Search District, DS, or GN units and the dashboard will auto-load trends.</p>
        </div>
      ) : isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-400 font-medium">Loading analytics overview...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-8 animate-in fade-in duration-700">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard 
              title="Recent Avg Temp"
              value={historicalTrend.length ? (historicalTrend[historicalTrend.length - 1].tempMean ?? 0).toFixed(1) : '0.0'}
              unit="°C"
              icon={Thermometer}
              color="text-blue-400 bg-blue-500/10 border-blue-500/20"
              trend={trendSummary.deltaTemp > 0 ? 'warming' : trendSummary.deltaTemp < 0 ? 'cooling' : 'stable'}
            />
            <StatCard 
              title="14-Day Rain Total"
              value={forecast.reduce((sum: number, f: any) => sum + (f.predictedPrecip ?? 0), 0).toFixed(1)}
              unit="mm"
              icon={CloudRain}
              color="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            />
            <StatCard 
              title="Anomaly Signals"
              value={anomalies.length}
              icon={ShieldAlert}
              color="text-amber-400 bg-amber-500/10 border-amber-500/20"
            />
            <StatCard 
              title="Forecast Hit Rate"
              value={accuracy?.hitRate != null ? accuracy.hitRate.toFixed(1) : '0.0'}
              unit="%"
              icon={Gauge}
              color="text-purple-400 bg-purple-500/10 border-purple-500/20"
            />
          </div>

          {showBriefing && (
            <Card className="p-5 border-slate-600">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-emerald-400">
                <Sparkles className="w-5 h-5" /> Plain-Language Summary
              </h3>
              <p className="text-slate-200 leading-relaxed">{simpleBriefing}</p>
              <p className="text-xs text-slate-500 mt-3">Generated from backend weather sync + forecast projection data, without requiring Python AI runtime.</p>
            </Card>
          )}

          <div className="bg-slate-800/30 p-1.5 rounded-xl border border-slate-700/50 flex flex-wrap gap-2 w-max max-w-full overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'forecast', label: 'Forecast' },
              { id: 'patterns', label: 'Patterns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'forecast' | 'patterns')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" /> 30-Day Temperature
                </h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                      <YAxis stroke="#94A3B8" fontSize={11} unit="°C" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }} />
                      <Line type="monotone" dataKey="tempMean" stroke={CHART_COLORS.temp} strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-4">
                  <CloudRain className="w-5 h-5" /> 30-Day Rainfall
                </h3>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                      <YAxis stroke="#94A3B8" fontSize={11} unit="mm" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }} />
                      <Bar dataKey="precipMm" fill={CHART_COLORS.precip} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-5 lg:col-span-2">
                <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 mb-4">
                  <Radar className="w-5 h-5" /> 14-Day Precipitation Forecast
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} />
                      <YAxis stroke="#94A3B8" fontSize={11} unit="mm" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }} />
                      <Legend />
                      <Bar dataKey="predictedPrecip" name="Predicted" fill={CHART_COLORS.forecast} radius={[4, 4, 0, 0]} />
                      {showAdvanced && <Line type="monotone" dataKey="upperBound" name="Upper" stroke={CHART_COLORS.upper} strokeWidth={1.5} dot={false} strokeDasharray="4 4" />}
                      {showAdvanced && <Line type="monotone" dataKey="lowerBound" name="Lower" stroke={CHART_COLORS.lower} strokeWidth={1.5} dot={false} strokeDasharray="4 4" />}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5" /> Anomalies
                </h3>
                <div className="space-y-3 max-h-[320px] overflow-auto">
                  {anomalies.length === 0 && <p className="text-sm text-slate-400 italic">No active anomaly flags right now.</p>}
                  {anomalies.map((a: any, i: number) => (
                    <div key={`${a.metric}-${i}`} className="p-3 rounded-lg border border-slate-700 bg-slate-900/40">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-200 capitalize font-semibold">{a.metric}</p>
                        <Badge variant={Math.abs(a.zScore) >= 2 ? 'critical' : 'warning'} size="sm">{a.classification}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Month {a.month} • z-score {a.zScore?.toFixed?.(2) ?? a.zScore}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-5 lg:col-span-2">
                <h3 className="text-lg font-bold text-blue-300 flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" /> Monthly Climate Averages
                </h3>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyAverages}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                      <YAxis yAxisId="temp" stroke="#94A3B8" fontSize={11} unit="°C" />
                      <YAxis yAxisId="precip" orientation="right" stroke="#94A3B8" fontSize={11} unit="mm" />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }} />
                      <Legend />
                      <Line yAxisId="temp" type="monotone" dataKey="avgTemp" stroke={CHART_COLORS.temp} name="Avg Temp" strokeWidth={2} dot={false} />
                      <Bar yAxisId="precip" dataKey="avgPrecip" fill={CHART_COLORS.precip} name="Avg Rain" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 mb-4">
                  <History className="w-5 h-5" /> Forecast Reliability
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700">
                    <p className="text-xs text-slate-400">Forecasts Evaluated</p>
                    <p className="text-2xl font-bold text-white">{accuracy?.totalForecasts ?? 0}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700">
                    <p className="text-xs text-slate-400">Mean Absolute Error</p>
                    <p className="text-2xl font-bold text-white">{accuracy?.mae?.toFixed?.(2) ?? '0.00'}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-700">
                    <p className="text-xs text-slate-400">Confidence Hit Rate</p>
                    <p className="text-2xl font-bold text-white">{accuracy?.hitRate?.toFixed?.(1) ?? '0.0'}%</p>
                  </div>
                </div>

                {showAdvanced && (
                  <div className="mt-4 max-h-[140px] overflow-auto space-y-2">
                    {(forecastHistory || []).slice(0, 6).map((h: any, idx: number) => (
                      <div key={`${h.targetDate}-${idx}`} className="p-2 rounded border border-slate-700 bg-slate-900/40 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{h.targetDate}</span>
                          {h.confidenceHit ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <p className="text-slate-300 mt-1">Pred {h.predictedValue?.toFixed?.(2) ?? 'N/A'} • Actual {h.actualValue?.toFixed?.(2) ?? 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Warning Context</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="warning">Total {analytics.warningHistory?.totalWarnings ?? 0}</Badge>
              <Badge variant="critical">Flood {analytics.warningHistory?.floodWarnings ?? 0}</Badge>
              <Badge variant="info">Landslide {analytics.warningHistory?.landslideWarnings ?? 0}</Badge>
              <span className="text-slate-400">Last warning: {analytics.warningHistory?.lastWarningAt ? new Date(analytics.warningHistory.lastWarningAt).toLocaleString() : 'N/A'}</span>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
