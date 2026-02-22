import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { floodApi } from '../../api/endpoints';
import { Waves, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FloodStatusWidget: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['floodDashboard'],
    queryFn: () => floodApi.getFloodDashboard(),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 animate-pulse h-20" />
    );
  }

  const alertCount: number = data?.alertCount ?? 0;
  const minorCount: number = data?.minorFloodCount ?? 0;
  const majorCount: number = data?.majorFloodCount ?? 0;
  const totalStations: number = data?.totalStations ?? 0;

  const hasAlerts = alertCount > 0 || minorCount > 0 || majorCount > 0;

  return (
    <Link
      to="/flood"
      className={`flex items-center gap-4 rounded-xl border p-4 transition-all hover:brightness-110 ${
        majorCount > 0
          ? 'bg-red-900/20 border-red-500/30'
          : minorCount > 0 || alertCount > 0
          ? 'bg-amber-900/20 border-amber-500/30'
          : 'bg-emerald-900/20 border-emerald-500/30'
      }`}
    >
      <div className={`p-2.5 rounded-xl shrink-0 ${
        majorCount > 0
          ? 'bg-red-500/20 text-red-400'
          : minorCount > 0 || alertCount > 0
          ? 'bg-amber-500/20 text-amber-400'
          : 'bg-emerald-500/20 text-emerald-400'
      }`}>
        {hasAlerts ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Waves size={13} className={majorCount > 0 ? 'text-red-400' : minorCount > 0 ? 'text-amber-400' : 'text-emerald-400'} />
          <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Flood Status</span>
        </div>
        {hasAlerts ? (
          <p className="text-sm text-white/80 font-medium">
            {majorCount > 0 && <span className="text-red-400 font-bold">{majorCount} major</span>}
            {majorCount > 0 && (minorCount > 0 || alertCount > 0) && ', '}
            {minorCount > 0 && <span className="text-amber-400 font-bold">{minorCount} minor</span>}
            {minorCount > 0 && alertCount > 0 && ', '}
            {alertCount > 0 && <span className="text-yellow-300">{alertCount} alerts</span>}
            <span className="text-white/40 text-xs"> active</span>
          </p>
        ) : (
          <p className="text-sm text-emerald-400 font-medium">All rivers normal</p>
        )}
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs text-white/30">{totalStations} stations</p>
        <p className="text-[10px] text-white/20">View details →</p>
      </div>
    </Link>
  );
};
