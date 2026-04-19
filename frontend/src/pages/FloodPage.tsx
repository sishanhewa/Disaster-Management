import { useQuery } from '@tanstack/react-query';
import { 
  Waves, Droplets, Activity, Clock, AlertTriangle, CheckCircle2, XCircle,
  Loader2, RefreshCw, Search, ArrowUp, ArrowDown
} from 'lucide-react';
import { floodApi } from '../api/endpoints';
import { StatCard } from '../components/common/StatCard';

const ALERT_LEVELS: Record<string, { label: string, color: string, bg: string }> = {
  NORMAL: { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  ALERT: { label: 'Alert', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  MINOR_FLOOD: { label: 'Minor Flood', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  MAJOR_FLOOD: { label: 'Major Flood', color: 'text-red-400', bg: 'bg-red-500/20' },
};

export default function FloodPage() {
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['floodDashboard'],
    queryFn: floodApi.getFloodDashboard,
    refetchInterval: 300000, 
  });

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-80px)] rounded-xl font-sans space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Flood & River Monitoring
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2 font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Live telemetry from ArcGIS Gauge Stations and Rivernet IoT devices
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-bold hover:bg-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-blue-400' : ''}`} />
          {isFetching ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="font-medium text-slate-400">Connecting to telemetry servers...</p>
        </div>
      ) : data ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Stations" value={data.totalStations} icon={Waves} color="text-blue-400 bg-blue-500/10 border-blue-500/20" />
            <StatCard title="Alert Status" value={data.alertCount} icon={Activity} color="text-amber-400 bg-amber-500/10 border-amber-500/20" />
            <StatCard title="Minor Flood" value={data.minorFloodCount} icon={Activity} color="text-orange-400 bg-orange-500/10 border-orange-500/20" />
            <StatCard title="Major Flood" value={data.majorFloodCount} icon={AlertTriangle} color="text-red-400 bg-red-500/10 border-red-500/20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-1 lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl shadow-lg flex flex-col overflow-hidden">
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  ArcGIS Gauge Stations
                </h3>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Live Grid</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    <tr>
                      <th className="px-5 py-3 border-b border-slate-700">Station</th>
                      <th className="px-5 py-3 border-b border-slate-700">Basin</th>
                      <th className="px-5 py-3 border-b border-slate-700 text-center">Water Level (ft)</th>
                      <th className="px-5 py-3 border-b border-slate-700">Status</th>
                      <th className="px-5 py-3 border-b border-slate-700">Recorded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {data.gauges.map((gauge: any, i: number) => {
                      const status = ALERT_LEVELS[gauge.alertLevel] || ALERT_LEVELS.NORMAL;
                      return (
                        <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-200">{gauge.stationName}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{gauge.source}</div>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-400">{gauge.basin}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {gauge.waterLevel > gauge.alertThreshold ? <ArrowUp className="w-3.5 h-3.5 text-red-500" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-500" />}
                              <span className="font-black text-lg text-white">{gauge.waterLevel.toFixed(2)}</span>
                            </div>
                            <div className="text-[10px] text-center font-medium mt-0.5 text-slate-500">Threshold: {gauge.alertThreshold}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-sm border border-slate-700/50 text-[10px] font-black tracking-tighter uppercase whitespace-nowrap ${status.bg} ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(gauge.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-5 flex flex-col h-full space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                <Search className="w-5 h-5 text-emerald-400" />
                Rivernet IoT Status
              </h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {data.rivernetDevices.map((device: any) => (
                  <div key={device.deviceKey} className="p-4 bg-slate-900/40 border border-slate-700 rounded-xl flex items-center justify-between hover:border-slate-600 transition">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-200">{device.name}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{device.basin} Basin</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                        <Clock className="w-3 h-3" />
                        Sync: {new Date(device.lastSyncedAt).toLocaleString()}
                      </div>
                    </div>
                    {device.isOnline ? (
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
                        <XCircle className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
