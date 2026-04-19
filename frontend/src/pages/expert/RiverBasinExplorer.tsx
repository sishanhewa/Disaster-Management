import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Droplets, MapPin, ChevronRight, Search, Waves, Mountain, TriangleAlert, Layers, Activity } from 'lucide-react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import HydrostationDetail from './HydrostationDetail';

const ARCGIS_BASE = 'https://services3.arcgis.com/J7ZFXmR8rSmQ3FGf/arcgis/rest/services';

// River basin groups in Flood_Map FeatureServer (each group starts with River_Basin at these layer IDs)
const RIVER_BASIN_LAYERS = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81];

// Hydrostations (from separate service)
// Hydrostations (from separate service — reserved for future use)

interface RiverBasin {
    OBJECTID: number;
    Wshed_Name: string;
    Wshed_No: number;
    SubRivBasN: string;
    Sub_RivBas: number;
    Area: number;
}

interface FloodZone {
    OBJECTID: number;
    province_n: string;
    district_n: string;
    dsd_name: string;
    Flooding_area: string;
    Shape__Area: number;
}

interface GaugeStation {
    gauge: string;
    basin: string;
    water_level: number;
    rain_fall: number;
    alertpull: number;
    minorpull: number;
    majorpull: number;
}

const fetchFeatures = async (url: string) => {
    try {
        const res = await axios.get(`${url}/query`, {
            params: { where: '1=1', outFields: '*', returnGeometry: false, f: 'json', resultRecordCount: 1000 }
        });
        return res.data.features?.map((f: any) => f.attributes) || [];
    } catch { return []; }
};

