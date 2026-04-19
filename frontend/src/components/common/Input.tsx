import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((
  { label, error, icon, className = '', ...props },
  ref
) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-sm font-bold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors">
            {typeof icon === 'function'
              ? React.createElement(icon as any, { size: 16 })
              : icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full border ${error ? 'border-red-500' : 'border-slate-600'} bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none transition ${icon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 ml-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
