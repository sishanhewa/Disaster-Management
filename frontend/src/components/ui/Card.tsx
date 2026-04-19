import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** 'default' = slate-800 card. 'alert' variants use transparency overlays. */
  variant?: 'default' | 'critical' | 'high' | 'moderate' | 'low' | 'normal' | 'extreme';
}

const variantMap: Record<string, string> = {
  default: 'bg-slate-800 border-slate-700',
  extreme:   'bg-purple-900/40 border-purple-500/50',
  critical:  'bg-red-900/40 border-red-500/50',
  high:      'bg-orange-900/40 border-orange-500/50',
  moderate:  'bg-amber-900/40 border-amber-500/50',
  low:       'bg-blue-900/40 border-blue-500/50',
  normal:    'bg-emerald-900/40 border-emerald-500/50',
};

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`rounded-xl p-5 border shadow-lg ${variantMap[variant]} ${className}`}>
      {children}
    </div>
  );
}
