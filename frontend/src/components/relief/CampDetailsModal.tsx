import React from 'react';
import { X, MapPin, Tent, Users, Phone, Mail, Navigation2 } from 'lucide-react';
import type { Camp } from '../../types/relief';
import LiveMiniMap from '../map/LiveMiniMap';

interface CampDetailsModalProps {
  camp: Camp;
  onClose: () => void;
}

const CampDetailsModal: React.FC<CampDetailsModalProps> = ({ camp, onClose }) => {
  if (!camp) return null;

  const googleMapsUrl = camp.latitude && camp.longitude 
    ? `https://www.google.com/maps/search/?api=1&query=${camp.latitude},${camp.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((camp.address || '') + ', ' + (camp.district || ''))}`;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div 
        className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-700 flex flex-col md:flex-row h-[90vh] md:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Side: Map Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-800">
          <LiveMiniMap 
            lat={camp.latitude} 
            lng={camp.longitude} 
            zoom={14} 
            locationName={camp.campName} 
          />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all w-full backdrop-blur-sm border border-blue-400/30"
            >
              <Navigation2 size={18} />
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* Right Side: Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Tent size={28} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <h2 className="text-3xl font-black text-white mb-2 leading-tight">
            {camp.campName}
          </h2>
          
          <div className="flex items-start gap-2 text-slate-400 mb-8">
            <MapPin size={18} className="shrink-0 mt-1 text-blue-400" />
            <p className="text-sm font-medium">{camp.address}, {camp.district}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Capacity</p>
                <p className="text-sm font-bold text-slate-200">{camp.capacity || 'N/A'} People</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Camp Manager</p>
                <p className="text-sm font-bold text-slate-200">{camp.manager?.displayName || 'Unassigned'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Contact Email</p>
                <p className="text-sm font-bold text-slate-200 truncate">{camp.manager?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active Relief Center</span>
            </div>
            <button 
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-2xl transition-all border border-slate-700"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CampDetailsModal;
