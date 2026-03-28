import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { 
  Waves, 
  Mountain, 
  Flame, 
  Wind, 
  CloudLightning, 
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Camera,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  LocateFixed,
  Target,
  Crosshair
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reportsApi, mediaApi, weatherApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import { SpatialUnitSearch } from '../../components/common/SpatialUnitSearch';

const CATEGORIES = [
  { id: 'FLOOD', icon: Waves, label: 'Flood', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'LANDSLIDE', icon: Mountain, label: 'Landslide', color: 'text-amber-600', bg: 'bg-amber-600/10' },
  { id: 'FIRE', icon: Flame, label: 'Fire', color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'CYCLONE', icon: Wind, label: 'Cyclone', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { id: 'STORM', icon: CloudLightning, label: 'Storm', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'OTHER', icon: MoreHorizontal, label: 'Other', color: 'text-slate-400', bg: 'bg-slate-400/10' },
];

const SEVERITY_LEVELS = [
  { value: 'LOW', label: 'Low', color: 'bg-blue-500' },
  { value: 'MODERATE', label: 'Moderate', color: 'bg-yellow-500' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-500' },
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-500' },
  { value: 'EXTREME', label: 'Extreme', color: 'bg-purple-600' },
];

const ALLOWED_CATEGORIES = new Set(CATEGORIES.map((c) => c.id));
const ALLOWED_SEVERITIES = new Set(SEVERITY_LEVELS.map((s) => s.value));
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


export default function NewReportPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    severityAssessment: 'MODERATE',
    lat: 7.8731,
    lng: 80.7718,
    exactMatchSpatialUnitId: null as string | null,
    targetSpatialUnitIds: [] as string[],
    photoUrls: [] as string[],
  });

  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedSpatialUnit, setSelectedSpatialUnit] = useState<any>(null);
  const [resolvingNearest, setResolvingNearest] = useState(false);
  const mapPosition = useMemo(() => [formData.lat, formData.lng] as [number, number], [formData.lat, formData.lng]);

  // Mutation for submission
  const mutation = useMutation({
    mutationFn: reportsApi.createReport,
    onSuccess: () => {
      toast.success('Report submitted. You can track it under My Reports while it is pending review.');
      navigate('/reports?tab=mine');
    },
    onError: (error: any) => {
      toast.error(extractApiErrorMessage(error, 'Failed to submit report'));
    },
  });

  const validateStep = (stepToValidate: number) => {
    if (stepToValidate === 1) {
      if (!ALLOWED_CATEGORIES.has(formData.category)) {
        toast.error('Please select a valid incident category');
        return false;
      }
      if (formData.category.length > 100) {
        toast.error('Category is too long (max 100 characters)');
        return false;
      }
      return true;
    }

    if (stepToValidate === 2) {
      if (!ALLOWED_SEVERITIES.has(formData.severityAssessment)) {
        toast.error('Please choose a valid severity level');
        return false;
      }
      if (formData.severityAssessment.length > 50) {
        toast.error('Severity is too long (max 50 characters)');
        return false;
      }
      if (!Number.isFinite(formData.lat) || !Number.isFinite(formData.lng) || formData.lat < -90 || formData.lat > 90 || formData.lng < -180 || formData.lng > 180) {
        toast.error('Please select a valid location on the map');
        return false;
      }
      if (!formData.exactMatchSpatialUnitId) {
        toast.error('Please select a location so we can resolve the exact spatial unit');
        return false;
      }
      if (!UUID_RE.test(formData.exactMatchSpatialUnitId)) {
        toast.error('Resolved spatial unit id is invalid');
        return false;
      }
      if ((formData.targetSpatialUnitIds || []).some((id) => !UUID_RE.test(id))) {
        toast.error('One or more target spatial unit ids are invalid');
        return false;
      }
      const description = formData.description.trim();
      if (description.length < 10) {
        toast.error('Description must be at least 10 characters');
        return false;
      }
      if (description.length > 4000) {
        toast.error('Description is too long (max 4000 characters)');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const applySpatialSelection = (unit: any, options?: { overwriteCoords?: boolean }) => {
    if (!unit?.id) return;

    const unitLat = unit?.lat ?? unit?.latitude;
    const unitLng = unit?.lng ?? unit?.longitude;

    setSelectedSpatialUnit(unit);
    setFormData((prev) => ({
      ...prev,
      exactMatchSpatialUnitId: unit.id,
      targetSpatialUnitIds: Array.from(new Set([...(prev.targetSpatialUnitIds || []), unit.id])),
      lat: options?.overwriteCoords && unitLat != null ? unitLat : prev.lat,
      lng: options?.overwriteCoords && unitLng != null ? unitLng : prev.lng,
    }));
  };

  const resolveNearestSpatialUnit = async (lat: number, lng: number) => {
    setResolvingNearest(true);
    try {
      const nearest = await weatherApi.getNearestWeather(lat, lng);
      if (nearest?.spatialUnitId) {
        applySpatialSelection(
          {
            id: nearest.spatialUnitId,
            name: nearest.spatialUnitName || 'Nearest Spatial Unit',
            type: nearest.spatialUnitType || 'GN_DIVISION',
            pcode: nearest.spatialUnitPcode || nearest.pcode || 'N/A',
            lat,
            lng,
          },
          { overwriteCoords: false }
        );
      }
    } catch {
      toast.error('Could not resolve nearest spatial unit from map click');
    } finally {
      setResolvingNearest(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (previews.length + files.length > 3) {
      toast.error('Maximum 3 photos allowed');
      return;
    }

    for (const file of files) {
      try {
        toast.loading('Uploading image...', { id: 'upload' });
        const { url } = await mediaApi.upload(file, 'reports');
        setPreviews(prev => [...prev, url]);
        setFormData(prev => ({ ...prev, photoUrls: [...prev.photoUrls, url] }));
        toast.success('Image uploaded', { id: 'upload' });
      } catch (error) {
        toast.error('Failed to upload image', { id: 'upload' });
      }
    }
  };

  const removePhoto = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, photoUrls: prev.photoUrls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = () => {
    if (!validateStep(1)) {
      setStep(1);
      return;
    }
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    if (formData.photoUrls.length > 3) {
      toast.error('Maximum 3 photos allowed');
      return;
    }
    if (formData.photoUrls.length < 1) {
      toast.error('At least one photo is required to submit a report');
      return;
    }

    mutation.mutate({
      ...formData,
      description: formData.description.trim(),
      targetSpatialUnitIds: formData.targetSpatialUnitIds.length > 0 ? formData.targetSpatialUnitIds : undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-6">Create New Incident Report</h1>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-sky-500 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                step >= i ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'
              } ${step === i ? 'ring-4 ring-sky-500/20' : ''}`}
            >
              {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <span>Category</span>
          <span className={step >= 2 ? 'text-sky-500' : ''}>Location & Details</span>
          <span className={step >= 3 ? 'text-sky-500' : ''}>Evidence</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">What happened?</h2>
              <p className="text-slate-400">Select the category that best describes the incident.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 group ${
                    formData.category === cat.id 
                      ? 'border-sky-500 bg-sky-500/5 ring-4 ring-sky-500/10' 
                      : 'border-slate-800 bg-slate-800/20 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-4 rounded-xl mb-4 transition-transform group-hover:scale-110 ${cat.bg}`}>
                    <cat.icon className={`w-8 h-8 ${cat.color}`} />
                  </div>
                  <span className="font-bold text-slate-200">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Where and How Bad?</h2>
              <p className="text-slate-400">Mark the location on the map and assess the severity.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Map Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  Select Location
                </label>
                <div className="h-[300px] rounded-2xl overflow-hidden border border-slate-700 relative group">
                  <MapContainer
                    center={mapPosition}
                    zoom={7}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <LocationMapController position={mapPosition} />
                    <LocationPicker 
                      onPick={(lat, lng) => {
                        setFormData((prev) => ({ ...prev, lat, lng }));
                        void resolveNearestSpatialUnit(lat, lng);
                      }} 
                      position={mapPosition}
                    />
                  </MapContainer>
                  <button 
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        setFormData((prev) => ({ ...prev, lat, lng }));
                        void resolveNearestSpatialUnit(lat, lng);
                      });
                    }}
                    className="absolute bottom-4 right-4 z-[1000] bg-sky-500 text-white p-3 rounded-full shadow-lg hover:bg-sky-600 transition-colors"
                  >
                    <LocateFixed className="w-5 h-5" />
                  </button>
                </div>
                <SpatialUnitSearch
                  onSelect={(unit) => applySpatialSelection(unit, { overwriteCoords: true })}
                  placeholder="Search location to set exact spatial unit"
                />
                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3 space-y-2">
                  <p className="text-[11px] text-slate-300 flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                    Coordinates: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
                  </p>
                  {resolvingNearest ? (
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Resolving nearest spatial unit...
                    </p>
                  ) : selectedSpatialUnit ? (
                    <p className="text-[11px] text-emerald-400 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" /> Exact match: {selectedSpatialUnit.name} ({selectedSpatialUnit.pcode || 'N/A'})
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No exact spatial unit selected yet.</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {formData.targetSpatialUnitIds.map((targetId) => (
                      <button
                        key={targetId}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            targetSpatialUnitIds: prev.targetSpatialUnitIds.filter((id) => id !== targetId),
                            exactMatchSpatialUnitId: prev.exactMatchSpatialUnitId === targetId ? null : prev.exactMatchSpatialUnitId,
                          }));
                        }}
                        className="px-2 py-1 rounded text-xs border border-slate-600 bg-slate-700 text-slate-200 hover:border-red-500/60 hover:text-red-300 transition"
                        title={targetId}
                      >
                        {targetId.slice(0, 8)}... x
                      </button>
                    ))}
                  </div>
                  {formData.targetSpatialUnitIds.length > 0 && (
                    <p className="text-[11px] text-slate-400">Targeted units are managed from your single location selection (search/map/geolocate).</p>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 italic">Use one search plus map interactions to capture location and targeting metadata.</p>
              </div>

              {/* Details */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-300 flex items-center justify-between">
                    <span>Severity Assessment</span>
                    <span className="text-sky-500 font-bold">{formData.severityAssessment}</span>
                  </label>
                  <div className="flex gap-2">
                    {SEVERITY_LEVELS.map(s => (
                      <button
                        key={s.value}
                        onClick={() => setFormData({ ...formData, severityAssessment: s.value })}
                        className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                          formData.severityAssessment === s.value ? `${s.color} ring-4 ring-white/10 scale-y-125` : 'bg-slate-800'
                        }`}
                        title={s.label}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span>Extreme</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-300">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a brief description of the situation..."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all h-32 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Final Review & Photos</h2>
              <p className="text-slate-400">Attached photos help verified responders act faster.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Photo Upload */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sky-500" />
                  Incident Photos (Required)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group">
                      <img src={url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {previews.length < 3 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-all text-slate-500 hover:text-sky-500">
                      <Camera className="w-6 h-6 mb-2" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Add Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                {previews.length === 0 && (
                  <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-4 flex gap-3 text-red-400">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs">At least one photo is required before submission.</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Report Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Category</span>
                    <span className="text-sm font-bold text-white">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Severity</span>
                    <span className={`text-sm font-bold ${
                      formData.severityAssessment === 'EXTREME' ? 'text-purple-500' :
                      formData.severityAssessment === 'CRITICAL' ? 'text-red-500' :
                      formData.severityAssessment === 'HIGH' ? 'text-orange-500' : 'text-blue-500'
                    }`}>{formData.severityAssessment}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-slate-400">Description</span>
                    <p className="text-sm text-slate-200 line-clamp-3 italic">"{formData.description || 'No description provided.'}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-800">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              step === 1 ? 'invisible' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !formData.category}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/20"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending || previews.length < 1}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report
                  <CheckCircle2 className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationPicker({ onPick, position }: { onPick: (lat: number, lng: number) => void, position: [number, number] }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
}

function LocationMapController({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, Math.max(map.getZoom(), 10), { animate: true, duration: 0.8 });
  }, [map, position]);

  return null;
}
