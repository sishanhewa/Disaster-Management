import React from 'react';

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

const severityConfig: Record<string, { bg: string; text: string }> = {
  LOW: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  MODERATE: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  HIGH: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  CRITICAL: { bg: 'bg-red-500/10', text: 'text-red-400' },
  EXTREME: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  const config = severityConfig[severity.toUpperCase()] || { bg: 'bg-slate-500/10', text: 'text-slate-400' };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-current transition-colors ${config.bg} ${config.text} ${className}`}>
      {severity}
    </span>
  );
};
