import { useState, useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { Calendar, Clock, Droplets, CloudRain } from 'lucide-react';

// ----- Mock Historical Data Generator -----
// Generates deterministic but varied mock data for any date
function generateMockData(dateStr: string) {
    // Simple hash from date string for deterministic randomness
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    const seed = (n: number) => ((Math.abs(hash * (n + 1) * 9301 + 49297) % 233280) / 233280);

    const month = parseInt(dateStr.split('-')[1]);
    const isMonsoon = month >= 5 && month <= 11; // SW & NE monsoon seasons
    const baseLevel = isMonsoon ? 2.2 : 0.8;
    const baseRain = isMonsoon ? 12 : 2;

    const hours = [];
    for (let h = 0; h < 24; h++) {
        const s = seed(h);
        const rainSpike = s > 0.85 ? baseRain * 3 * s : baseRain * s;
        const levelVariation = baseLevel + (s * 1.5) + (h > 12 ? 0.3 : 0);
        hours.push({
            time: `${h.toString().padStart(2, '0')}:00`,
            hour: h,
            water_level: +(levelVariation).toFixed(2),
            rainfall: +(rainSpike).toFixed(1),
            temperature: +(26 + s * 8).toFixed(1),
            humidity: +(65 + s * 30).toFixed(0),
        });
    }
    return hours;
}

// Generate mock data for the 7-day window around a date
function generateWeekData(dateStr: string) {
    const center = new Date(dateStr);
    const days = [];
    for (let i = -3; i <= 3; i++) {
        const d = new Date(center);
        d.setDate(d.getDate() + i);
        const ds = d.toISOString().split('T')[0];
        const hourly = generateMockData(ds);
        const avgLevel = hourly.reduce((s, h) => s + h.water_level, 0) / 24;
        const totalRain = hourly.reduce((s, h) => s + h.rainfall, 0);
        days.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            dateStr: ds,
            avg_water_level: +avgLevel.toFixed(2),
            total_rainfall: +totalRain.toFixed(1),
            max_level: Math.max(...hourly.map(h => h.water_level)),
            min_level: Math.min(...hourly.map(h => h.water_level)),
        });
    }
    return days;
}

// Historical events for context
const NOTABLE_EVENTS: Record<string, string> = {
    '2024-05-17': '🌊 Kelani Ganga floods — 50,000 displaced',
    '2023-09-21': '🌧️ Severe tropical depression — 300mm in 24h',
    '2023-06-03': '⛰️ Ratnapura landslides — 12 casualties',
    '2022-10-15': '🌀 Cyclone Sitrang indirect effects',
    '2024-11-25': '🌊 NE monsoon flooding — Batticaloa',
    '2025-01-10': '⚠️ Minor flood alert — Nilwala Ganga',
};

const BASINS = ['Kelani Ganga', 'Nilwala Ganga', 'Kalu Ganga', 'Mahaweli Ganga', 'Gin Ganga', 'Aththanagalu Oya'];

const TimeTravelCharts = () => {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);
    const [selectedBasin, setSelectedBasin] = useState('Kelani Ganga');
    const [viewMode, setViewMode] = useState<'hourly' | 'weekly'>('hourly');

    const hourlyData = useMemo(() => generateMockData(selectedDate), [selectedDate]);
    const weekData = useMemo(() => generateWeekData(selectedDate), [selectedDate]);

    const isToday = selectedDate === today;
    const isPast = selectedDate < today;
    const event = NOTABLE_EVENTS[selectedDate];

    // Day summary
    const maxLevel = Math.max(...hourlyData.map(h => h.water_level));
    const totalRain = hourlyData.reduce((s, h) => s + h.rainfall, 0);
    const avgTemp = (hourlyData.reduce((s, h) => s + h.temperature, 0) / 24).toFixed(1);

    return (
        <div className="space-y-4">
            {/* Controls Row */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Date Picker */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5">
                    <Calendar size={14} className="text-blue-400" />
                    <input
                        type="date"
                        value={selectedDate}
                        max={today}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
                    />
                </div>

                {/* Basin Selector */}
                <select
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
                    value={selectedBasin}
                    onChange={(e) => setSelectedBasin(e.target.value)}
                >
                    {BASINS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                {/* View Mode */}
                <div className="flex rounded-lg overflow-hidden border border-slate-700">
                    <button
                        onClick={() => setViewMode('hourly')}
                        className={`px-3 py-1.5 text-xs font-bold ${viewMode === 'hourly' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    ><Clock size={12} className="inline mr-1" />Hourly</button>
                    <button
                        onClick={() => setViewMode('weekly')}
                        className={`px-3 py-1.5 text-xs font-bold ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    ><Calendar size={12} className="inline mr-1" />Weekly</button>
                </div>

                {/* Date Badge */}
                <span className={`text-xs font-bold px-2 py-1 rounded ${isToday ? 'bg-emerald-500/20 text-emerald-300' : isPast ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                    {isToday ? '📍 Today' : isPast ? '📜 Historical' : '🔮 Future'}
                </span>
            </div>

            {/* Notable Event Banner */}
            {event && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2 text-sm text-orange-300">
                    <strong>Notable Event:</strong> {event}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Max Water Level</p>
                    <p className={`text-lg font-black ${maxLevel > 4 ? 'text-red-400' : maxLevel > 3 ? 'text-yellow-400' : 'text-cyan-300'}`}>
                        {maxLevel.toFixed(2)} m
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Total Rainfall</p>
                    <p className="text-lg font-black text-blue-300">{totalRain.toFixed(1)} mm</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Avg Temp</p>
                    <p className="text-lg font-black text-orange-300">{avgTemp}°C</p>
                </div>
            </div>

            {/* Water Level Chart */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Droplets size={12} className="text-cyan-400" />
                    {selectedBasin} — Water Level ({viewMode === 'hourly' ? selectedDate : '7-day'})
                </h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={viewMode === 'hourly' ? hourlyData : weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey={viewMode === 'hourly' ? 'time' : 'date'} stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <ReferenceLine y={4.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Major Flood', fill: '#ef4444', fontSize: 9 }} />
                            <ReferenceLine y={3.0} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Alert', fill: '#eab308', fontSize: 9 }} />
                            {viewMode === 'hourly' ? (
                                <Area type="monotone" dataKey="water_level" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} name="Water Level (m)" />
                            ) : (
                                <>
                                    <Area type="monotone" dataKey="avg_water_level" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} name="Avg Level (m)" />
                                    <Area type="monotone" dataKey="max_level" stroke="#f97316" fill="none" strokeDasharray="4 2" strokeWidth={1} name="Max Level (m)" />
                                </>
                            )}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Rainfall Chart */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <CloudRain size={12} className="text-blue-400" />
                    Rainfall ({viewMode === 'hourly' ? 'mm/hour' : 'mm/day'})
                </h4>
                <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={viewMode === 'hourly' ? hourlyData : weekData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey={viewMode === 'hourly' ? 'time' : 'date'} stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey={viewMode === 'hourly' ? 'rainfall' : 'total_rainfall'} fill="#3b82f6" radius={[3, 3, 0, 0]} name="Rainfall (mm)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Date Presets */}
            <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mr-2 self-center">Quick Jump:</span>
                {Object.entries(NOTABLE_EVENTS).map(([date, label]) => (
                    <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`text-[10px] px-2 py-1 rounded border transition ${selectedDate === date ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' : 'border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                            }`}
                        title={label}
                    >
                        {date}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TimeTravelCharts;
