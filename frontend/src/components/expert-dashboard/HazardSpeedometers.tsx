import React from 'react';

// Custom SVG half-doughnut gauge since we don't have a charting library for it
const Gauge = ({ value, label, color }: { value: number; label: string; color: string }) => {
    const radius = 40;
    const circumference = radius * Math.PI;
    // value is expected 0 to 100
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-12 overflow-hidden">
                <svg className="w-24 h-24 transform -rotate-180" viewBox="0 0 100 100">
                    {/* Background Arc */}
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="#334155"
                        strokeWidth="10"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset="0"
                    />
                    {/* Value Arc */}
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="10"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 text-center font-bold text-lg">
                    {value}%
                </div>
            </div>
            <div className="text-xs text-slate-400 font-semibold mt-1 text-center w-full truncate">
                {label}
            </div>
        </div>
    );
};

const HazardSpeedometers = ({ data, loading }: { data: any[], loading: boolean }) => {
    if (loading) return <div className="text-slate-400 text-sm p-4 animate-pulse">Calibrating instruments...</div>;

    // Let's pick 4 districts to show
    const displayDistricts = ['Colombo', 'Gampaha', 'Kalutara', 'Galle'];

    // Transform real data into percentages for the gauge
    const gauges = displayDistricts.map(dist => {
        const record = data.find(d => d.locationName === dist && d.hazardType === 'Water Level');
        if (!record) return { label: dist, val: 0, color: '#22c55e' };

        // Max water level roughly 5m.
        let percentage = Math.min(100, (record.measuredValue / 5.0) * 100);

        let color = '#22c55e'; // Green
        if (percentage > 80) color = '#ef4444'; // Red
        else if (percentage > 60) color = '#f97316'; // Orange
        else if (percentage > 40) color = '#eab308'; // Yellow

        return { label: dist, val: Math.round(percentage), color };
    });

    return (
        <div className="grid grid-cols-2 gap-y-6 gap-x-2">
            {gauges.map((g, i) => (
                <Gauge key={i} value={g.val} label={g.label} color={g.color} />
            ))}
        </div>
    );
};

export default HazardSpeedometers;
