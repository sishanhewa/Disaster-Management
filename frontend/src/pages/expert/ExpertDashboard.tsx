import { useEffect, useState } from 'react';
import { predictionsApi } from '../../api/endpoints';
import { AlertTriangle, Activity, Map as MapIcon, Clock, HardDriveDownload } from 'lucide-react';
import SmartMap from './SmartMap';
import HazardSpeedometers from './HazardSpeedometers';
import TimeTravelCharts from './TimeTravelCharts';
import SelectedFeaturePanel from './SelectedFeaturePanel';

// The Main "Brain" Dashboard for Experts
const ExpertDashboard = () => {
    const [liveData, setLiveData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // State for the selected map feature
    const [selectedFeature, setSelectedFeature] = useState<{
        attributes: Record<string, any>;
        layerTitle: string;
    } | null>(null);

    useEffect(() => {
        const fetchLiveData = async () => {
            try {
                const response = await predictionsApi.getAllStatus();
                setLiveData(response);
            } catch (error) {
                console.error("Failed to fetch disaster data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveData();
        // Since prediction cycles run roughly every 15m, polling at 1m is safe.
        const interval = setInterval(fetchLiveData, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleFeatureSelected = (attributes: Record<string, any> | null, layerTitle: string) => {
        if (attributes) {
            setSelectedFeature({ attributes, layerTitle });
        } else {
            setSelectedFeature(null);
        }
    };

    return (
        <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] p-6 rounded-xl border border-slate-700 font-sans">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        SIDMS Core Intelligence
                    </h1>
                    <p className="text-slate-400 flex items-center gap-2 mt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        System Online • Connected to Global Hazard Feeds
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 flex items-center gap-2 rounded-lg font-semibold transition border border-slate-600"
                    >
                        <HardDriveDownload size={18} />
                        Instant Briefing PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Panel: Selected Feature Details / Hazard Speedometers & Alerts */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Selected Feature Detail Panel — appears when user clicks the map */}
                    {selectedFeature && (
                        <SelectedFeaturePanel
                            attributes={selectedFeature.attributes}
                            layerTitle={selectedFeature.layerTitle}
                            onClose={() => setSelectedFeature(null)}
                        />
                    )}

                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-blue-300">
                            <Activity size={20} /> Station Threat Levels
                        </h2>
                        <HazardSpeedometers data={liveData} loading={loading} />
                    </div>

                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg flex-grow">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-amber-400">
                            <AlertTriangle size={20} /> Active AI Warnings
                        </h2>
                        <div className="space-y-3">
                            {liveData.filter(d => d.risk_12h === 'Major Flood' || d.risk_3h === 'Major Flood' || d.risk_12h === 'Minor Flood' || d.risk_3h === 'Minor Flood').length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No critical hazards detected by AI at this time.</p>
                            ) : (
                                liveData.filter(d => d.risk_12h === 'Major Flood' || d.risk_3h === 'Major Flood' || d.risk_12h === 'Minor Flood' || d.risk_3h === 'Minor Flood').map((alert, idx) => {
                                    const isRed = alert.risk_12h === 'Major Flood' || alert.risk_3h === 'Major Flood';
                                    const highestRisk = isRed ? 'Major Flood' : 'Minor Flood';
                                    return (
                                        <div key={idx} className={`${isRed ? 'bg-red-900/40 border-red-500/50 text-red-400' : 'bg-orange-900/40 border-orange-500/50 text-orange-400'} border p-3 rounded-md`}>
                                            <p className="font-bold text-sm">Target: {alert.station_name} Array</p>
                                            <p className={`text-xs mt-1 ${isRed ? 'text-red-200' : 'text-orange-200'}`}>
                                                {highestRisk} Risk predicted. 12H Peak Model: {alert.pred_12h.toFixed(2)}m (Minor: {alert.minor_flood_level}m / Major: {alert.major_flood_level}m).
                                            </p>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Center Panel: Smart Map */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center z-10">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-blue-300">
                                <MapIcon size={20} /> Tactical Smart Map
                            </h2>
                            <div className="flex gap-2 text-xs">
                                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">Hydrostations</span>
                                <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">Flood Risk Zones</span>
                            </div>
                        </div>
                        <div className="flex-grow relative z-0">
                            <SmartMap onFeatureSelected={handleFeatureSelected} />
                        </div>
                    </div>

                    {/* Bottom Panel: Time-Travel Charts */}
                    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
                        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-purple-400">
                            <Clock size={20} /> Historic Water Levels
                        </h2>
                        <TimeTravelCharts stations={liveData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpertDashboard;
