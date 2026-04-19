interface BadgeProps {
  children: React.ReactNode;
  variant?: 'active' | 'critical' | 'warning' | 'info' | 'neutral' | 'extreme' | 'high' | 'moderate' | 'low' | 'normal';
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
};

export default function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${variantMap[variant]} ${className}`}>
      {children}
    </span>
  );
}
