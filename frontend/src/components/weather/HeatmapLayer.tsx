import React, { useState } from 'react';

interface HeatmapLayerProps {
  initialOpacity?: number;
  initialActive?: boolean;
}

export const HeatmapLayer: React.FC<HeatmapLayerProps> = ({
  initialOpacity = 70,
  initialActive = true,
}) => {
  const [active, setActive] = useState(initialActive);
  const [opacity, setOpacity] = useState(initialOpacity);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl text-slate-200 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${active ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-slate-100">Live Heatmap</h4>
            <p className="text-xs text-slate-400">Temperature & Humidity IDW</p>
          </div>
        </div>
        <button
          onClick={() => setActive(!active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${active ? 'bg-orange-500' : 'bg-slate-600'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className={`transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Opacity</span>
          <span>{opacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        
        <div className="mt-5 h-1.5 w-full rounded-full bg-gradient-to-r from-blue-500 via-green-400 to-red-500" />
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
          <span>Cold</span>
          <span>Moderate</span>
          <span>Hot</span>
        </div>
      </div>
    </div>
  );
};
