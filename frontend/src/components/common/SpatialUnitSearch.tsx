import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, ChevronRight } from 'lucide-react';
import { useSearchLocations } from '../../hooks/useWeather';

interface SpatialUnitSearchProps {
  onSelect?: (unit: any) => void;
  placeholder?: string;
  className?: string;
}

export const SpatialUnitSearch: React.FC<SpatialUnitSearchProps> = ({ 
  onSelect, 
  placeholder = "Search for a location...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: results, isLoading } = useSearchLocations(query);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (unit: any) => {
    setQuery(unit.name);
    setIsOpen(false);
    if (onSelect) onSelect(unit);
  };

  return (
    <div className={`relative w-full max-w-md ${className}`} ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-sky-500 animate-spin" />
          ) : (
            <Search className={`h-5 w-5 transition-colors ${query ? 'text-sky-400' : 'text-slate-500 group-focus-within:text-sky-400'}`} />
          )}
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 border border-slate-700/50 rounded-xl leading-5 bg-[#0F172A] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 sm:text-sm transition-all duration-200"
          placeholder={placeholder}
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 mt-2 w-full bg-[#1E293B] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto py-2">
            {!results || results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-slate-400">{isLoading ? 'Searching...' : 'No locations found'}</p>
              </div>
            ) : (
              results.map((unit: any) => (
                <button
                  key={unit.id}
                  onClick={() => handleSelect(unit)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 text-slate-400 group-hover:text-sky-400 transition-colors">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{unit.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        {unit.parentName} <ChevronRight size={10} /> {unit.type}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-black text-slate-600 group-hover:text-sky-500 bg-slate-900/50 px-2 py-0.5 rounded transition-colors tracking-tighter">
                    {unit.pcode}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
