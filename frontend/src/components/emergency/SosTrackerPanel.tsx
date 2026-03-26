import React from 'react';
import { X, Radio } from 'lucide-react';
import { useSosWebSocket } from '../../hooks/useSosWebSocket';
import { useAuthStore } from '../../store/authStore';
import SosLiveMap from './SosLiveMap';

interface SosTrackerPanelProps {
  incidentId: string;
  initialLat: number;
  initialLng: number;
  onClose: () => void;
}

const SosTrackerPanel: React.FC<SosTrackerPanelProps> = ({
  incidentId,
  initialLat,
  initialLng,
  onClose,
}) => {
  const { accessToken } = useAuthStore();
  const {
    victimLocation,
    responderLocations,
    statusUpdates,
    isConnected,
    error,
  } = useSosWebSocket(incidentId, accessToken);

  // Get latest status
  const latestStatus = statusUpdates[statusUpdates.length - 1];

  return (
    <div className="relative bg-slate-900/80 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Radio
            size={16}
            className={`${isConnected ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`}
          />
          <span className="text-sm font-bold text-white">
            Live Tracking
          </span>
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20">
          <p className="text-xs text-rose-400">{error}</p>
        </div>
      )}

      {/* Live Map */}
      <div className="p-4">
        <SosLiveMap
          incidentId={incidentId}
          initialLat={initialLat}
          initialLng={initialLng}
          victimLocation={victimLocation}
          responderLocations={responderLocations}
          isConnected={isConnected}
          onOpenExternalMap={() =>
            window.open(
              `https://maps.google.com/?q=${
                victimLocation?.lat || initialLat
              },${victimLocation?.lng || initialLng}`
            )
          }
        />
      </div>

      {/* Status Updates */}
      {statusUpdates.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Recent Updates
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {statusUpdates.slice(-5).map((update, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-300"
                >
                  <span className="text-slate-500">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="font-medium">{update.status}</span>
                  {update.message && (
                    <span className="text-slate-400">- {update.message}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Stats */}
      <div className="px-4 pb-4 flex gap-3">
        <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700 p-2 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Victim Updates</div>
          <div className="text-sm font-bold text-rose-400">
            {victimLocation ? 'Live' : 'No data'}
          </div>
        </div>
        <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700 p-2 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Active Responders</div>
          <div className="text-sm font-bold text-sky-400">{responderLocations.size}</div>
        </div>
      </div>
    </div>
  );
};

export default SosTrackerPanel;
