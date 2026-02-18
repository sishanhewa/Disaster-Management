import { useState, useEffect } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { Calendar, Clock, Droplets, CloudRain } from 'lucide-react';
import { predictionsApi } from '../../api/endpoints';

const TimeTravelCharts = ({ stations = [] }: { stations: any[] }) => {
    // We start off attempting to grab the first known station from the fetched array
    const defaultStationId = stations.length > 0 ? stations[0].station_id : 1;
    const [selectedStationId, setSelectedStationId] = useState<number>(defaultStationId);
    const [viewMode, setViewMode] = useState<'hourly' | 'weekly'>('hourly');

    const [chartData, setChartData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Sync default when stations arrive from parent async fetch
    useEffect(() => {
        if (stations.length > 0 && selectedStationId === 1 && !stations.find((s:any) => s.station_id === 1)) {
            setSelectedStationId(stations[0].station_id);
        }
    }, [stations]);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const daysToFetch = viewMode === 'hourly' ? 1 : 7;
                const data = await predictionsApi.getHistory(selectedStationId, daysToFetch);
                
                const mappedData = data.map((d: any) => {
                    const date = new Date(d.observed_at + 'Z');
                    
                    // Formatting the X axis nicely
                    let timeLabel = '';
                    if (viewMode === 'hourly') {
                        timeLabel = date.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit' });
                    } else {
                        const month = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', month: 'short' });
                        const day = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', day: '2-digit' });
                        const hrs = date.toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', hour12: false });
                        timeLabel = `${month} ${day} ${hrs}:00`;
                    }

                    return {
                        time: timeLabel,
                        timestamp: date.getTime(),
                        water_level: d.water_level,
                        rainfall: d.rainfall_mm
                    };
                });

                setChartData(mappedData);
            } catch (err) {
                console.error("Failed fetching station history logs", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (selectedStationId) {
            fetchHistory();
        }
    }, [selectedStationId, viewMode]);

    // Compute Summaries safely
    const maxLevel = chartData.length > 0 ? Math.max(...chartData.map(h => h.water_level)) : 0;
    const totalRain = chartData.reduce((s, h) => s + (h.rainfall || 0), 0);
    const currentStationObj = stations.find((s: any) => s.station_id === selectedStationId);

    return (
        <div className="space-y-4">
            {/* Controls Row */}
            <div className="flex flex-wrap gap-3 items-center">
                
                {/* Basin/Station Selector */}
                <select
                    className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
                    value={selectedStationId}
                    onChange={(e) => setSelectedStationId(Number(e.target.value))}
                >
                    {stations.map(b => (
                        <option key={b.station_id} value={b.station_id}>
                            {b.station_name} ({b.river_basin})
                        </option>
                    ))}
                    {stations.length === 0 && <option value={1}>Loading Stations...</option>}
                </select>

                {/* View Mode */}
                <div className="flex rounded-lg overflow-hidden border border-slate-700">
                    <button
                        onClick={() => setViewMode('hourly')}
                        className={`px-3 py-1.5 text-xs font-bold ${viewMode === 'hourly' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    ><Clock size={12} className="inline mr-1" />24-Hour Range</button>
                    <button
                        onClick={() => setViewMode('weekly')}
                        className={`px-3 py-1.5 text-xs font-bold ${viewMode === 'weekly' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                    ><Calendar size={12} className="inline mr-1" />Weekly History</button>
                </div>

                {isLoading && <span className="text-xs text-slate-500 animate-pulse ml-2">Syncing History Protocol...</span>}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Recorded Peak Water Level</p>
                    <p className={`text-lg font-black ${maxLevel > (currentStationObj?.major_flood_level || 999) ? 'text-red-400' : 'text-cyan-300'}`}>
                        {maxLevel.toFixed(2)} m
                    </p>
                </div>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-center">
                    <p className="text-[10px] uppercase text-slate-500 tracking-widest">Accumulated Total Rainfall</p>
                    <p className="text-lg font-black text-blue-300">{totalRain.toFixed(1)} mm</p>
                </div>
            </div>

            {/* Water Level Chart */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <Droplets size={12} className="text-cyan-400" />
                    Historic Water Levels for {currentStationObj?.station_name || 'Station'}
                </h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} interval="preserveEnd" minTickGap={40} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            
                            {currentStationObj?.major_flood_level && (
                                <ReferenceLine y={currentStationObj.major_flood_level} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Major Flood', fill: '#ef4444', fontSize: 9 }} />
                            )}
                            {currentStationObj?.minor_flood_level && (
                                <ReferenceLine y={currentStationObj.minor_flood_level} stroke="#eab308" strokeDasharray="3 3" label={{ value: 'Minor Flood', fill: '#eab308', fontSize: 9 }} />
                            )}
                            
                            <Area type="monotone" dataKey="water_level" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} name="Water Level (m)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Rainfall Chart */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1">
                    <CloudRain size={12} className="text-blue-400" />
                    Rainfall
                </h4>
                <div className="h-36">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} interval="preserveEnd" minTickGap={40} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="rainfall" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Rainfall (mm)" isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
        </div>
    );
};

export default TimeTravelCharts;
