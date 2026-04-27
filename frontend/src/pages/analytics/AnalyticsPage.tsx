import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
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
  Satellite,
  Radio,
  Wind,
  Droplets,
  MapPin,
  Activity,
} from 'lucide-react';
import { analyticsApi } from '../../api/endpoints';
import { useWeather } from '../../hooks/useWeather';
import { SpatialUnitSearch } from '../../components/common/SpatialUnitSearch';
import { StatCard } from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { useLocationContextStore } from '../../store/locationContextStore';

type AnalyticsTab = 'overview' | 'forecast' | 'patterns' | 'rainfall' | 'sources';

interface LocationOption {
  id: string;
  name: string;
  type: string;
  pcode?: string;
  lat?: number;
  lng?: number;
}

interface DailyWeatherDto {
  date: string;
  tempMean: number | null;
  precipMm: number | null;
  humidityMean: number | null;
}

interface ForecastDto {
  date: string;
  predictedPrecip: number | null;
  lowerBound: number | null;
  upperBound: number | null;
  qualityScore: number | null;
}

interface AnomalyDto {
  metric: string;
  month: number;
  classification: string;
  zScore: number | null;
}

interface MonthlyStatsDto {
  month: number;
  avgTemp: number | null;
  avgPrecip: number | null;
  avgHumidity: number | null;
}

interface WarningHistoryDto {
  totalWarnings: number;
  floodWarnings: number;
  landslideWarnings: number;
  lastWarningAt: string | null;
}

interface AnalyticsOverviewResponse {
  spatialUnitId: string;
  spatialUnitName: string;
  type: string;
  historicalTrend: DailyWeatherDto[];
  forecast: ForecastDto[];
  anomalies: AnomalyDto[];
  monthlyAverages: MonthlyStatsDto[];
  warningHistory: WarningHistoryDto;
}

interface ForecastAccuracyDto {
  spatialUnitId: string;
  totalForecasts: number;
  mae: number;
  hitRate: number;
}

interface ForecastHistoryPointDto {
  targetDate: string;
  predictedValue: number | null;
  actualValue: number | null;
  absoluteError: number | null;
  confidenceHit: boolean | null;
}

interface SatelliteRainfallDto {
  date: string;
  satelliteRainMm: number | null;
  stationRainMm: number | null;
  modelRainMm: number | null;
  discrepancyPercent: number | null;
  primarySource: string;
}

interface StationComparisonDto {
  stationId: string;
  stationName: string;
  distanceKm: number | null;
  stationTempC: number | null;
  stationHumidityPct: number | null;
  stationRainfallMm: number | null;
  interpolatedTempC: number | null;
  interpolatedHumidityPct: number | null;
  interpolatedRainfallMm: number | null;
  tempBiasC: number | null;
  dataQuality: string;
  stationAgeMinutes: number | null;
}

interface HourlyTrendDto {
  timestamp: string;
  temperatureC: number | null;
  precipitationMm: number | null;
}

interface AdvancedForecastResponse {
  tempC: number | null;
  apparentTempC: number | null;
  humidityPct: number | null;
  pressureHpa: number | null;
  windSpeedKmh: number | null;
  uvIndex: number | null;
  shortIntervals?: Array<{ start: string }>;
}

const CHART_COLORS = {
  temp: '#38BDF8',
  precip: '#34D399',
  forecast: '#A78BFA',
  upper: '#F59E0B',
  lower: '#3B82F6',
};

