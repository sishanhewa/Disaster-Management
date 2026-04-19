import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantMap: Record<string, string> = {
  primary:   'bg-blue-600 hover:bg-blue-500 text-white font-bold',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold',
  danger:    'bg-red-600 hover:bg-red-500 text-white font-bold',
  ghost:     'hover:bg-slate-800 text-slate-300 hover:text-slate-100 font-semibold',
  outline:   'border border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300 transition-colors',
};

const sizeMap: Record<string, string> = {
  xs: 'px-2 py-1 text-[10px] gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${fullWidth ? 'w-full' : ''} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
