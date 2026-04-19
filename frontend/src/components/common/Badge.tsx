import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'critical' | 'warning' | 'info' | 'neutral' | 'extreme' | 'high' | 'moderate' | 'low' | 'normal' | 'outline' | 'dot' | 'success' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'sm dot';
  color?: string;
  className?: string;
}

const variantMap: Record<string, string> = {
  active:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  normal:   'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  extreme:  'bg-purple-500/20 text-purple-400 border-purple-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  warning:  'bg-amber-500/20 text-amber-400 border-amber-500/30',
  low:      'bg-blue-500/20 text-blue-400 border-blue-500/30',
  info:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  neutral:  'bg-slate-500/20 text-slate-400 border-slate-500/30',
  outline:  'bg-transparent text-slate-400 border-slate-700',
  success:  'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  error:    'bg-red-500/20 text-red-400 border-red-500/30',
};

const sizeMap: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-[9px]',
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
  'sm dot': 'px-2 py-0.5 text-[10px] flex items-center gap-1 before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  color,
  className = '',
}) => {
  return (
    <span className={`inline-flex items-center font-semibold rounded border uppercase tracking-wide ${variantMap[variant]} ${sizeMap[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
