import { useState, useMemo } from 'react';
import { Waves, Droplets, TrendingUp, Search, RefreshCw, X, Clock, AlertTriangle } from 'lucide-react';

const LEVEL_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    NORMAL: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
    ALERT: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
    MINOR_FLOOD: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500' },
    MAJOR_FLOOD: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
};

const LEVEL_STYLES_LIGHT: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    NORMAL: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    ALERT: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    MINOR_FLOOD: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    MAJOR_FLOOD: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

interface FloodDashboardPanelProps {
    isOpen: boolean;
    onClose: () => void;
    floodData: any;
    isLoading: boolean;
    onRefresh: () => void;
    onSelectGauge: (gauge: any) => void;
    selectedGauge: any | null;
}

export default function FloodDashboardPanel({ isOpen, onClose, floodData, isLoading, onRefresh, onSelectGauge, selectedGauge }: FloodDashboardPanelProps) {
    
    
    const styles = LEVEL_STYLES;

    const [filterLevel, setFilterLevel] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'waterLevel' | 'alertLevel'>('alertLevel');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const gauges = floodData?.gauges || [];
    
    const counts = {
        NORMAL: gauges.filter((g: any) => g.alertLevel === 'NORMAL').length,
        ALERT: gauges.filter((g: any) => g.alertLevel === 'ALERT').length,
        MINOR_FLOOD: gauges.filter((g: any) => g.alertLevel === 'MINOR_FLOOD').length,
        MAJOR_FLOOD: gauges.filter((g: any) => g.alertLevel === 'MAJOR_FLOOD').length,
        total: gauges.length
    };

    const highestWaterLevel = useMemo(() => {
        if (!gauges.length) return 0;
        return Math.max(...gauges.map((g: any) => g.waterLevel || 0));
    }, [gauges]);

    const highestStation = useMemo(() => {
        if (!gauges.length) return null;
        return gauges.reduce((prev: any, current: any) => (+prev.waterLevel > +current.waterLevel) ? prev : current)?.stationName;
    }, [gauges]);

    const filteredGauges = useMemo(() => {
        let result = [...gauges];
        if (filterLevel !== 'all') {
            result = result.filter(g => g.alertLevel === filterLevel);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(g =>
                g.stationName.toLowerCase().includes(q) ||
                (g.basin && g.basin.toLowerCase().includes(q))
            );
        }
        const alertOrder: any = { MAJOR_FLOOD: 4, MINOR_FLOOD: 3, ALERT: 2, NORMAL: 1 };
        result.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'alertLevel') {
                cmp = (alertOrder[a.alertLevel] || 0) - (alertOrder[b.alertLevel] || 0);
            } else if (sortBy === 'waterLevel') {
                cmp = (a.waterLevel ?? -999) - (b.waterLevel ?? -999);
            } else {
                cmp = a.stationName.localeCompare(b.stationName);
            }
            return sortDir === 'desc' ? -cmp : cmp;
        });
        return result;
    }, [gauges, filterLevel, searchQuery, sortBy, sortDir]);

    if (!isOpen) return null;

    const panelBg = 'bg-slate-900/95 border-slate-800 text-white';
    const cardBg = 'bg-slate-800/50 border-slate-700';
    const inputBg = 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:ring-sky-500';

    return (
        <div className={`absolute top-0 right-0 h-full w-full sm:w-[380px] z-[1050] border-l backdrop-blur-xl shadow-2xl flex flex-col transition-transform duration-300 ${panelBg}`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b border-slate-800`}>
                <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-sky-500" />
                    <h2 className="font-bold text-sm">Flood Monitoring</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className={`p-1.5 rounded-lg transition-colors hover:bg-slate-800 text-slate-400`}
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors hover:bg-rose-500/10 text-rose-400`}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                    {(['NORMAL', 'ALERT', 'MINOR_FLOOD', 'MAJOR_FLOOD'] as const).map((level) => {
                        const s = styles[level] || styles.NORMAL;
                        const label = level === 'MINOR_FLOOD' ? 'Minor' : level === 'MAJOR_FLOOD' ? 'Major' : level;
                        return (
                            <button
                                key={level}
                                onClick={() => setFilterLevel(filterLevel === level ? 'all' : level)}
                                className={`rounded-xl border p-2 text-center transition-all ${s.bg} ${s.border} ${filterLevel === level ? 'ring-2 ring-offset-1 ring-sky-500' : 'hover:opacity-80'}`}
                            >
                                <div className={`text-lg font-black ${s.text}`}>{counts[level]}</div>
                                <div className={`text-[9px] uppercase font-bold tracking-wider ${s.text} opacity-80`}>{label}</div>
                            </button>
                        );
                    })}
                </div>

                <div className={`rounded-xl border p-3 ${cardBg}`}>
                    <div className={`text-[10px] uppercase tracking-wider font-bold text-slate-400`}> Highest Water Level </div>
                    <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="w-5 h-5 text-sky-500" />
                        <span className="font-black text-xl">{highestWaterLevel > 0 ? `${highestWaterLevel.toFixed(2)}ft` : '—'}</span>
                    </div>
                    {highestStation && <div className={`text-[10px] mt-1 font-medium text-slate-400`}>{highestStation}</div>}
                </div>

                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search station or basin..."
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${inputBg}`}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider text-slate-400`}>Sort:</span>
                    {(['alertLevel', 'waterLevel', 'name'] as const).map((field) => (
                        <button
                            key={field}
                            onClick={() => {
                                if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
                                else { setSortBy(field); setSortDir('desc'); }
                            }}
                            className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${sortBy === field
                                    ? ('bg-sky-500/20 border-sky-500/30 text-sky-400')
                                    : ('border-slate-700 text-slate-400 hover:bg-slate-800')
                                }`}
                        >
                            {field === 'alertLevel' ? 'Severity' : field === 'waterLevel' ? 'Level' : 'Name'}
                            {sortBy === field && (sortDir === 'desc' ? ' ↓' : ' ↑')}
                        </button>
                    ))}
                    <span className={`text-[10px] ml-auto font-medium text-slate-400`}>
                        {filteredGauges.length} stations
                    </span>
                </div>

                <div className="space-y-2">
                    {filteredGauges.length === 0 && (
                        <div className={`text-center py-8 text-sm font-medium text-slate-400`}>
                            {isLoading ? 'Loading flood data...' : 'No gauges match filters'}
                        </div>
                    )}
                    {filteredGauges.map((gauge: any, i: number) => {
                        const s = styles[gauge.alertLevel] || styles.NORMAL;
                        const isSelected = selectedGauge?.stationName === gauge.stationName;
                        return (
                            <button
                                key={i}
                                onClick={() => onSelectGauge(isSelected ? null : gauge)}
                                className={`w-full text-left rounded-xl border p-3 transition-all ${isSelected
                                        ? ('bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/50')
                                        : ('bg-slate-800/30 border-slate-800 hover:bg-slate-800/80')
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                                            <span className="font-bold text-sm truncate">{gauge.stationName}</span>
                                        </div>
                                        {gauge.basin && (
                                            <div className={`text-[10px] mt-0.5 font-medium truncate text-slate-400`}>
                                                {gauge.basin} basin
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-sm font-black ${s.text}`}>{gauge.waterLevel.toFixed(1)}ft</span>
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${s.bg} ${s.text}`}>
                                            {gauge.alertLevel}
                                        </span>
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className={`mt-3 pt-3 border-t space-y-2 relative border-slate-700`}>
                                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                                            <div className="flex items-center gap-1.5">
                                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                                <span className={'text-slate-400'}>Threshold:</span>
                                                <span className="font-bold">{gauge.alertThreshold}ft</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-indigo-500" />
                                                <span className={'text-slate-400'}>Recorded:</span>
                                                <span className="font-bold">{new Date(gauge.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
