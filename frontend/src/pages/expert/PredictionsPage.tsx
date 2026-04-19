import { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Legend, Brush
} from 'recharts';
import { TrendingUp, AlertTriangle, Droplets, Thermometer, Wind, Target, Activity, CloudRain } from 'lucide-react';
import { predictionsApi } from '../../api/endpoints';

const PredictionsPage = () => {
    const [stations, setStations] = useState<any[]>([]);
    const [selectedStationIdx, setSelectedStationIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Existing History States
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    
    // New Accuracy States
    const [accuracyChartData, setAccuracyChartData] = useState<any[]>([]);
    const [accuracyLoading, setAccuracyLoading] = useState(false);

    useEffect(() => {
        predictionsApi.getAllStatus().then((data: any) => {
            setStations(data);
            setLoading(false);
        }).catch((err: any) => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const basin = stations[selectedStationIdx];

    // Fetch History & Accuracy whenever the selected station changes
    useEffect(() => {
        if (!basin) return;
        
        // 1. Fetch History
        setHistoryLoading(true);
        predictionsApi.getHistory(basin.station_id, 1).then((data: any) => {
            const mappedHistory = data.map((d: any) => {
                const date = new Date(d.observed_at + 'Z');
                return {
                    time: date.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit' }),
                    timestamp: date.getTime(),
                    history_level: d.water_level,
                    predicted_level: null
                };
            });
            mappedHistory.sort((a: any, b: any) => a.timestamp - b.timestamp);
            setHistory(mappedHistory);
            setHistoryLoading(false);
        }).catch((err: any) => {
            console.error(err);
            setHistoryLoading(false);
        });

        // 2. Fetch Accuracy Drift
        setAccuracyLoading(true);
        predictionsApi.getAccuracy(basin.station_id).then((data: any) => {
            const accuracyMap = new Map();
            data.forEach((d: any) => {
                const date = new Date(d.target_time + 'Z');
                // Formatting to match "Mar 22 05:01"
                const month = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', month: 'short' });
                const day = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', day: '2-digit' });
                const hrs = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', hour12: false });
                const mins = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', minute: '2-digit' });
                const timeKey = `${month} ${day} ${hrs}:${mins}`;
                
                const timestamp = date.getTime();
                
                if (!accuracyMap.has(timeKey)) {
                    accuracyMap.set(timeKey, { time: timeKey, timestamp, actual: d.actual });
                }
                const entry = accuracyMap.get(timeKey);
                
                // Filter out physically impossible values and extreme noise outliers
                const isSane = d.predicted != null && d.predicted >= 0 && (d.error == null || d.error < 1.0);
                if (isSane) {
                    if (d.horizon_hours === 3 && entry.predicted_3h === undefined) entry.predicted_3h = d.predicted;
                    if (d.horizon_hours === 12 && entry.predicted_12h === undefined) entry.predicted_12h = d.predicted;
                }
            });
            
            const combinedAccuracy = Array.from(accuracyMap.values()).sort((a: any, b: any) => a.timestamp - b.timestamp);
            setAccuracyChartData(combinedAccuracy);
            setAccuracyLoading(false);
        }).catch((err: any) => {
            console.error(err);
            setAccuracyLoading(false);
        });

    }, [basin]);

    const chartData = useMemo(() => {
        if (!basin) return [];
        
        const nowTime = new Date();
        const future3H = new Date(nowTime.getTime() + 3 * 60 * 60 * 1000);
        const future12H = new Date(nowTime.getTime() + 12 * 60 * 60 * 1000);

        const currentPoint = { 
            time: 'Now', 
            history_level: basin.current_level, 
            predicted_level: basin.current_level 
        };

        const futurePoint1 = { 
            time: '+3H (' + future3H.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit' }) + ')', 
            history_level: null, 
            predicted_level: basin.pred_3h 
        };

        const futurePoint2 = { 
            time: '+12H (' + future12H.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit' }) + ')', 
            history_level: null, 
            predicted_level: basin.pred_12h 
        };

        return [...history, currentPoint, futurePoint1, futurePoint2];
    }, [basin, history]);

    if (loading || !basin) {
        return <div className="text-white p-6">Loading Predictions...</div>;
    }

    const maxLevel = Math.max(basin.current_level, basin.pred_3h, basin.pred_12h);
    const isCritical = basin.risk_12h === 'Major Flood' || basin.risk_3h === 'Major Flood';
    const isHigh = basin.risk_12h === 'Minor Flood' || basin.risk_3h === 'Minor Flood';
    
    let riskLevel = 'LOW';
    let riskColor = 'text-emerald-400';
    let riskBg = 'bg-emerald-500/10 border-emerald-500/30';
    if (isCritical) { riskLevel = 'CRITICAL'; riskColor = 'text-red-400'; riskBg = 'bg-red-500/10 border-red-500/30'; }
    else if (isHigh) { riskLevel = 'HIGH'; riskColor = 'text-orange-400'; riskBg = 'bg-orange-500/10 border-orange-500/30'; }

    return (
        <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-6 border-b border-purple-700">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 flex items-center gap-3">
                    <TrendingUp size={32} /> Flood Prediction Engine
                </h1>
                <p className="text-purple-300/70 mt-1">
                    AI-powered predictive forecasts combined with historical accuracy evaluation.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Left: Station Overview Cards */}
                <div className="lg:col-span-3 bg-slate-800 border-r border-slate-700 p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)]">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monitored Stations</h3>

                    {stations.map((s, i) => {
                        const isSCritical = s.risk_12h === 'Major Flood' || s.risk_3h === 'Major Flood';
                        const isSHigh = s.risk_12h === 'Minor Flood' || s.risk_3h === 'Minor Flood';
                        let sRiskLevel = isSCritical ? 'CRITICAL' : isSHigh ? 'HIGH' : 'LOW';
                        let sRiskColor = isSCritical ? 'text-red-400' : isSHigh ? 'text-orange-400' : 'text-emerald-400';
                        let sRiskBg = isSCritical ? 'bg-red-500/10 border-red-500/30' : isSHigh ? 'bg-orange-500/10 border-orange-500/30' : 'bg-emerald-500/10 border-emerald-500/30';
                        return (
                        <button
                            key={s.station_id}
                            onClick={() => setSelectedStationIdx(i)}
                            className={`w-full text-left rounded-xl p-3 border transition ${i === selectedStationIdx ? 'bg-purple-600/20 border-purple-500/50' : 'bg-slate-900/60 border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-slate-200">{s.station_name}</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${sRiskBg} ${sRiskColor}`}>
                                    {sRiskLevel}
                                </span>
                            </div>
                            <div className="flex gap-3 mt-2 text-[10px] text-slate-500">
                                <span>Now: <span className="text-slate-300 font-bold">{s.current_level}m</span></span>
                                <span>Peak: <span className={`font-bold ${sRiskColor}`}>{Math.max(s.current_level, s.pred_3h, s.pred_12h).toFixed(2)}m</span></span>
                            </div>
                        </button>
                    )})}
                </div>

                {/* Center: Main Forecast Charts */}
                <div className="lg:col-span-6 p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {/* Risk Banner */}
                    <div className={`rounded-xl p-4 border ${riskBg} flex items-start gap-3`}>
                        <AlertTriangle size={24} className={riskColor} />
                        <div>
                            <h3 className={`text-lg font-black ${riskColor}`}>{riskLevel} RISK — {basin.station_name} ({basin.river_basin})</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                Peak predicted level: <span className="text-white font-bold">{maxLevel.toFixed(2)}m</span> over the next 12 hours.
                                {basin.risk_12h !== 'Normal' && <span className="text-orange-400 ml-1"> 12H Risk: {basin.risk_12h}.</span>}
                            </p>
                        </div>
                    </div>

                    {/* Water Level Prediction Chart */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                                <Droplets size={14} className="text-cyan-400" /> Past 24 Hours + 12-Hour Forecast
                            </h4>
                            {historyLoading && <span className="text-xs text-slate-500 animate-pulse">Fetching history...</span>}
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} interval="preserveEnd" minTickGap={30} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                                    <Legend wrapperStyle={{ fontSize: 10 }} />
                                    <ReferenceLine y={basin.major_flood_level} stroke="#ef4444" strokeWidth={2} label={{ value: 'Major Flood', fill: '#ef4444', fontSize: 9 }} />
                                    <ReferenceLine y={basin.minor_flood_level} stroke="#f97316" strokeDasharray="4 3" label={{ value: 'Minor Flood', fill: '#f97316', fontSize: 9 }} />
                                    
                                    {/* History Line */}
                                    <Area type="monotone" dataKey="history_level" stroke="#38bdf8" strokeWidth={2} fill="#38bdf8" fillOpacity={0.15} name="Historical Level (m)" isAnimationActive={false} />
                                    
                                    {/* Future Prediction Line */}
                                    <Area type="monotone" dataKey="predicted_level" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" fill="#a855f7" fillOpacity={0.15} name="Predicted Level (m)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3H Accuracy Evaluation Chart */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                                <Activity size={14} className="text-emerald-400" /> 3H Historic Prediction Accuracy
                            </h4>
                            {accuracyLoading && <span className="text-xs text-slate-500 animate-pulse">Fetching accuracy...</span>}
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={accuracyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} interval="preserveEnd" minTickGap={30} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, (dataMax: number) => Math.max(dataMax, basin?.major_flood_level || 5) * 1.2]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: '10px' }} />
                                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} name="Actual Recorded" isAnimationActive={false} />
                                    <Line type="monotone" dataKey="predicted_3h" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="3H AI Prediction" />
                                    <Brush dataKey="time" height={25} stroke="#334155" fill="#0f172a" tickFormatter={() => ''} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 12H Accuracy Evaluation Chart */}
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-1.5">
                                <Activity size={14} className="text-purple-400" /> 12H Historic Prediction Accuracy
                            </h4>
                            {accuracyLoading && <span className="text-xs text-slate-500 animate-pulse">Fetching accuracy...</span>}
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={accuracyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} interval="preserveEnd" minTickGap={30} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, (dataMax: number) => Math.max(dataMax, basin?.major_flood_level || 5) * 1.2]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: '10px' }} />
                                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={false} name="Actual Recorded" isAnimationActive={false} />
                                    <Line type="monotone" dataKey="predicted_12h" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="12H AI Prediction" />
                                    <Brush dataKey="time" height={25} stroke="#334155" fill="#0f172a" tickFormatter={() => ''} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* Right: Metrics & Recommendations */}
                <div className="lg:col-span-3 bg-slate-800 border-l border-slate-700 p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {/* Current Conditions */}
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Conditions</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                            <Droplets size={14} className="text-cyan-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">Current Level</p>
                            <p className="text-lg font-black text-cyan-300">{basin.current_level}m</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                            <Target size={14} className="text-purple-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">Predicted Peak</p>
                            <p className={`text-lg font-black ${riskColor}`}>{maxLevel.toFixed(2)}m</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                            <Thermometer size={14} className="text-orange-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">+3H Forecast</p>
                            <p className="text-lg font-black text-orange-300">{basin.pred_3h.toFixed(2)}m</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                            <Wind size={14} className="text-slate-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">+12H Risk</p>
                            <p className="text-sm font-black text-slate-300">{basin.risk_12h}</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                            <CloudRain size={14} className="text-blue-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">Current Rain</p>
                            <p className="text-lg font-black text-blue-300">{basin.rainfall_mm}mm</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                            <CloudRain size={14} className="text-indigo-400 mx-auto mb-1" />
                            <p className="text-[10px] text-slate-500">24H Rainfall</p>
                            <p className="text-lg font-black text-indigo-300">{basin.rainfall_24h}mm</p>
                        </div>
                    </div>

                    {/* Threshold Levels */}
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alert Thresholds</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2">
                            <span className="text-xs text-orange-400 font-bold">Minor Flood</span>
                            <span className="text-sm font-black text-orange-300">{basin.minor_flood_level}m</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            <span className="text-xs text-red-400 font-bold">Major Flood</span>
                            <span className="text-sm font-black text-red-300">{basin.major_flood_level}m</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-3 mt-4">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Activity size={10} /> Prediction Model
                        </p>
                        <p className="text-xs text-slate-400">Live API Inference</p>
                        <p className="text-[10px] text-slate-500 mt-1">Trained on features extracted via FastAPI / XGBoost backend.</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Last updated: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionsPage;
