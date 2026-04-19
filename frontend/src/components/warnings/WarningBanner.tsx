import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';

interface SpatialUnitRef {
  id: string;
  name: string;
}

interface WarningResponse {
  id: string;
  category: string;
  severity: string;
  headline: string;
  bulletinText: string;
  targetedUnits: SpatialUnitRef[];
  expiresAt: string;
}

interface WarningBannerProps {
  warnings: WarningResponse[];
}

const severityBorders: Record<string, string> = {
  LOW: 'border-blue-500/50',
  MODERATE: 'border-yellow-500/50',
  HIGH: 'border-orange-500/50',
  CRITICAL: 'border-red-500/50',
  EXTREME: 'border-purple-500/50',
};

const severityGlows: Record<string, string> = {
  LOW: 'shadow-blue-500/5',
  MODERATE: 'shadow-yellow-500/5',
  HIGH: 'shadow-orange-500/5',
  CRITICAL: 'shadow-red-500/5',
  EXTREME: 'shadow-purple-500/5',
};

export const WarningBanner: React.FC<WarningBannerProps> = ({ warnings }) => {
  const [dismissed, setDismissed] = useState<string[]>([]);
  
  const activeWarnings = warnings.filter(w => !dismissed.includes(w.id));
  
  if (activeWarnings.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {activeWarnings.map((warning) => (
        <div 
          key={warning.id}
          className={`relative overflow-hidden bg-slate-900 border-l-4 rounded-r-xl shadow-lg transition-all duration-300 ${severityBorders[warning.severity.toUpperCase()] || 'border-slate-500'} ${severityGlows[warning.severity.toUpperCase()] || ''}`}
        >
          <div className="p-5 flex items-start gap-4">
            <div className={`mt-1 shrink-0 p-2 rounded-lg ${
              warning.severity === 'EXTREME' || warning.severity === 'CRITICAL' 
                ? 'bg-rose-500/20 text-rose-500' 
                : 'bg-amber-500/20 text-amber-500'
            }`}>
              <AlertTriangle size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <SeverityBadge severity={warning.severity} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-0.5 rounded">
                  {warning.category}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Expires: {new Date(warning.expiresAt).toLocaleString()}
                </span>
              </div>
              
              <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                {warning.headline}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                {warning.bulletinText}
              </p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {warning.targetedUnits.map(unit => (
                  <span key={unit.id} className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-medium text-slate-300">
                    {unit.name}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setDismissed([...dismissed, warning.id])}
              className="shrink-0 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="absolute right-0 bottom-0 p-2 transform translate-x-1 translate-y-1 opacity-5">
            <AlertTriangle size={80} />
          </div>
        </div>
      ))}
    </div>
  );
};
