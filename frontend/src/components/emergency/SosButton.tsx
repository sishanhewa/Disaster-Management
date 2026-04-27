import React, { useState } from 'react';
import { ShieldAlert, X, Send, MapPin, Loader2, Phone, ClipboardList } from 'lucide-react';
import { emergencyApi } from '../../api/endpoints';
import { extractApiErrorMessage } from '../../api/error';
import { toast } from 'react-hot-toast';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';

const SosButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [medicalNotesError, setMedicalNotesError] = useState('');
  const [contactPhoneError, setContactPhoneError] = useState('');

  const validateForm = () => {
    let valid = true;
    const notes = medicalNotes.trim();
    const phone = contactPhone.trim();

    if (notes.length === 0) {
      setMedicalNotesError('Medical / situational notes are required.');
      valid = false;
    } else if (notes.length < 10) {
      setMedicalNotesError('Medical notes must be at least 10 characters.');
      valid = false;
    } else if (notes.length > 2000) {
      setMedicalNotesError('Medical notes cannot exceed 2000 characters.');
      valid = false;
    } else {
      setMedicalNotesError('');
    }

    if (phone.length > 0) {
      const phonePattern = /^[0-9+\-()\s]{7,20}$/;
      if (!phonePattern.test(phone)) {
        setContactPhoneError('Enter a valid phone number (7-20 digits/symbols).');
        valid = false;
      } else {
        setContactPhoneError('');
      }
    } else {
      setContactPhoneError('');
    }

    return valid;
  };
  
  const handleSos = async () => {
    if (!validateForm()) {
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser.');
      return;
    }

    try {
      setLoading(true);
      
      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        batteryLevel: null, // Web battery API not reliable, skip for now
        medicalNotes: medicalNotes.trim(),
        contactPhone: contactPhone.trim() || null
      };

      await emergencyApi.createSos(data);
      toast.success('SOS Signal Broadcasted! Responders are being notified.');
      setIsOpen(false);
      setMedicalNotes('');
      setContactPhone('');
      setMedicalNotesError('');
      setContactPhoneError('');
    } catch (error: any) {
      console.error('SOS Error:', error);
      const message =
        (error?.code === 'TIMEOUT' ? 'Could not get your location in time. Please try again.' : null) ||
        (error?.code === 1 ? 'Location permission denied. Please allow GPS access and try again.' : null) ||
        extractApiErrorMessage(error, 'Failed to send SOS. Please call emergency services directly.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-6 z-[999] w-16 h-16 rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/40 flex items-center justify-center hover:bg-red-500 hover:scale-110 active:scale-95 transition-all animate-bounce-subtle group"
        title="Emergency SOS"
      >
        <ShieldAlert size={32} />
        <span className="absolute -top-12 right-0 bg-red-600 text-[10px] font-black px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          SEND EMERGENCY SOS
        </span>
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-slate-900 border-red-500/30 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 animate-shimmer" />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <ShieldAlert className="text-red-500 animate-pulse" size={40} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">Emergency SOS</h3>
              <p className="text-slate-400 mt-2 text-sm font-medium">
                Your location will be shared with emergency responders. Keep this page open to allow live tracking.
              </p>
            </div>

            <div className="space-y-6">
              <Input
                label="Contact Phone (Optional)"
                placeholder="e.g. 077 123 4567"
                icon={<Phone size={16} />}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                error={contactPhoneError || undefined}
              />
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList size={14} /> Medical / Situational Notes
                </label>
                <textarea
                  className={`w-full bg-slate-950 border ${medicalNotesError ? 'border-red-500' : 'border-slate-800'} rounded-xl p-4 text-sm text-slate-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition min-h-[100px]`}
                  placeholder="Any medical conditions or current situation info..."
                  value={medicalNotes}
                  onChange={(e) => {
                    setMedicalNotes(e.target.value);
                    if (medicalNotesError) {
                      setMedicalNotesError('');
                    }
                  }}
                />
                {medicalNotesError && (
                  <p className="text-xs text-red-400 ml-1">{medicalNotesError}</p>
                )}
              </div>

              <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MapPin className="text-blue-400" size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Location Sharing</p>
                  <p className="text-xs text-slate-300 font-medium">Automatic GPS tracking is required.</p>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  fullWidth
                  size="lg"
                  color="danger"
                  className="h-14 text-base font-black tracking-widest"
                  icon={loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  onClick={handleSos}
                  disabled={loading}
                >
                  {loading ? 'BROADCASTING...' : 'BROADCAST SOS'}
                </Button>
                <p className="text-[10px] text-center text-slate-500 mt-4 uppercase font-black tracking-tighter">
                  Do not use for non-emergencies. Abusing this system is a crime.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default SosButton;
