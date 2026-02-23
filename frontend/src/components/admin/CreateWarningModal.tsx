import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertTriangle, MapPin, Clock, Info, Calendar } from 'lucide-react';
import { adminApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import Button from '../common/Button';
import Input from '../common/Input';
import { SpatialUnitSearch } from '../common/SpatialUnitSearch';
import { toast } from 'react-hot-toast';

interface CreateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

const CATEGORIES = ['FLOOD', 'LANDSLIDE', 'CYCLONE', 'FIRE', 'TSUNAMI', 'DROUGHT', 'STORM', 'LIGHTNING', 'HEAT_WAVE', 'COASTAL_EROSION', 'OTHER'];
const SEVERITIES = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EXTREME'];
const WARNING_STATUSES = ['ACTIVE', 'RESOLVED', 'REJECTED'];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const CreateWarningModal: React.FC<CreateWarningModalProps> = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [targetUnits, setTargetUnits] = useState<any[]>(initialData?.targetedUnits || []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      category: 'FLOOD',
      severity: 'MODERATE',
      headline: '',
      bulletinText: '',
      areaText: '',
      instructions: '',
      updateText: '',
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    }
  });

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      reset({
        category: initialData.category || 'FLOOD',
        severity: initialData.severity || 'MODERATE',
        headline: initialData.headline || '',
        bulletinText: initialData.bulletinText || '',
        areaText: initialData.areaText || '',
        instructions: initialData.instructions || '',
        updateText: '',
        status: initialData.status || 'ACTIVE',
        expiresAt: initialData.expiresAt ? new Date(initialData.expiresAt).toISOString().slice(0, 16) : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      });
      setTargetUnits(initialData.targetedUnits || []);
      return;
    }

    reset({
      category: 'FLOOD',
      severity: 'MODERATE',
      headline: '',
      bulletinText: '',
      areaText: '',
      instructions: '',
      updateText: '',
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    });
    setTargetUnits([]);
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const onAddUnit = (unit: any) => {
    if (!unit?.id || !UUID_RE.test(String(unit.id))) {
      toast.error('Invalid spatial unit selected');
      return;
    }
    if (targetUnits.find(u => u.id === unit.id)) {
      toast('Spatial unit already added');
      return;
    }
    setTargetUnits(prev => [...prev, unit]);
  };

  const onRemoveUnit = (id: string) => {
    setTargetUnits(prev => prev.filter(u => u.id !== id));
  };

  const onSubmit = async (data: any) => {
    const headline = String(data.headline || '').trim();
    const bulletinText = String(data.bulletinText || '').trim();
    const areaText = String(data.areaText || '').trim();
    const instructions = String(data.instructions || '').trim();
    const updateText = String(data.updateText || '').trim();

    if (!CATEGORIES.includes(String(data.category))) {
      toast.error('Invalid warning category');
      return;
    }
    if (!SEVERITIES.includes(String(data.severity))) {
      toast.error('Invalid warning severity');
      return;
    }
    if (headline.length < 8 || headline.length > 180) {
      toast.error('Headline must be 8-180 characters');
      return;
    }
    if (bulletinText.length < 15 || bulletinText.length > 2000) {
      toast.error('Bulletin must be 15-2000 characters');
      return;
    }
    if (areaText.length > 500) {
      toast.error('Affected area details must be at most 500 characters');
      return;
    }
    if (instructions.length > 2000) {
      toast.error('Instructions must be at most 2000 characters');
      return;
    }

    if (!initialData && targetUnits.length === 0) {
      toast.error('Please select at least one target spatial unit');
      return;
    }

    if (!initialData) {
      const expiresAtDate = new Date(data.expiresAt);
      if (Number.isNaN(expiresAtDate.getTime())) {
        toast.error('Please select a valid expiration date/time');
        return;
      }
      if (expiresAtDate.getTime() <= Date.now()) {
        toast.error('Expiration must be in the future');
        return;
      }
      const invalidTargetId = targetUnits.some((u) => !u?.id || !UUID_RE.test(String(u.id)));
      if (invalidTargetId) {
        toast.error('One or more selected target units are invalid');
        return;
      }
    }

    if (initialData && data.status === 'REJECTED' && updateText.length < 5) {
      toast.error('Please provide an update note when rejecting a warning');
      return;
    }
    if (initialData && updateText.length > 1000) {
      toast.error('Update note must be at most 1000 characters');
      return;
    }

    try {
      setLoading(true);
      if (initialData) {
        const updatePayload = {
          severity: data.severity,
          headline,
          bulletinText,
          updateText: updateText || null,
          status: data.status,
        };
        await adminApi.updateWarning(initialData.id, updatePayload);
        toast.success('Warning updated');
      } else {
        const createPayload = {
          category: data.category,
          severity: data.severity,
          headline,
          bulletinText,
          areaText: areaText || null,
          instructions: instructions || null,
          targetSpatialUnitIds: Array.from(new Set(targetUnits.map((u) => u.id))),
          expiresAt: new Date(data.expiresAt).toISOString(),
        };
        await adminApi.createWarning(createPayload);
        toast.success('Warning issued successfully');
      }
      
      onSuccess();
      onClose();
      reset();
      setTargetUnits([]);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, initialData ? 'Failed to update warning' : 'Failed to issue warning'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              {initialData ? 'Edit Disaster Warning' : 'Issue New Warning'}
            </h2>
            <p className="text-xs text-slate-500 leading-none mt-1">Target specific districts or divisions for localized alerts.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-300">Category</label>
              <select 
                {...register('category')}
                disabled={Boolean(initialData)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {initialData && <p className="text-xs text-slate-500">Category cannot be changed on update (backend restriction).</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-300">Severity</label>
              <select 
                {...register('severity')}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
              >
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <Input
            label="Headline"
            placeholder="e.g., Extreme Heat Warning for Southern Province"
            {...register('headline', { required: 'Headline is required', minLength: { value: 8, message: 'Min 8 characters' }, maxLength: { value: 180, message: 'Max 180 characters' } })}
            error={errors.headline?.message as string}
            className="bg-slate-900/50"
          />

          {!initialData && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-500" />
                Target Regions
              </label>
              <SpatialUnitSearch 
                onSelect={onAddUnit} 
                placeholder="Search and add districts, divisions..."
                className="bg-slate-900/50 border-slate-700"
              />
              {targetUnits.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-slate-900/30 rounded-2xl border border-slate-700/50">
                  {targetUnits.map(unit => (
                    <div key={unit.id} className="flex items-center gap-2 pl-3 pr-1 py-1 bg-slate-800 border border-slate-700 rounded-full group hover:border-emerald-500/30 transition-colors">
                      <span className="text-xs text-slate-300 font-medium">{unit.name}</span>
                      <button 
                        type="button"
                        onClick={() => onRemoveUnit(unit.id)}
                        className="p-1 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {targetUnits.length === 0 && (
                <p className="text-[11px] text-amber-500/70 italic flex items-center gap-1.5 px-1">
                  <Info size={12} /> At least one target region is required for the warning to be issued.
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-300">Bulletin Text</label>
              <textarea 
                {...register('bulletinText', { required: 'Required', minLength: { value: 15, message: 'Min 15 chars' }, maxLength: { value: 2000, message: 'Max 2000 chars' } })}
                placeholder="The detailed warning message..."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none h-24 resize-none transition-all"
              />
            </div>
            
            {!initialData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300">Affected Area Details</label>
                  <textarea 
                    {...register('areaText')}
                    placeholder="Specific roads, villages, or landmarks..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none h-24 resize-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300">Public Instructions</label>
                  <textarea 
                    {...register('instructions')}
                    placeholder="Safety steps to take..."
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none h-24 resize-none transition-all"
                  />
                </div>
              </div>
            )}

            {initialData && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300">Update Note</label>
                  <textarea 
                    {...register('updateText')}
                    placeholder="Optional update note for this warning"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-amber-500/50 outline-none h-24 resize-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300">Status</label>
                  <select 
                    {...register('status')}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                  >
                    {WARNING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          {!initialData && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Calendar size={16} className="text-rose-500" />
                Expiration Time
              </label>
              <input 
                type="datetime-local" 
                {...register('expiresAt', { required: 'Required' })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
              />
            </div>
          )}
        </form>

        <div className="p-8 border-t border-slate-700 bg-slate-800/80 flex gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            className="flex-1 border border-slate-700" 
            onClick={onClose}
          >
            Discard
          </Button>
          <Button 
            type="button"
            className="flex-1"
            color="amber"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            {initialData ? 'Update and Issue' : 'Issue Warning'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWarningModal;
