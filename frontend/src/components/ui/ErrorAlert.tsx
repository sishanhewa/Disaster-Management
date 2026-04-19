import { AlertTriangle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  variant?: 'critical' | 'warning' | 'info';
}

const variantMap = {
  critical: 'bg-red-900/40 border-red-500/50 text-red-400',
  warning:  'bg-amber-900/40 border-amber-500/50 text-amber-400',
  info:     'bg-blue-900/40 border-blue-500/50 text-blue-400',
};

export default function ErrorAlert({ message, onDismiss, variant = 'critical' }: ErrorAlertProps) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-md border ${variantMap[variant]}`}>
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="shrink-0 hover:opacity-70 transition">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
