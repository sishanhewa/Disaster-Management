import { useEffect, useState } from 'react';
import axios from 'axios';
import { Droplets, CloudRain, Activity, Clock } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';

const GAUGES_URL = 'https://services3.arcgis.com/J7ZFXmR8rSmQ3FGf/arcgis/rest/services/gauges_2_view/FeatureServer/0/query';

interface GaugeRecord {
    gauge: string;
    basin: string;
    water_level: number;
    rain_fall: number;
    alertpull: number;
    minorpull: number;
    majorpull: number;
    CreationDate: number;
}

interface HydrostationDetailProps {
    stationName: string;
}

const getStatus = (level: number, alert: number, minor: number, major: number) => {
    if (level >= major) return { text: 'Major Flood', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/40' };
    if (level >= minor) return { text: 'Minor Flood', color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/40' };
    if (level >= alert) return { text: 'Alert', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/40' };
    return { text: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' };
};

const HydrostationDetail = ({ stationName }: HydrostationDetailProps) => {
    const [records, setRecords] = useState<GaugeRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'hourly' | 'daily'>('hourly');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(GAUGES_URL, {
                    params: {
                        where: `gauge='${stationName}'`,
                        outFields: '*',
                        returnGeometry: false,
                        f: 'json',
                        orderByFields: 'CreationDate DESC',
                        resultRecordCount: 200
                    }
                });
                const data = res.data.features?.map((f: any) => f.attributes as GaugeRecord) || [];
                setRecords(data.reverse()); // oldest first for charts
            } catch (e) {
                console.error('Failed to fetch gauge data', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [stationName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8 text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
                Loading data for {stationName}...
            </div>
        );
    }

    if (records.length === 0) {
        return <div className="p-6 text-center text-slate-500">No data available for {stationName}</div>;
    }

    const latest = records[records.length - 1];
    const status = getStatus(latest.water_level, latest.alertpull, latest.minorpull, latest.majorpull);

    // Calculate 24h rainfall
    const now = Date.now();
    const last24h = records.filter(r => now - r.CreationDate < 24 * 60 * 60 * 1000);
    const totalRainfall24h = last24h.reduce((sum, r) => sum + (r.rain_fall || 0), 0);

    // Prepare chart data
    const chartData = records.map(r => ({
        time: new Date(r.CreationDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', ...(timeRange === 'hourly' ? { hour: '2-digit', minute: '2-digit' } : {})
        }),
        water_level: r.water_level,
        rainfall: r.rain_fall,
        ts: r.CreationDate
    }));

    // For daily view, aggregate
    const dailyData = timeRange === 'daily' ? aggregateDaily(chartData) : chartData;

    const waterLevelPct = Math.min(100, (latest.water_level / latest.majorpull) * 100);

    return (
        <div className="space-y-4">
            {/* Current Status Cards */}
            <div className="grid grid-cols-2 gap-3">
                {/* Water Level Card */}
                <div className={`rounded-xl p-4 border ${status.bg}`}>
                    <p className="text-[11px] text-slate-400 uppercase tracking-widest">Current Water Level at {stationName}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center">
                            <Droplets size={20} className={status.color} />
                        </div>
                        <div>
                            <span className="text-3xl font-black text-slate-100">{latest.water_level.toFixed(2)}</span>
                            <span className="text-lg text-slate-400 ml-1">m</span>
                        </div>
                    </div>
                    <p className={`text-sm font-bold mt-1 ${status.color}`}>{status.text}</p>
                    {/* Mini level bar */}
                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{
                                width: `${waterLevelPct}%`,
                                backgroundColor: waterLevelPct > 80 ? '#ef4444' : waterLevelPct > 60 ? '#f97316' : waterLevelPct > 40 ? '#eab308' : '#22c55e'
                            }}
                        />
                    </div>
                </div>

                {/* Rainfall Card */}
                <div className="rounded-xl p-4 border bg-blue-900/20 border-blue-500/30">
                    <p className="text-[11px] text-blue-300 uppercase tracking-widest font-bold">Last 24 Hours Rainfall</p>
                    <div className="flex items-center gap-3 mt-2">
                        <CloudRain size={32} className="text-blue-500" />
                        <div>
                            <span className="text-3xl font-black text-slate-100">{totalRainfall24h.toFixed(0)}</span>
                            <span className="text-lg text-slate-400 ml-1">mm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Levels Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg py-2">
                    <p className="text-[10px] text-yellow-400 uppercase font-bold">Alert Level</p>
                    <p className="text-lg font-black text-yellow-300">{latest.alertpull} m</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg py-2">
                    <p className="text-[10px] text-orange-400 uppercase font-bold">Minor Flood</p>
                    <p className="text-lg font-black text-orange-300">{latest.minorpull} m</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg py-2">
                    <p className="text-[10px] text-red-400 uppercase font-bold">Major Flood</p>
                    <p className="text-lg font-black text-red-300">{latest.majorpull} m</p>
                </div>
            </div>

            {/* Rainfall Chart */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                    <CloudRain size={14} className="text-blue-400" /> Rainfall at {stationName} in mm/Hour
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Line type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} dot={false} name="Rainfall (mm)" />
                    </LineChart>
                </ResponsiveContainer>
                {/* Time Range Toggles */}
                <div className="flex gap-1 mt-2">
                    <button
                        onClick={() => setTimeRange('hourly')}
                        className={`px-3 py-1 text-xs rounded font-bold ${timeRange === 'hourly' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                    >Hourly</button>
                    <button
                        onClick={() => setTimeRange('daily')}
                        className={`px-3 py-1 text-xs rounded font-bold ${timeRange === 'daily' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
                    >Daily</button>
                </div>
            </div>

            {/* Water Level Chart with Alert Lines */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                    <Activity size={14} className="text-cyan-400" /> River Water at {stationName} in m
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            domain={[0, Math.max(latest.majorpull + 1, Math.max(...records.map(r => r.water_level)) + 1)]}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: 8 }}
                            labelStyle={{ color: '#94a3b8' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        {/* Alert threshold lines */}
                        <ReferenceLine y={latest.alertpull} stroke="#eab308" strokeDasharray="6 3" label={{ value: 'Alert', fill: '#eab308', fontSize: 10 }} />
                        <ReferenceLine y={latest.minorpull} stroke="#f97316" strokeDasharray="6 3" label={{ value: 'Minor Flood', fill: '#f97316', fontSize: 10 }} />
                        <ReferenceLine y={latest.majorpull} stroke="#ef4444" strokeWidth={2} label={{ value: 'Major Flood', fill: '#ef4444', fontSize: 10 }} />
                        {/* Water level line */}
                        <Line type="monotone" dataKey="water_level" stroke="#3b82f6" strokeWidth={2} dot={false} name="Water Level (m)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Station Info */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Clock size={10} /> Last Updated
                </p>
                <p className="text-xs text-slate-300">
                    {new Date(latest.CreationDate).toLocaleString()} • Basin: <span className="text-blue-300 font-semibold">{latest.basin}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-1">{records.length} records loaded from ArcGIS</p>
            </div>
        </div>
    );
};

function aggregateDaily(data: any[]) {
    const groups: Record<string, { rainfall: number; water_level: number; count: number }> = {};
    data.forEach(d => {
        const day = new Date(d.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!groups[day]) groups[day] = { rainfall: 0, water_level: 0, count: 0 };
        groups[day].rainfall += d.rainfall;
        groups[day].water_level += d.water_level;
        groups[day].count += 1;
    });
    return Object.entries(groups).map(([time, g]) => ({
        time,
        rainfall: g.rainfall,
        water_level: +(g.water_level / g.count).toFixed(2)
    }));
}

export default HydrostationDetail;
