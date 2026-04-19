import React from 'react';
import { useForecast } from '../../hooks/useWeather';
import { getWeatherIcon } from './WeatherCard';

interface Props {
  lat: number | null;
  lng: number | null;
  currentTempC?: number | null;
}

export const WeatherHourlyStrip: React.FC<Props> = ({ lat, lng, currentTempC = null }) => {
  const { data, isLoading } = useForecast(lat, lng);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="min-w-[64px] h-24 bg-slate-700/50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data?.hourly?.time || !data?.hourly?.temperature_2m) {
    const currentTemp = currentTempC ?? data?.current?.temperature_2m;
    if (currentTemp == null) return null;

    const currentCode = data?.current?.weather_code ?? 3;
    return (
      <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar snap-x">
        <div className="min-w-[62px] flex flex-col items-center gap-2 py-3 px-2 rounded-2xl snap-center transition-all cursor-default select-none bg-blue-500/20 border border-blue-500/30 shadow-[0_0_16px_rgba(59,130,246,0.2)]">
          <span className="text-[11px] font-bold tracking-wide text-blue-300">Now</span>
          <span className="text-blue-200">
            {getWeatherIcon(currentCode, 1, 'w-5 h-5')}
          </span>
          <span className="text-base font-bold text-white">{Math.round(currentTemp)}°</span>
        </div>
      </div>
    );
  }

  const now = new Date();
  const currentHour = new Date(now);
  currentHour.setMinutes(0, 0, 0);

  const hourlyTimes = data.hourly.time as string[];

  // Anchor to the current hour slot so the next tile is the immediate next hour.
  let startIdx = hourlyTimes.findIndex(
    (t: string) => new Date(t).getTime() === currentHour.getTime()
  );

  if (startIdx === -1) {
    // Fallback: use the latest slot not later than now.
    for (let i = hourlyTimes.length - 1; i >= 0; i--) {
      if (new Date(hourlyTimes[i]).getTime() <= now.getTime()) {
        startIdx = i;
        break;
      }
    }
  }

  if (startIdx === -1) startIdx = 0;

  const hours: { label: string; temp: number; code: number; idx: number }[] = [];
  for (let i = 0; i < 24; i++) {
    const idx = startIdx + i;
    if (idx >= hourlyTimes.length) break;
    const t = new Date(hourlyTimes[idx]);
    hours.push({
      label: i === 0 ? 'Now' : `${String(t.getHours()).padStart(2, '0')}:00`,
      temp: Math.round(data.hourly.temperature_2m[idx]),
      code: data.hourly.weather_code?.[idx] ?? 3,
      idx,
    });
  }

  if (hours.length === 0) return null;

  if (currentTempC != null) {
    hours[0].temp = Math.round(currentTempC);
  }

  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar snap-x">
      {hours.map((h, i) => (
        <div
          key={i}
          className={`min-w-[62px] flex flex-col items-center gap-2 py-3 px-2 rounded-2xl snap-center transition-all cursor-default select-none ${
            i === 0
              ? 'bg-blue-500/20 border border-blue-500/30 shadow-[0_0_16px_rgba(59,130,246,0.2)]'
              : 'bg-white/5 border border-white/5 hover:bg-white/10'
          }`}
        >
          <span className={`text-[11px] font-bold tracking-wide ${i === 0 ? 'text-blue-300' : 'text-white/50'}`}>
            {h.label}
          </span>
          <span className={i === 0 ? 'text-blue-200' : 'text-slate-400'}>
            {getWeatherIcon(h.code, 1, 'w-5 h-5')}
          </span>
          <span className={`text-base font-bold ${i === 0 ? 'text-white' : 'text-white/80'}`}>
            {h.temp}°
          </span>
        </div>
      ))}
    </div>
  );
};
