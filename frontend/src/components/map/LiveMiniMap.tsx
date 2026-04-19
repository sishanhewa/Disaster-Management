import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

interface Props {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
  locationName?: string;
}

// Determine zoom level from spatial unit type
export function zoomFromType(type?: string): number {
  switch (type) {
    case 'GN_DIVISION': return 14;
    case 'DS_DIVISION': return 12;
    case 'DISTRICT': return 10;
    case 'PROVINCE': return 8;
    default: return 11;
  }
}

// Inner component that flies to new position when lat/lng changes
function MapFlyTo({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  const prevCoords = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (
      prevCoords.current?.lat !== lat ||
      prevCoords.current?.lng !== lng
    ) {
      map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
      prevCoords.current = { lat, lng };
    }
  }, [lat, lng, zoom, map]);

  return null;
}

// Pulsing SVG marker for the selected location
const pulseIcon = new L.DivIcon({
  className: '',
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.35);animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></div>
    <div style="position:absolute;inset:3px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 0 10px rgba(59,130,246,0.8);"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Default Sri Lanka marker (plain)
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [20, 33],
  iconAnchor: [10, 33],
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [33, 33],
});

const SL_CENTER: [number, number] = [7.8731, 80.7718];
const SL_ZOOM = 6;

export default function LiveMiniMap({ lat, lng, zoom, locationName }: Props) {
  const hasTarget = lat != null && lng != null;
  const center: [number, number] = hasTarget ? [lat, lng] : SL_CENTER;
  const initZoom = hasTarget ? (zoom ?? 11) : SL_ZOOM;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative z-0 bg-slate-900 border border-slate-800">
      {/* Inject animation CSS for pulse */}
      <style>{`@keyframes ping{75%,100%{transform:scale(2);opacity:0}}`}</style>

      <MapContainer
        center={center}
        zoom={initZoom}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
        key={hasTarget ? `${lat}-${lng}` : 'default'}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {hasTarget && (
          <>
            <MapFlyTo lat={lat} lng={lng} zoom={initZoom} />
            <Marker position={[lat, lng]} icon={pulseIcon}>
              <Popup className="font-sans text-sm">{locationName ?? 'Selected Location'}</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
