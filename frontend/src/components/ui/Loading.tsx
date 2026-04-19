interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  /** Use 'skeleton' to render a pulse skeleton instead of a spinner */
  variant?: 'spinner' | 'skeleton';
  lines?: number;
}

export default function Loading({ size = 'md', text, variant = 'spinner', lines = 2 }: LoadingProps) {
  if (variant === 'skeleton') {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-slate-700 rounded ${i % 2 === 0 ? 'w-3/4' : 'w-1/2'}`}
          />
        ))}
      </div>
    );
  }

  const spinnerSize: Record<string, string> = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg
        className={`animate-spin ${spinnerSize[size]} text-blue-400`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {text && <p className="mt-3 text-sm text-slate-400">{text}</p>}
    </div>
  );
}
