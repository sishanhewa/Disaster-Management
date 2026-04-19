import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon | React.ReactNode;
  trend?: string;
  /** Accent color for the icon container */
  color?: string;
  variant?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color = 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  variant,
  isLoading
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg hover:border-slate-600 transition group">
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl border transition-colors ${color}`}>
          {React.isValidElement(Icon) ? (
            Icon
          ) : typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null && !('props' in Icon)) ? (
            React.createElement(Icon as any, { size: 20 })
          ) : (
            Icon as React.ReactNode
          )}
        </div>
        {trend && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900/60 px-2 py-1 rounded-lg border border-slate-700">
            {trend}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-1 mt-1">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-700 animate-pulse rounded-md" />
          ) : (
            <>
              <h3 className="text-2xl font-black text-slate-100 leading-none tracking-tight">{value}</h3>
              {unit && <span className="text-xs text-slate-500 font-bold ml-1">{unit}</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