function formatDay(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return dateString;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatDayLong(dateString: string): string {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return dateString;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function AnalyticsPage() {
  const { selectedLocation, setSelectedLocation } = useLocationContextStore();
  const [selectedUnit, setSelectedUnit] = useState<LocationOption | null>(null);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [showBriefing, setShowBriefing] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!selectedLocation) {
      if (selectedUnit) {
        setSelectedUnit(null);
      }
      return;
    }

    if (!selectedUnit || selectedUnit.id !== selectedLocation.id) {
      setSelectedUnit({
        id: selectedLocation.id,
        name: selectedLocation.name,
        type: selectedLocation.type,
        pcode: selectedLocation.pcode,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      });
    }
  }, [selectedLocation, selectedUnit]);

  const { data: analytics, isLoading } = useQuery<AnalyticsOverviewResponse>({
    queryKey: ['analyticsOverview', selectedUnit?.id],
    queryFn: () => analyticsApi.getOverview(selectedUnit!.id),
    enabled: !!selectedUnit?.id,
  });

  const { data: accuracy } = useQuery<ForecastAccuracyDto>({
    queryKey: ['analyticsAccuracy', selectedUnit?.id],
    queryFn: () => analyticsApi.getForecastAccuracy(selectedUnit!.id, { days: 30, metric: 'all' }),
    enabled: !!selectedUnit?.id,
  });

  const { data: forecastHistory } = useQuery<ForecastHistoryPointDto[]>({
    queryKey: ['analyticsForecastHistory', selectedUnit?.id],
    queryFn: () => analyticsApi.getForecastHistory(selectedUnit!.id, 'precipitation', { days: 30 }),
    enabled: !!selectedUnit?.id,
  });

  const { data: satelliteRain, isLoading: rainLoading } = useQuery<SatelliteRainfallDto[]>({
    queryKey: ['analyticsSatelliteRain', selectedUnit?.id],
    queryFn: () => analyticsApi.getSatelliteRainfall(selectedUnit!.id, { days: 7 }),
    enabled: !!selectedUnit?.id,
  });

  const { data: stationComparison, isLoading: stationLoading } = useQuery<StationComparisonDto[]>({
    queryKey: ['analyticsStationComparison', selectedUnit?.id],
    queryFn: () => analyticsApi.getStationComparison(selectedUnit!.id),
    enabled: !!selectedUnit?.id,
  });

  const { data: hourlyTrend, isLoading: hourlyLoading } = useQuery<HourlyTrendDto[]>({
    queryKey: ['analyticsHourlyTrend', selectedUnit?.id],
    queryFn: () => analyticsApi.getHourlyTrend(selectedUnit!.id, { hours: 72, metric: 'all' }),
    enabled: !!selectedUnit?.id,
  });

  const { data: weather, isLoading: weatherLoading } = useWeather(selectedUnit?.id) as {
    data: AdvancedForecastResponse | undefined;
    isLoading: boolean;
  };

  const historicalTrend = analytics?.historicalTrend ?? [];
  const forecast = analytics?.forecast ?? [];
  const anomalies = analytics?.anomalies ?? [];
  const monthlyAverages = analytics?.monthlyAverages ?? [];

  const trendSummary = useMemo(() => {
    if (historicalTrend.length < 2) {
      return { deltaTemp: 0, deltaRain: 0 };
    }

    const first = historicalTrend[0];
    const last = historicalTrend[historicalTrend.length - 1];

    return {
      deltaTemp: (last.tempMean ?? 0) - (first.tempMean ?? 0),
      deltaRain: (last.precipMm ?? 0) - (first.precipMm ?? 0),
    };
  }, [historicalTrend]);

  const recentAverages = useMemo(() => {
    const recentDays = historicalTrend.slice(-7);
    const recentAvgTemp = recentDays.length
      ? recentDays.reduce((sum, day) => sum + (day.tempMean ?? 0), 0) / recentDays.length
      : 0;
    const recentAvgHumidity = recentDays.length
      ? recentDays.reduce((sum, day) => sum + (day.humidityMean ?? 0), 0) / recentDays.length
      : 0;
    const forecastRainTotal = forecast.reduce((sum, day) => sum + (day.predictedPrecip ?? 0), 0);

    return {
      recentAvgTemp,
      recentAvgHumidity,
      forecastRainTotal,
    };
  }, [historicalTrend, forecast]);

  const reliabilitySummary = useMemo(() => {
    const totalForecasts = accuracy?.totalForecasts ?? 0;
    const mae = accuracy?.mae ?? 0;
    const hitRate = accuracy?.hitRate ?? 0;
    const boundedForecasts = forecast.filter((f) => f.upperBound != null && f.lowerBound != null);
    const avgBandWidth = boundedForecasts.length
      ? boundedForecasts.reduce((sum, f) => sum + ((f.upperBound ?? 0) - (f.lowerBound ?? 0)), 0) / boundedForecasts.length
      : 0;

    return { totalForecasts, mae, hitRate, avgBandWidth };
  }, [accuracy, forecast]);

  const simpleBriefing = useMemo(() => {
    if (!analytics) {
      return '';
    }

    const rainDays = forecast.filter((f) => (f.predictedPrecip ?? 0) >= 5).length;
    const tempDirection = trendSummary.deltaTemp > 0.5 ? 'warming' : trendSummary.deltaTemp < -0.5 ? 'cooling' : 'stable';
    const confidenceLevel =
      reliabilitySummary.hitRate >= 75
        ? 'high'
        : reliabilitySummary.hitRate >= 55
          ? 'moderate'
          : reliabilitySummary.totalForecasts === 0
            ? 'insufficient'
            : 'low';

    const lines = [
      `Temperature is currently ${tempDirection} over the recent period.`,
      rainDays > 0
        ? `Forecast suggests ${rainDays} wetter day${rainDays > 1 ? 's' : ''} in the next two weeks.`
        : 'Forecast suggests mostly low-rainfall conditions for the next two weeks.',
      anomalies.length > 0
        ? `There ${anomalies.length === 1 ? 'is' : 'are'} ${anomalies.length} active anomaly signal${anomalies.length > 1 ? 's' : ''} to monitor.`
        : 'No strong anomaly signals detected right now.',
      confidenceLevel === 'high'
        ? 'Forecast confidence is currently strong based on recent model-vs-observation checks.'
        : confidenceLevel === 'moderate'
          ? 'Forecast confidence is moderate; monitor confidence bands for short-term changes.'
          : confidenceLevel === 'low'
            ? 'Forecast confidence is currently low, so treat medium-range projections conservatively.'
            : 'Forecast confidence cannot be graded yet because validated historical checks are limited.',
      `Warning history includes ${analytics.warningHistory?.totalWarnings ?? 0} total warnings for this area chain.`,
    ];

    return lines.join(' ');
  }, [analytics, forecast, anomalies.length, trendSummary.deltaTemp, reliabilitySummary.hitRate, reliabilitySummary.totalForecasts]);

  const handleSelectUnit = (unit: LocationOption) => {
    setSelectedUnit(unit);
    setSelectedLocation({
      id: unit.id,
      name: unit.name,
      type: unit.type,
      pcode: unit.pcode,
      lat: unit.lat,
      lng: unit.lng,
    });
  };

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
            onClick={() => setShowBriefing((value) => !value)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 flex items-center gap-2 rounded-xl font-semibold transition border border-slate-600"
          >
            <Sparkles className="w-4 h-4" /> {showBriefing ? 'Hide Summary' : 'Show Summary'}
          </button>
          <button
            onClick={() => setShowAdvanced((value) => !value)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 flex items-center gap-2 rounded-xl font-semibold transition border border-slate-600"
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
              <SpatialUnitSearch onSelect={handleSelectUnit} />
            </div>
          </div>
          {selectedUnit && (
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Selected</p>
              <p className="text-lg font-bold text-white mt-1">{selectedUnit.name}</p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" /> {selectedUnit.type} {selectedUnit.pcode ? `• ${selectedUnit.pcode}` : ''}
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
          <p className="text-slate-400">Search District, DS, or GN units and this page will load analytics and weather context.</p>
        </div>
      ) : isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
          <p className="text-slate-400 font-medium">Loading analytics overview...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Current Temp</p>
              <p className="text-2xl font-bold text-blue-300">{weather?.tempC != null ? `${weather.tempC.toFixed(1)}°C` : 'N/A'}</p>
              <p className="text-xs text-slate-500 mt-1">Feels like {weather?.apparentTempC != null ? `${weather.apparentTempC.toFixed(1)}°C` : 'N/A'}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Humidity / Pressure</p>
              <p className="text-2xl font-bold text-emerald-300">{weather?.humidityPct != null ? `${weather.humidityPct.toFixed(0)}%` : 'N/A'}</p>
              <p className="text-xs text-slate-500 mt-1">{weather?.pressureHpa != null ? `${weather.pressureHpa.toFixed(0)} hPa` : 'N/A'}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Wind / UV</p>
              <p className="text-2xl font-bold text-amber-300">{weather?.windSpeedKmh != null ? `${weather.windSpeedKmh.toFixed(1)} km/h` : 'N/A'}</p>
              <p className="text-xs text-slate-500 mt-1">UV {weather?.uvIndex != null ? weather.uvIndex.toFixed(1) : 'N/A'}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-slate-400 mb-1">Hourly Points</p>
              <p className="text-2xl font-bold text-purple-300">{weather?.shortIntervals?.length ?? 0}</p>
              <p className="text-xs text-slate-500 mt-1">{weatherLoading ? 'Loading weather feed...' : 'From advanced weather intervals'}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Recent Avg Temp"
              value={recentAverages.recentAvgTemp.toFixed(1)}
              unit="°C"
              icon={Thermometer}
              color="text-blue-400 bg-blue-500/10 border-blue-500/20"
              trend={trendSummary.deltaTemp > 0 ? 'warming' : trendSummary.deltaTemp < 0 ? 'cooling' : 'stable'}
            />
            <StatCard
              title="14-Day Rain Total"
              value={recentAverages.forecastRainTotal.toFixed(1)}
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
              value={reliabilitySummary.hitRate.toFixed(1)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-3">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">Mean Absolute Error</p>
                  <p className="text-lg font-bold text-slate-100">{reliabilitySummary.mae.toFixed(2)}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-3">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">Avg Forecast Band</p>
                  <p className="text-lg font-bold text-slate-100">{reliabilitySummary.avgBandWidth.toFixed(2)} mm</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-700 rounded-xl p-3">
                  <p className="text-[11px] text-slate-500 uppercase tracking-wide">Recent Avg Humidity</p>
                  <p className="text-lg font-bold text-slate-100">{recentAverages.recentAvgHumidity.toFixed(0)}%</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">Generated from backend weather sync, node timeseries, station observations, JAXA rainfall grids, and forecast projection records.</p>
            </Card>
          )}

          <div className="bg-slate-800/30 p-1.5 rounded-xl border border-slate-700/50 flex flex-wrap gap-2 w-max max-w-full overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'forecast', label: 'Forecast', icon: Radar },
              { id: 'patterns', label: 'Patterns', icon: Calendar },
              { id: 'rainfall', label: 'Rainfall Analysis', icon: Satellite },
              { id: 'sources', label: 'Data Sources', icon: Radio },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
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
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={formatDay} />
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
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={formatDay} />
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
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={formatDay} />
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
                  {anomalies.map((item, index) => (
                    <div key={`${item.metric}-${index}`} className="p-3 rounded-xl border border-slate-700 bg-slate-900/40">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-slate-200 capitalize font-semibold">{item.metric}</p>
                        <Badge variant={Math.abs(item.zScore ?? 0) >= 2 ? 'critical' : 'warning'} size="sm">{item.classification}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Month {item.month} • z-score {item.zScore != null ? item.zScore.toFixed(2) : 'N/A'}</p>
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
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700">
                    <p className="text-xs text-slate-400">Forecasts Evaluated</p>
                    <p className="text-2xl font-bold text-white">{reliabilitySummary.totalForecasts}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700">
                    <p className="text-xs text-slate-400">Mean Absolute Error</p>
                    <p className="text-2xl font-bold text-white">{reliabilitySummary.mae.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-700">
                    <p className="text-xs text-slate-400">Confidence Hit Rate</p>
                    <p className="text-2xl font-bold text-white">{reliabilitySummary.hitRate.toFixed(1)}%</p>
                  </div>
                </div>

                {showAdvanced && (
                  <div className="mt-4 max-h-[140px] overflow-auto space-y-2">
                    {(forecastHistory || []).slice(0, 6).map((entry, idx) => (
                      <div key={`${entry.targetDate}-${idx}`} className="p-2 rounded-xl border border-slate-700 bg-slate-900/40 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">{entry.targetDate}</span>
                          {entry.confidenceHit === true && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {entry.confidenceHit === false && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          {entry.confidenceHit == null && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-slate-300 mt-1">Pred {entry.predictedValue != null ? entry.predictedValue.toFixed(2) : 'N/A'} • Actual {entry.actualValue != null ? entry.actualValue.toFixed(2) : 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'rainfall' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2 mb-4">
                    <Satellite className="w-5 h-5" /> Satellite vs Station vs Model
                  </h3>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={satelliteRain || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickFormatter={formatDay} />
                        <YAxis stroke="#94A3B8" fontSize={11} unit="mm" />
                        <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }} />
                        <Legend />
                        <Bar dataKey="satelliteRainMm" name="JAXA Satellite" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="stationRainMm" name="Station (Ground Truth)" fill="#10B981" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="modelRainMm" name="Model Forecast" stroke="#A78BFA" strokeWidth={2} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  {rainLoading && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Loading satellite data...</p>}
                </Card>

                <Card className="p-5">
                  <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2 mb-4">
                    <Droplets className="w-5 h-5" /> Data Source Discrepancy
                  </h3>
                  <div className="space-y-3 max-h-[320px] overflow-auto">
                    {(satelliteRain || []).slice(0, 7).map((day, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-700 bg-slate-900/40">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-200">{formatDayLong(day.date)}</span>
                          <Badge variant={day.primarySource === 'STATION' ? 'success' : day.primarySource === 'SATELLITE' ? 'info' : 'neutral'} size="sm">
                            {day.primarySource}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-slate-500">Station</p>
                            <p className="text-emerald-400 font-semibold">{day.stationRainMm != null ? `${day.stationRainMm.toFixed(1)} mm` : 'N/A'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-500">Satellite</p>
                            <p className="text-cyan-400 font-semibold">{day.satelliteRainMm != null ? `${day.satelliteRainMm.toFixed(1)} mm` : 'N/A'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-500">Model</p>
                            <p className="text-purple-400 font-semibold">{day.modelRainMm != null ? `${day.modelRainMm.toFixed(1)} mm` : 'N/A'}</p>
                          </div>
                        </div>
                        {day.discrepancyPercent !== null && (
                          <p className="text-xs text-slate-500 mt-2 text-center">Δ {day.discrepancyPercent > 0 ? '+' : ''}{day.discrepancyPercent.toFixed(0)}% (sat vs station)</p>
                        )}
                      </div>
                    ))}
                    {(!satelliteRain || satelliteRain.length === 0) && !rainLoading && (
                      <p className="text-sm text-slate-400 italic">No satellite rainfall data available for this location.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-5">
                  <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-4">
                    <Radio className="w-5 h-5" /> Ground Station Comparison
                  </h3>
                  <div className="space-y-3 max-h-[400px] overflow-auto">
                    {(stationComparison || []).map((station, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-700 bg-slate-900/40">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-200">{station.stationName}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {station.distanceKm != null ? `${station.distanceKm.toFixed(1)} km away` : '? km away'}
                            </p>
                          </div>
                          <Badge variant={station.dataQuality === 'STATION_DIRECT' ? 'success' : 'warning'} size="sm">
                            {station.dataQuality}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-slate-500">Temperature</p>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400">{station.stationTempC != null ? `${station.stationTempC.toFixed(1)}°C` : 'N/A'}</span>
                              <span className="text-slate-600">vs</span>
                              <span className="text-blue-400">{station.interpolatedTempC != null ? `${station.interpolatedTempC.toFixed(1)}°C` : 'N/A'}</span>
                            </div>
                            {station.tempBiasC != null && (
                              <p className={`text-xs ${Math.abs(station.tempBiasC) < 1 ? 'text-emerald-500' : Math.abs(station.tempBiasC) < 2 ? 'text-amber-500' : 'text-rose-500'}`}>
                                Δ {station.tempBiasC > 0 ? '+' : ''}{station.tempBiasC.toFixed(1)}°C
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Humidity</p>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400">{station.stationHumidityPct != null ? `${station.stationHumidityPct.toFixed(0)}%` : 'N/A'}</span>
                              <span className="text-slate-600">vs</span>
                              <span className="text-blue-400">{station.interpolatedHumidityPct != null ? `${station.interpolatedHumidityPct.toFixed(0)}%` : 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Rainfall</p>
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400">{station.stationRainfallMm != null ? `${station.stationRainfallMm.toFixed(1)}mm` : 'N/A'}</span>
                              <span className="text-slate-600">vs</span>
                              <span className="text-blue-400">{station.interpolatedRainfallMm != null ? `${station.interpolatedRainfallMm.toFixed(1)}mm` : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          Updated {station.stationAgeMinutes == null ? 'N/A' : station.stationAgeMinutes < 60 ? `${station.stationAgeMinutes} min ago` : `${Math.floor(station.stationAgeMinutes / 60)}h ago`}
                        </p>
                      </div>
                    ))}
                    {(!stationComparison || stationComparison.length === 0) && !stationLoading && (
                      <p className="text-sm text-slate-400 italic">No ground stations within 50km of this location.</p>
                    )}
                    {stationLoading && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading station data...
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-5">
                  <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2 mb-4">
                    <Wind className="w-5 h-5" /> 72-Hour Hourly Trend
                  </h3>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={(hourlyTrend || []).slice().reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis
                          dataKey="timestamp"
                          stroke="#94A3B8"
                          fontSize={10}
                          tickFormatter={(value) => new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', day: 'numeric' })}
                        />
                        <YAxis yAxisId="temp" stroke="#94A3B8" fontSize={11} unit="°C" />
                        <YAxis yAxisId="rain" orientation="right" stroke="#94A3B8" fontSize={11} unit="mm" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155' }}
                          labelFormatter={(value) => new Date(value).toLocaleString()}
                        />
                        <Legend />
                        <Line yAxisId="temp" type="monotone" dataKey="temperatureC" name="Temperature" stroke={CHART_COLORS.temp} strokeWidth={2} dot={false} />
                        <Bar yAxisId="rain" dataKey="precipitationMm" name="Precipitation" fill={CHART_COLORS.precip} radius={[2, 2, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  {hourlyLoading && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Loading hourly data...</p>}
                </Card>
              </div>
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
