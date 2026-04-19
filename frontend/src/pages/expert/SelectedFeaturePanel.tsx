
import { MapPin, Droplets, X } from 'lucide-react';

interface SelectedFeaturePanelProps {
    attributes: Record<string, any>;
    layerTitle: string;
    onClose: () => void;
}

const IGNORED_KEYS = ['FID', 'OBJECTID', 'Shape__Area', 'Shape__Length', 'SHAPE_Area', 'SHAPE_Length', 'shape_area', 'shape_length', 'globalid', 'GlobalID'];

const DANGER_COLORS: Record<string, string> = {
    '1': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    '2': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    '3': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    '4': 'bg-red-500/20 text-red-300 border-red-500/30',
    'Low': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Medium': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'High': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Very High': 'bg-red-500/20 text-red-300 border-red-500/30',
};

// Detect water-level or hazard fields for gauge display
const GAUGE_FIELDS = ['water_level', 'waterlevel', 'level', 'value', 'discharge', 'flow', 'rainfall', 'total_rain', 'depth', 'elevation'];

const getGaugeValue = (attrs: Record<string, any>): { label: string; value: number; unit: string } | null => {
    const entry = Object.entries(attrs).find(([k]) =>
        GAUGE_FIELDS.some(gf => k.toLowerCase().includes(gf))
    );
    if (!entry) return null;
    const num = parseFloat(entry[1]);
    if (isNaN(num)) return null;
    return { label: entry[0], value: num, unit: 'm' };
};

const MiniGauge = ({ value, max = 10 }: { value: number; max?: number }) => {
    const pct = Math.min(100, (value / max) * 100);
    const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f97316' : pct > 40 ? '#eab308' : '#22c55e';
    return (
        <div className="w-full bg-slate-700 rounded-full h-3 mt-1 overflow-hidden">
            <div
                className="h-3 rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: color }}
            />
        </div>
    );
};

const SelectedFeaturePanel = ({ attributes, layerTitle, onClose }: SelectedFeaturePanelProps) => {
    const displayEntries = Object.entries(attributes).filter(
        ([k, v]) => !IGNORED_KEYS.includes(k) && v !== null && v !== undefined && v !== '' && v !== 0
    );

    const gauge = getGaugeValue(attributes);

    return (
        <div className="bg-slate-800 rounded-xl border border-blue-500/40 shadow-lg shadow-blue-900/20 overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600/20 border-b border-blue-500/30 px-4 py-3 flex justify-between items-center">
                <h2 className="text-sm font-bold flex items-center gap-2 text-blue-300">
                    <MapPin size={16} /> {layerTitle || 'Feature Details'}
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition">
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
                {/* Live gauge if a numeric measurement is found */}
                {gauge && (
                    <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <Droplets size={12} /> Live Measurement
                        </p>
                        <div className="flex justify-between items-baseline">
                            <span className="text-2xl font-black text-blue-300">{gauge.value.toFixed(2)}</span>
                            <span className="text-xs text-slate-400">{gauge.unit}</span>
                        </div>
                        <MiniGauge value={gauge.value} max={10} />
                        <p className="text-[10px] text-slate-500 mt-1 capitalize">{gauge.label.replace(/_/g, ' ')}</p>
                    </div>
                )}

                {/* All attribute fields */}
                <div className="space-y-1.5">
                    {displayEntries.map(([key, value]) => {
                        const displayKey = key.replace(/_/g, ' ');
                        const dangerClass = DANGER_COLORS[String(value)];
                        return (
                            <div key={key} className="flex justify-between items-start gap-2 py-1 border-b border-slate-700/60">
                                <span className="text-xs text-slate-400 capitalize font-medium flex-shrink-0 max-w-[45%]">{displayKey}</span>
                                {dangerClass ? (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${dangerClass}`}>{value}</span>
                                ) : (
                                    <span className="text-xs text-slate-200 font-semibold text-right break-words max-w-[55%]">{String(value)}</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {displayEntries.length === 0 && (
                    <p className="text-xs text-slate-500 italic text-center py-4">No attributes available for this feature.</p>
                )}
            </div>
        </div>
    );
};

export default SelectedFeaturePanel;