const RiverBasinExplorer = () => {
    const [allBasins, setAllBasins] = useState<RiverBasin[]>([]);
    const [floodZones, setFloodZones] = useState<FloodZone[]>([]);
    const [stations, setStations] = useState<GaugeStation[]>([]);
    const [selectedBasin, setSelectedBasin] = useState<string | null>(null);
    const [selectedStation, setSelectedStation] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'basins' | 'floods' | 'stations'>('basins');
    const mapDiv = useRef<HTMLDivElement>(null);

    // Fetch all river basin data from multiple layers
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);

            // Fetch basin sub-areas from all 18 River_Basin layer IDs
            const basinPromises = RIVER_BASIN_LAYERS.map(id =>
                fetchFeatures(`${ARCGIS_BASE}/Flood_Map/FeatureServer/${id}`)
            );
            const basinResults = await Promise.all(basinPromises);
            const basins = basinResults.flat().filter((b: any) => b.Wshed_Name);

            // Fetch flood inundation DSD data (layer 85 - master flood layer)
            const floods = await fetchFeatures(`${ARCGIS_BASE}/Flood_Map/FeatureServer/85`);

            // Fetch latest gauge readings for all stations
            const gaugeRes = await axios.get(`${ARCGIS_BASE}/gauges_2_view/FeatureServer/0/query`, {
                params: {
                    where: '1=1', outFields: 'gauge,basin,water_level,rain_fall,alertpull,minorpull,majorpull,CreationDate',
                    returnGeometry: false, f: 'json', orderByFields: 'CreationDate DESC', resultRecordCount: 500
                }
            });
            const allGauges = gaugeRes.data.features?.map((f: any) => f.attributes) || [];
            // Get latest per station
            const latestByStation: Record<string, GaugeStation> = {};
            allGauges.forEach((g: GaugeStation) => {
                if (!latestByStation[g.gauge]) latestByStation[g.gauge] = g;
            });

            setAllBasins(basins);
            setFloodZones(floods);
            setStations(Object.values(latestByStation).sort((a, b) => a.gauge.localeCompare(b.gauge)));
            setLoading(false);
        };
        loadAll();
    }, []);

    // Load ArcGIS map
    useEffect(() => {
        let view: MapView;
        if (mapDiv.current) {
            const webMap = new WebMap({
                portalItem: { id: '35745e77307c45959f095f632d0328d5' }
            });
            view = new MapView({
                container: mapDiv.current,
                map: webMap,
                center: [80.7718, 7.8731],
                zoom: 8,
                popup: { defaultPopupTemplateEnabled: true }
            });
        }
        return () => { if (view) view.destroy(); };
    }, []);

    // Group basins by Wshed_Name
    const basinNames = [...new Set(allBasins.map(b => b.Wshed_Name))].sort();
    const filteredBasins = basinNames.filter(n => n.toLowerCase().includes(search.toLowerCase()));

    const selectedSubBasins = selectedBasin
        ? allBasins.filter(b => b.Wshed_Name === selectedBasin)
        : [];

    const totalArea = selectedSubBasins.reduce((sum, b) => sum + (b.Area || 0), 0);

    // Find flood zones related to selected basin
    const relatedFloodZones = selectedBasin
        ? floodZones.filter(f =>
            f.Flooding_area?.toLowerCase().includes(selectedBasin.toLowerCase().replace(/_/g, ' '))
        )
        : [];

    // Group flood zones by district
    const floodByDistrict: Record<string, FloodZone[]> = {};
    (activeTab === 'floods' ? floodZones : relatedFloodZones).forEach(fz => {
        const key = fz.district_n || 'Unknown';
        if (!floodByDistrict[key]) floodByDistrict[key] = [];
        floodByDistrict[key].push(fz);
    });

    return (
        <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-900 p-6 border-b border-blue-700">
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 flex items-center gap-3">
                    <Waves size={32} /> River Basin & Flood Zone Explorer
                </h1>
                <p className="text-blue-300/70 mt-1">
                    Browse all {basinNames.length} river basins and {floodZones.length} flood inundation zones from ArcGIS
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-180px)]">
                {/* Left Sidebar: Basin List */}
                <div className="lg:col-span-3 bg-slate-800 border-r border-slate-700 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-700">
                        <button
                            onClick={() => { setActiveTab('basins'); setSelectedBasin(null); setSelectedStation(null); }}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 transition ${activeTab === 'basins' ? 'bg-blue-600/20 text-blue-300 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Droplets size={14} /> Basins
                        </button>
                        <button
                            onClick={() => { setActiveTab('stations'); setSelectedBasin(null); setSelectedStation(null); }}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 transition ${activeTab === 'stations' ? 'bg-cyan-600/20 text-cyan-300 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Activity size={14} /> Stations
                        </button>
                        <button
                            onClick={() => { setActiveTab('floods'); setSelectedBasin(null); setSelectedStation(null); }}
                            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1 transition ${activeTab === 'floods' ? 'bg-red-600/20 text-red-300 border-b-2 border-red-400' : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <TriangleAlert size={14} /> Floods
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'basins' ? 'Search basins...' : 'Search districts...'}
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-6 text-center text-slate-400 animate-pulse">Loading data from ArcGIS...</div>
                        ) : activeTab === 'basins' ? (
                            filteredBasins.map(name => {
                                const count = allBasins.filter(b => b.Wshed_Name === name).length;
                                const isActive = selectedBasin === name;
                                return (
                                    <button
                                        key={name}
                                        onClick={() => setSelectedBasin(isActive ? null : name)}
                                        className={`w-full text-left px-4 py-3 border-b border-slate-700/50 flex items-center justify-between transition group ${isActive ? 'bg-blue-600/20 border-l-4 border-l-blue-400' : 'hover:bg-slate-700/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Droplets size={14} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                                            <span className={`text-sm font-semibold truncate ${isActive ? 'text-blue-300' : 'text-slate-300'}`}>
                                                {name.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{count} sub</span>
                                            <ChevronRight size={14} className={`text-slate-500 transition ${isActive ? 'rotate-90 text-blue-400' : 'group-hover:text-slate-300'}`} />
                                        </div>
                                    </button>
                                );
                            })
                        ) : activeTab === 'stations' ? (
                            stations.filter(s => s.gauge.toLowerCase().includes(search.toLowerCase()) || s.basin.toLowerCase().includes(search.toLowerCase())).map(station => {
                                const isActive = selectedStation === station.gauge;
                                const level = station.water_level;
                                const pct = Math.min(100, (level / station.majorpull) * 100);
                                const statusColor = pct > 80 ? 'bg-red-500' : pct > 60 ? 'bg-orange-500' : pct > 40 ? 'bg-yellow-500' : 'bg-emerald-500';
                                return (
                                    <button
                                        key={station.gauge}
                                        onClick={() => setSelectedStation(isActive ? null : station.gauge)}
                                        className={`w-full text-left px-4 py-3 border-b border-slate-700/50 transition group ${isActive ? 'bg-cyan-600/20 border-l-4 border-l-cyan-400' : 'hover:bg-slate-700/50'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="min-w-0">
                                                <span className={`text-sm font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>{station.gauge}</span>
                                                <p className="text-[10px] text-slate-500 truncate">{station.basin}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-slate-200">{level.toFixed(2)}m</span>
                                                    <div className="w-12 h-1.5 bg-slate-700 rounded-full mt-0.5">
                                                        <div className={`h-1.5 rounded-full ${statusColor}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            Object.keys(floodByDistrict).sort().filter(d => d.toLowerCase().includes(search.toLowerCase())).map(district => (
                                <button
                                    key={district}
                                    onClick={() => setSelectedBasin(selectedBasin === district ? null : district)}
                                    className={`w-full text-left px-4 py-3 border-b border-slate-700/50 flex items-center justify-between transition group ${selectedBasin === district ? 'bg-red-600/20 border-l-4 border-l-red-400' : 'hover:bg-slate-700/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <MapPin size={14} className={selectedBasin === district ? 'text-red-400' : 'text-slate-500'} />
                                        <span className={`text-sm font-semibold truncate ${selectedBasin === district ? 'text-red-300' : 'text-slate-300'}`}>
                                            {district}
                                        </span>
                                    </div>
                                    <span className="text-xs bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
                                        {floodByDistrict[district].length} zones
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Center: Map */}
                <div className="lg:col-span-5 relative">
                    <div ref={mapDiv} className="h-full w-full min-h-[500px]"></div>
                </div>

                {/* Right Panel: Details */}
                <div className="lg:col-span-4 bg-slate-800 border-l border-slate-700 overflow-y-auto max-h-[calc(100vh-180px)]">
                    {selectedStation ? (
                        <div>
                            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/30 p-5 border-b border-cyan-700/50">
                                <h2 className="text-xl font-black text-cyan-300 flex items-center gap-2">
                                    <Activity size={22} /> {selectedStation}
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">Live Hydrostation Data from ArcGIS</p>
                            </div>
                            <div className="p-4">
                                <HydrostationDetail stationName={selectedStation} />
                            </div>
                        </div>
                    ) : !selectedBasin ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
                            <Layers size={48} className="mb-4 opacity-30" />
                            <p className="text-center text-sm">Select a {activeTab === 'basins' ? 'river basin' : 'district'} from the left to view details</p>
                        </div>
                    ) : activeTab === 'basins' ? (
                        <div>
                            {/* Basin Header */}
                            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/30 p-5 border-b border-blue-700/50">
                                <h2 className="text-xl font-black text-blue-300 flex items-center gap-2">
                                    <Droplets size={22} /> {selectedBasin.replace(/_/g, ' ')}
                                </h2>
                                <div className="flex gap-4 mt-3">
                                    <div className="bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sub-Basins</p>
                                        <p className="text-lg font-black text-blue-300">{selectedSubBasins.length}</p>
                                    </div>
                                    <div className="bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total Area</p>
                                        <p className="text-lg font-black text-cyan-300">{totalArea.toFixed(1)} km²</p>
                                    </div>
                                    <div className="bg-slate-900/60 rounded-lg px-3 py-2 border border-slate-700">
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Flood Zones</p>
                                        <p className="text-lg font-black text-red-400">{relatedFloodZones.length}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sub-basins Table */}
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                                    <Mountain size={14} /> Sub-River Basins
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-700 text-slate-400">
                                                <th className="text-left py-2 px-2">#</th>
                                                <th className="text-left py-2 px-2">Sub-Basin Name</th>
                                                <th className="text-right py-2 px-2">Area (km²)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedSubBasins.map((sb, i) => (
                                                <tr key={sb.OBJECTID} className="border-b border-slate-700/40 hover:bg-slate-700/30 transition">
                                                    <td className="py-2 px-2 text-slate-500">{i + 1}</td>
                                                    <td className="py-2 px-2 text-slate-200 font-semibold">{sb.SubRivBasN?.replace(/_/g, ' ') || 'N/A'}</td>
                                                    <td className="py-2 px-2 text-right text-cyan-400 font-mono">{sb.Area?.toFixed(1) || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Related Flood Zones */}
                            {relatedFloodZones.length > 0 && (
                                <div className="p-4 border-t border-slate-700">
                                    <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-1.5">
                                        <TriangleAlert size={14} /> Related Flood Inundation Zones
                                    </h3>
                                    <div className="space-y-2">
                                        {relatedFloodZones.slice(0, 20).map((fz, i) => (
                                            <div key={i} className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
                                                <div className="flex justify-between">
                                                    <span className="text-xs font-bold text-red-300">{fz.dsd_name}</span>
                                                    <span className="text-[10px] text-slate-400">{fz.district_n}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 mt-1">{fz.Flooding_area}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">Province: {fz.province_n} • Area: {(fz.Shape__Area / 1e6).toFixed(2)} km²</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Flood tab selected district */
                        <div>
                            <div className="bg-gradient-to-r from-red-900/50 to-orange-900/30 p-5 border-b border-red-700/50">
                                <h2 className="text-xl font-black text-red-300 flex items-center gap-2">
                                    <MapPin size={22} /> {selectedBasin} District
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">{floodByDistrict[selectedBasin]?.length || 0} flood inundation zones</p>
                            </div>
                            <div className="p-4 space-y-2">
                                {(floodByDistrict[selectedBasin] || []).map((fz, i) => (
                                    <div key={i} className="bg-slate-900/60 border border-slate-700 rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <span className="text-sm font-bold text-slate-200">{fz.dsd_name}</span>
                                            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                                                {fz.province_n}
                                            </span>
                                        </div>
                                        <p className="text-xs text-orange-300 mt-1 font-semibold">{fz.Flooding_area}</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Inundation Area: {(fz.Shape__Area / 1e6).toFixed(2)} km²</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiverBasinExplorer;
