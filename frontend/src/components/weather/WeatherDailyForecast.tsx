import React from 'react';
import { useForecast } from '../../hooks/useWeather';
import { getWeatherIcon } from './WeatherCard';
import { CalendarDays } from 'lucide-react';

interface Props {
  lat: number | null;
  lng: number | null;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeatherDailyForecast: React.FC<Props> = ({ lat, lng }) => {
  const { data, isLoading } = useForecast(lat, lng);

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-3 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 bg-slate-700 rounded" />
        ))}
      </div>
    );
  }

  if (!data?.daily?.time || !data?.daily?.temperature_2m_max) return null;

  const days: {
    label: string;
    min: number;
    max: number;
    code: number;
    precip?: number;
    uvMax?: number;
  }[] = [];

  const times = data.daily.time as string[];
  for (let i = 0; i < Math.min(7, times.length); i++) {
    const d = new Date(times[i]);
    days.push({
      label: i === 0 ? 'Today' : DAYS[d.getDay()],
      min: Math.round(data.daily.temperature_2m_min[i]),
      max: Math.round(data.daily.temperature_2m_max[i]),
      code: data.daily.weather_code?.[i] ?? 3,
      precip: data.daily.precipitation_sum?.[i],
      uvMax: data.daily.uv_index_max?.[i],
    });
  }

  // Range for the temp bar gradient width
  const globalMin = Math.min(...days.map(d => d.min));
  const globalMax = Math.max(...days.map(d => d.max));
  const spread = globalMax - globalMin || 1;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-lg">
      <h3 className="text-sm font-bold text-white/70 flex items-center gap-2 mb-4">
        <CalendarDays size={15} className="text-blue-400" />
        {days.length}-Day Forecast
      </h3>

      <div className="space-y-3">
        {days.map((day, i) => {
          const barLeft = ((day.min - globalMin) / spread) * 100;
          const barWidth = ((day.max - day.min) / spread) * 100;

          return (
            <div key={i} className="flex items-center gap-3 group">
              {/* Day name */}
              <span className={`text-sm font-semibold w-12 shrink-0 ${i === 0 ? 'text-white' : 'text-white/60'}`}>
                {day.label}
              </span>

              {/* Icon */}
              <span className="w-6 h-6 shrink-0 text-blue-300">
                {getWeatherIcon(day.code, 1, 'w-5 h-5')}
              </span>

              {/* Precip dot */}
              {day.precip != null && day.precip > 0.1 && (
                <span className="text-[10px] font-bold text-cyan-400 w-10 shrink-0 text-right">
                  {day.precip.toFixed(1)}mm
                </span>
              )}
              {(day.precip == null || day.precip <= 0.1) && <span className="w-10 shrink-0" />}

              {/* Temp bar */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-xs text-white/40 font-mono w-8 text-right shrink-0">{day.min}°</span>
                <div className="flex-1 relative h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-500 transition-all duration-500"
                    style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 4)}%` }}
                  />
                </div>
                <span className="text-xs text-white/80 font-bold font-mono w-8 shrink-0">{day.max}°</span>
              </div>

              {/* UV max badge */}
              {day.uvMax != null && day.uvMax > 5 && (
                <span className="text-[9px] font-bold shrink-0 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  UV {Math.round(day.uvMax)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
