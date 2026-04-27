import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { weatherApi, disastersApi, floodApi, reportsApi } from '../api/endpoints';
import { SpatialUnitSearch } from '../components/common/SpatialUnitSearch';
import { SeverityBadge } from '../components/common/SeverityBadge';
import { Badge } from '../components/common/Badge';
import { Loader2, Info, CloudRain, AlertTriangle, ExternalLink, Navigation, Wind, Droplets, ThermometerSun } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import L from 'leaflet';
import { useLocationContextStore } from '../store/locationContextStore';

const CENTER_SL = [7.8731, 80.7718] as [number, number];
const DARK_MATTER_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

const SEVERITY_COLORS: Record<string, string> = {
  EXTREME: '#7C3AED',
  CRITICAL: '#DC2626',
  HIGH: '#EA580C',
  MODERATE: '#CA8A04',
  LOW: '#2563EB',
};

const DEFAULT_STYLE = {
  fillColor: '#1E293B',
  color: '#334155',
  weight: 1,
  fillOpacity: 0.4,
};

const reportPinIcon = L.divIcon({
  className: 'custom-map-pin custom-map-pin-report',
  html: '<div style="width:12px;height:12px;border-radius:9999px;background:#f97316;border:2px solid #fff;box-shadow:0 0 0 3px rgba(249,115,22,0.35);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const selectedUnitPinIcon = L.divIcon({
  className: 'custom-map-pin custom-map-pin-selected',
  html: '<div style="width:14px;height:14px;border-radius:9999px;background:#22d3ee;border:2px solid #fff;box-shadow:0 0 0 3px rgba(34,211,238,0.35);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const clickedWeatherPinIcon = L.divIcon({
  className: 'custom-map-pin custom-map-pin-click',
  html: '<div style="width:12px;height:12px;border-radius:9999px;background:#3b82f6;border:2px solid #fff;box-shadow:0 0 0 3px rgba(59,130,246,0.35);"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const normalizePcode = (value?: string) => (value || '').trim().toUpperCase();
const normalizeName = (value?: string) => (value || '').toLowerCase().trim();

function MapController({ flyTo }: { flyTo: { lat: number; lng: number; zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo([flyTo.lat, flyTo.lng], flyTo.zoom, { animate: true, duration: 2 });
    }
  }, [flyTo, map]);
  return null;
}

export default function MapPage() {
  const [zoom, setZoom] = useState(7);
  const [selectedUnit, setSelectedUnitState] = useState<any>(null);
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [selectedUnitPin, setSelectedUnitPin] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [searchParams] = useSearchParams();

  // Location context for cross-page state consistency
  const { selectedLocation, setSelectedLocation } = useLocationContextStore();

  // Sync with location context on mount (for deep-link navigation)
  useEffect(() => {
    if (selectedLocation && !selectedUnit) {
      const unit = {
        id: selectedLocation.id,
        name: selectedLocation.name,
        type: selectedLocation.type,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };
      setSelectedUnitState(unit);
      // Fly to location
      const zoomLevels: Record<string, number> = { COUNTRY: 7, PROVINCE: 9, DISTRICT: 11, DS_DIVISION: 13, GN_DIVISION: 15 };
      if (unit.lat != null && unit.lng != null) {
        setFlyTo({ lat: unit.lat, lng: unit.lng, zoom: zoomLevels[unit.type] || 11 });
        setSelectedUnitPin({ lat: unit.lat, lng: unit.lng });
      }
    }
  }, [selectedLocation]);

  const { data: activeWarnings } = useQuery<any[]>({
    queryKey: ['activeWarnings'],
    queryFn: () => disastersApi.getActiveWarnings(),
  });

  const [clickedLocation, setClickedLocation] = useState<{lat: number, lng: number} | null>(null);
  const [clickedWeather, setClickedWeather] = useState<any>(null);
  const [loadingClicked, setLoadingClicked] = useState(false);

  const setSelectedUnit = (unit: any) => {
    setSelectedUnitState(unit);
    // Sync to global location context for cross-page consistency
    if (unit) {
      setSelectedLocation({
        id: unit.id,
        name: unit.name,
        type: unit.type,
        lat: unit.lat ?? unit.latitude,
        lng: unit.lng ?? unit.longitude,
      });
    }
  };

  const onSelectUnit = (
    unit: any,
    options?: { shouldFly?: boolean; clearWeatherPopup?: boolean; fallbackLat?: number; fallbackLng?: number }
  ) => {
    const shouldFly = options?.shouldFly ?? true;
    if (options?.clearWeatherPopup) {
      setClickedLocation(null);
      setClickedWeather(null);
    }

    const lat = unit?.lat ?? unit?.latitude ?? options?.fallbackLat;
    const lng = unit?.lng ?? unit?.longitude ?? options?.fallbackLng;
    if (unit && lat != null && lng != null) {
      const zoomLevels: Record<string, number> = { COUNTRY: 7, PROVINCE: 9, DISTRICT: 11, DS_DIVISION: 13, GN_DIVISION: 15 };
      if (shouldFly) {
        setFlyTo({ lat, lng, zoom: zoomLevels[unit.type] || 11 });
      }
      setSelectedUnitPin({ lat, lng });
    }
    // Sync to global location context
    setSelectedUnit(unit);
  };

  const activateUnitFromWeather = useCallback(
    async (weather: any, clickLat: number, clickLng: number) => {
      const spatialUnitId = weather?.spatialUnitId;
      const spatialUnitName = weather?.spatialUnitName;
      const spatialUnitType = weather?.spatialUnitType;
      if (!spatialUnitId && !spatialUnitName) return;

      let unitMatch: any = null;
      if (spatialUnitName) {
        try {
          const results = await weatherApi.searchLocations(spatialUnitName);
          unitMatch =
            results.find((r: any) => String(r.id) === String(spatialUnitId)) ||
            results.find((r: any) => r.name === spatialUnitName) ||
            null;
        } catch {
          // Fallback below handles missing search results.
        }
      }

      if (!unitMatch) {
        unitMatch = {
          id: spatialUnitId,
          name: spatialUnitName || 'Nearest Spatial Unit',
          type: spatialUnitType || 'GN_DIVISION',
          pcode: 'N/A',
          lat: clickLat,
          lng: clickLng,
        };
      }

      onSelectUnit(unitMatch, { shouldFly: false, fallbackLat: clickLat, fallbackLng: clickLng });
    },
    []
  );

  const handleMapClick = async (lat: number, lng: number) => {
    setClickedLocation({lat, lng});
    setLoadingClicked(true);
    setClickedWeather(null);
    try {
      const data = await weatherApi.getNearestWeather(lat, lng);
      setClickedWeather(data);
      await activateUnitFromWeather(data, lat, lng);
    } catch (e) {
      toast.error('Failed to get weather for location');
    } finally {
      setLoadingClicked(false);
    }
  };

  // Prefetch data when layers enabled
  useQuery({
    queryKey: ['floodDashboard'],
    queryFn: floodApi.getFloodDashboard,
    enabled: false,
  });

  const { data: publicReports } = useQuery<any[]>({
    queryKey: ['publicReports'],
    queryFn: () => reportsApi.getPublicReports().then(res => Array.isArray(res) ? res : res.content || []),
    enabled: true,
  });

  const { data: unitWeather, isLoading: loadingWeather } = useQuery<any>({
    queryKey: ['unitWeather', selectedUnit?.id],
    queryFn: () => weatherApi.getSpatialUnitWeather(selectedUnit.id),
    enabled: !!selectedUnit?.id,
  });

  const { data: unitWarnings } = useQuery<any[]>({
    queryKey: ['unitWarnings', selectedUnit?.id],
    queryFn: () => weatherApi.getActiveWarningsForUnit(selectedUnit.id),
    enabled: !!selectedUnit?.id,
  });

  const warnedPCodes = useMemo(() => {
    const pcodeSet = new Map<string, string>();
    if (!activeWarnings) return pcodeSet;
    activeWarnings.forEach(warning => {
      const severity = (warning.severity || 'LOW').toUpperCase();
      const weights: Record<string, number> = { EXTREME: 5, CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };

      const explicitTargets = [
        ...(Array.isArray(warning.targetedUnits) ? warning.targetedUnits : []),
        ...(Array.isArray(warning.targeted_units) ? warning.targeted_units : []),
        ...(Array.isArray(warning.targetSpatialUnits) ? warning.targetSpatialUnits : []),
        ...(Array.isArray(warning.target_spatial_units) ? warning.target_spatial_units : []),
      ];

      explicitTargets.forEach((unit: any) => {
        const pcode = normalizePcode(unit?.pcode);
        if (!pcode) return;
        const currentSeverity = pcodeSet.get(pcode);
        if (!currentSeverity || weights[severity] > weights[currentSeverity]) {
          pcodeSet.set(pcode, severity);
        }
      });

      // Safety fallback for alternate payload shapes.
      const targetAreas = Array.isArray(warning.targetAreas) ? warning.targetAreas : [];
      targetAreas.forEach((area: any) => {
        const pcode = normalizePcode(area?.pcode || area?.spatialUnit?.pcode);
        if (!pcode) return;
        const currentSeverity = pcodeSet.get(pcode);
        if (!currentSeverity || weights[severity] > weights[currentSeverity]) {
          pcodeSet.set(pcode, severity);
        }
      });

      const rawPcodes = [
        warning?.pcode,
        warning?.districtPcode,
        warning?.spatialUnitPcode,
        ...(Array.isArray(warning?.targetPcodes) ? warning.targetPcodes : []),
      ];
      rawPcodes.forEach((raw: any) => {
        const pcode = normalizePcode(typeof raw === 'string' ? raw : undefined);
        if (!pcode) return;
        const currentSeverity = pcodeSet.get(pcode);
        if (!currentSeverity || weights[severity] > weights[currentSeverity]) {
          pcodeSet.set(pcode, severity);
        }
      });

      const areaTextMatches = String(warning?.areaText || '').toUpperCase().match(/LK\d{0,8}/g) || [];
      areaTextMatches.forEach((raw: string) => {
        const pcode = normalizePcode(raw);
        if (!pcode) return;
        const currentSeverity = pcodeSet.get(pcode);
        if (!currentSeverity || weights[severity] > weights[currentSeverity]) {
          pcodeSet.set(pcode, severity);
        }
      });
    });
    return pcodeSet;
  }, [activeWarnings]);

  const warnedAreaNames = useMemo(() => {
    const areaNames: Array<{ type: string; name: string; severity: string }> = [];
    if (!activeWarnings) return areaNames;

    activeWarnings.forEach((warning: any) => {
      const severity = (warning?.severity || 'LOW').toUpperCase();
      const units = [
        ...(Array.isArray(warning?.targetedUnits) ? warning.targetedUnits : []),
        ...(Array.isArray(warning?.targeted_units) ? warning.targeted_units : []),
      ];

      units.forEach((unit: any) => {
        const name = normalizeName(unit?.name);
        const type = String(unit?.type || '').toUpperCase();
        if (name && type) {
          areaNames.push({ type, name, severity });
        }
      });

      const district = normalizeName(warning?.district);
      if (district) {
        areaNames.push({ type: 'DISTRICT', name: district, severity });
      }
    });

    return areaNames;
  }, [activeWarnings]);

  const warningStyleToken = useMemo(() => {
    const pcodePart = Array.from(warnedPCodes.entries()).map(([p, s]) => `${p}:${s}`).sort().join('|');
    const namePart = warnedAreaNames.map((n) => `${n.type}:${n.name}:${n.severity}`).sort().join('|');
    return `${pcodePart}::${namePart}`;
  }, [warnedPCodes, warnedAreaNames]);

  const getFeatureStyle = (feature: any) => {
    const pcode = normalizePcode(
      feature.properties.pcode ||
      feature.properties.adm0_pcode ||
      feature.properties.adm1_pcode ||
      feature.properties.adm2_pcode ||
      feature.properties.adm3_pcode ||
      feature.properties.adm4_pcode
    );
    if (!pcode) return { ...DEFAULT_STYLE, fillColor: '#1E293B', color: '#334155' };

    let highestSeverity: string | null = null;
    const weights: Record<string, number> = { EXTREME: 5, CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };
    warnedPCodes.forEach((severity, warnedPcode) => {
      if (pcode.startsWith(warnedPcode) || warnedPcode === 'LK') {
        if (!highestSeverity || weights[severity] > weights[highestSeverity]) {
          highestSeverity = severity;
        }
      }
    });

    if (!highestSeverity) {
      const adm0Name = normalizeName(feature?.properties?.adm0_name);
      const adm1Name = normalizeName(feature?.properties?.adm1_name);
      const adm2Name = normalizeName(feature?.properties?.adm2_name);
      const adm3Name = normalizeName(feature?.properties?.adm3_name);
      const adm4Name = normalizeName(feature?.properties?.adm4_name);

      warnedAreaNames.forEach((target) => {
        const matches =
          (target.type === 'COUNTRY' && adm0Name === target.name) ||
          (target.type === 'PROVINCE' && adm1Name === target.name) ||
          (target.type === 'DISTRICT' && adm2Name === target.name) ||
          (target.type === 'DS_DIVISION' && adm3Name === target.name) ||
          (target.type === 'GN_DIVISION' && adm4Name === target.name);

        if (matches) {
          if (!highestSeverity || weights[target.severity] > weights[highestSeverity]) {
            highestSeverity = target.severity;
          }
        }
      });
    }

    if (highestSeverity) {
      return {
        ...DEFAULT_STYLE,
        fillColor: SEVERITY_COLORS[highestSeverity] || SEVERITY_COLORS.LOW,
        fillOpacity: 0.6,
        color: SEVERITY_COLORS[highestSeverity],
        weight: 1.5,
      };
    }
    return { ...DEFAULT_STYLE, fillColor: '#1E293B', color: '#334155'};
  };

  const handlePolygonClick = () => {
    // Keep map clicks focused on weather popup only.
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setFlyTo({ lat, lng, zoom: 13 });
        setSelectedUnitPin({ lat, lng });
        setSelectedUnit(null);
        void handleMapClick(lat, lng);
        setIsLocating(false);
      },
      () => {
        toast.error('Unable to retrieve your location.');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="relative h-[calc(100vh-64px)] w-[calc(100%+3rem)] -mx-6 -mt-6 -mb-6 overflow-hidden bg-slate-900 border-t border-slate-700">
      
      {/* Top Bar Controls */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-11/12 max-w-2xl flex flex-col gap-2 bg-slate-800/90 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-700 shadow-xl">
        <div className="flex gap-2">
            <div className="flex-1 w-full">
                <SpatialUnitSearch
                  onSelect={(unit) => onSelectUnit(unit, { shouldFly: true, clearWeatherPopup: true })}
                  className="bg-slate-900/50 border-slate-700"
                />
            </div>
            <button
                onClick={handleLocateMe}
                disabled={isLocating}
                title="Locate Me"
                className="flex shrink-0 items-center justify-center w-10 border rounded-xl disabled:opacity-50 transition-colors border-blue-800 text-blue-300 bg-blue-900/50 hover:bg-blue-800/60"
            >
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-pulse text-blue-400' : ''}`} />
            </button>
        </div>
        
        <div className="flex gap-2 text-xs">
          <div className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 border font-semibold rounded-xl border-amber-800 text-amber-300 bg-amber-900/60">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Warnings Layer Active</span>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 border font-semibold rounded-xl border-emerald-800 text-emerald-300 bg-emerald-900/60">
            <span className="hidden sm:inline">Verified Reports Pins Active</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={CENTER_SL}
        zoom={7}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapEventsHandler setZoom={setZoom} onClick={handleMapClick} />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={DARK_MATTER_URL}
        />

        <ZoomControl position="bottomleft" />
        <MapController flyTo={flyTo} />

        {zoom <= 5 && <AdminGeoLayer url="/geodata/sl_admin0.geojson" style={getFeatureStyle} onClick={handlePolygonClick} layerKey={`adm0-${warningStyleToken}`} />}
        {zoom >= 6 && zoom <= 8 && <AdminGeoLayer url="/geodata/sl_admin1.geojson" style={getFeatureStyle} onClick={handlePolygonClick} layerKey={`adm1-${warningStyleToken}`} />}
        {zoom >= 9 && zoom <= 11 && <AdminGeoLayer url="/geodata/sl_admin2.geojson" style={getFeatureStyle} onClick={handlePolygonClick} layerKey={`adm2-${warningStyleToken}`} />}
        {zoom >= 12 && zoom <= 14 && <AdminGeoLayer url="/geodata/sl_admin3.geojson" style={getFeatureStyle} onClick={handlePolygonClick} layerKey={`adm3-${warningStyleToken}`} />}
        {zoom >= 15 && <AdminGeoLayer url="/geodata/sl_admin4.geojson" style={getFeatureStyle} onClick={handlePolygonClick} layerKey={`adm4-${warningStyleToken}`} />}

        {selectedUnitPin && (
          <Marker position={[selectedUnitPin.lat, selectedUnitPin.lng]} icon={selectedUnitPinIcon}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[180px]">
                <p className="text-xs uppercase text-slate-500 tracking-wide">Selected Unit</p>
                <p className="font-bold text-slate-800 text-sm">{selectedUnit?.name || 'Location'}</p>
                <p className="text-[11px] text-slate-500">{selectedUnit?.pcode || ''}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Community Reports Layer */}
        {publicReports?.map((report: any) => (
          <Marker key={report.id} position={[report.lat, report.lng]} icon={reportPinIcon}>
            <Popup className="custom-popup">
              <div className="p-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="warning" className="text-[10px]">{report.category}</Badge>
                  <span className="text-[10px] text-slate-500 ml-auto">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="font-bold text-slate-800 text-sm mb-1 leading-tight">{report.description || 'No description'}</p>
                <div className="text-xs text-slate-500 mt-2">
                  Confirm: {report.confirmCount ?? 0} | Deny: {report.denyCount ?? 0}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Click AnyWhere Weather Popup */}
        {clickedLocation && (
          <Marker position={[clickedLocation.lat, clickedLocation.lng]} icon={clickedWeatherPinIcon}>
            <Popup className="custom-popup">
              <div className="p-2 min-w-[220px]">
                <h4 className="font-bold text-slate-800 text-sm border-b pb-2 mb-2 flex justify-between items-center">
                  Location Weather
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                    {clickedLocation.lat.toFixed(2)}, {clickedLocation.lng.toFixed(2)}
                  </span>
                </h4>
                {loadingClicked ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-blue-500 animate-spin" /></div>
                ) : clickedWeather ? (
                  <div className="grid grid-cols-2 gap-2 text-slate-700 text-xs">
                    <div className="col-span-2 bg-slate-100 p-1.5 rounded text-[11px] font-semibold">
                      {clickedWeather.spatialUnitName || 'Nearest Spatial Unit'}
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded">
                      <ThermometerSun size={14} className="text-amber-500" />
                      <span className="font-bold">{clickedWeather.tempC ?? '--'}°C</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded">
                      <Wind size={14} className="text-sky-500" />
                      <span className="font-bold">{clickedWeather.windSpeedKmh ?? '--'} km/h</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded col-span-2">
                      <Droplets size={14} className="text-blue-500" />
                      <span className="font-bold">Hum: {clickedWeather.humidityPct ?? '--'}%</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-rose-500 text-center italic py-2">Weather unavailable</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Details Panel */}
      {selectedUnit && (
        <div className="absolute right-4 top-4 bottom-4 w-80 z-[1000] border border-slate-700 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-100">
              <Info className="w-5 h-5 text-blue-400" />
              Unit Details
            </h2>
            <button 
              onClick={() => {
                setSelectedUnit(null);
                setSelectedUnitPin(null);
              }}
              className="text-slate-500 hover:text-red-400 transition-colors text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{selectedUnit.type}</p>
              <h3 className="text-xl font-bold leading-tight text-white">{selectedUnit.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{selectedUnit.pcode}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Active Warnings
              </h4>
              {unitWarnings && unitWarnings.length > 0 ? (
                unitWarnings.map((w: any) => (
                  <div key={w.id} className="border border-slate-700 bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <SeverityBadge severity={w.severity} />
                      <span className="text-[10px] text-slate-500">{new Date(w.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-200">{w.headline}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No active warnings.</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                <CloudRain className="w-4 h-4 text-blue-400" /> Current Weather
              </h4>
              {loadingWeather ? (
                <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>
              ) : unitWeather ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Temp</p>
                    <p className="text-lg font-black text-white">{unitWeather.tempC}°C</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Condition</p>
                    <p className="text-sm font-black truncate text-white" title={unitWeather.weatherCode}>{unitWeather.weatherCode}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Humidity</p>
                    <p className="text-lg font-black text-white">{unitWeather.humidityPct}%</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-700 bg-slate-800/50">
                    <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Wind</p>
                    <p className="text-lg font-black text-white">{unitWeather.windSpeedKmh} <span className="text-xs text-slate-500 font-medium">km/h</span></p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">Weather data unavailable.</p>
              )}
            </div>

            <div className="pt-4 space-y-2">
              <Link 
                to={`/analytics?unit=${selectedUnit.id}`}
                className="w-full flex items-center justify-between p-3 rounded-xl transition-colors border bg-slate-800 hover:bg-slate-700 border-slate-700 group"
              >
                <span className="text-sm font-medium text-slate-200">View Analytics</span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MapEventsHandler({ setZoom, onClick }: { setZoom: (z: number) => void, onClick?: (lat: number, lng: number) => void }) {
  const map = useMapEvents({ 
    zoomend: () => setZoom(map.getZoom()),
    click: (e) => onClick?.(e.latlng.lat, e.latlng.lng)
  });
  return null;
}

function AdminGeoLayer({ url, style, onClick, layerKey }: { url: string; style: any; onClick: any; layerKey: string }) {
  const [geoData, setGeoData] = useState<any>(null);
  useEffect(() => { fetch(url).then(res => res.json()).then(setGeoData).catch(() => {}); }, [url]);
  if (!geoData) return null;
  const onEachFeature = (feature: any, layer: any) => {
    layer.on('click', (e: any) => onClick(e, feature.properties));
  };
  return <GeoJSON key={layerKey} data={geoData} style={style} onEachFeature={onEachFeature} />;
}
