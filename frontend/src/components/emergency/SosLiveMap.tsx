import React from 'react';
import { MapPin, Navigation, Radio, Battery, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface LocationUpdate {
  type: 'VICTIM_LOCATION' | 'RESPONDER_LOCATION';
  userId?: string;
  responderId?: string;
  responderName?: string;
  lat: number;
  lng: number;
  accuracy?: number;
  batteryLevel?: number;
  status?: string;
  timestamp: string;
}

interface SosLiveMapProps {
  incidentId: string;
  initialLat: number;
  initialLng: number;
  victimLocation: LocationUpdate | null;
  responderLocations: Map<string, LocationUpdate>;
  isConnected: boolean;
  onOpenExternalMap: () => void;
}

const SosLiveMap: React.FC<SosLiveMapProps> = ({
  incidentId,
  initialLat,
  initialLng,
  victimLocation,
  responderLocations,
  isConnected,
  onOpenExternalMap,
}) => {
  const { user } = useAuthStore();
  const victim = victimLocation || { lat: initialLat, lng: initialLng, batteryLevel: undefined };
  const responders = Array.from(responderLocations.values());

  // Simple relative positioning (in production, use actual map library like Leaflet)
  const getRelativePosition = (lat: number, lng: number) => {
    const baseLat = victim.lat;
    const baseLng = victim.lng;
    const latDiff = lat - baseLat;
    const lngDiff = lng - baseLng;
    // Scale for display (1 degree ≈ 111km, but for display purposes we scale)
    const scale = 1000;
    return {
      x: 50 + lngDiff * scale,
      y: 50 - latDiff * scale,
    };
  };

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      {/* Header */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {isConnected ? 'Live Tracking' : 'Connecting...'}
          </span>
        </div>
        <button
          onClick={onOpenExternalMap}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-all"
        >
          <Navigation size={12} />
          Open in Maps
        </button>
      </div>

      {/* Map Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, #475569 1px, transparent 1px),
              linear-gradient(to bottom, #475569 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Victim Marker (Center) */}
        <div className="relative">
          {/* Pulse Ring */}
          <div className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-rose-500/30 animate-pulse" />

          {/* Marker */}
          <div className="relative flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-rose-600 border-2 border-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div className="mt-1 px-2 py-0.5 bg-rose-600/90 rounded text-[10px] text-white font-bold whitespace-nowrap">
              Victim
            </div>
            {victim.batteryLevel !== undefined && (
              <div className="mt-0.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-800/90 rounded text-[9px] text-slate-300">
                <Battery size={8} />
                {Math.round(victim.batteryLevel)}%
              </div>
            )}
          </div>
        </div>

        {/* Responder Markers */}
        {responders.map((responder) => {
          const pos = getRelativePosition(responder.lat, responder.lng);
          return (
            <div
              key={responder.responderId || responder.userId}
              className="absolute transition-all duration-500 ease-out"
              style={{
                left: `${Math.max(10, Math.min(90, pos.x))}%`,
                top: `${Math.max(10, Math.min(90, pos.y))}%`,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-sky-600 border-2 border-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/30">
                  <Radio size={12} className="text-white" />
                </div>
                <div className="mt-1 px-2 py-0.5 bg-sky-600/90 rounded text-[10px] text-white font-bold whitespace-nowrap">
                  {responder.responderName || 'Responder'}
                </div>
                {responder.status && (
                  <div className="mt-0.5 px-1.5 py-0.5 bg-emerald-600/90 rounded text-[9px] text-white">
                    {responder.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Last Known Position
          </div>
          <div className="text-xs text-slate-300 font-mono">
            {victim.lat?.toFixed(6)}, {victim.lng?.toFixed(6)}
          </div>
        </div>

        {responders.length > 0 && (
          <div className="px-3 py-1.5 bg-slate-800/90 rounded-lg border border-slate-700">
            <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-bold">
              <Radio size={10} className="animate-pulse" />
              {responders.length} Responder{responders.length > 1 ? 's' : ''} Active
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Victim</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <div className="w-2 h-2 rounded-full bg-sky-500" />
          <span>Responder</span>
        </div>
      </div>
    </div>
  );
};

export default SosLiveMap;
