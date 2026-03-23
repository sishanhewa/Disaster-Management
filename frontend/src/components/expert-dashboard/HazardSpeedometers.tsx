

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

    // Dynamically pick the top 4 stations with the highest current water level relative to their major flood levels
    // Since we don't have percentages natively, we'll calculate (current / major * 100)
    const sortedStations = [...data].sort((a, b) => {
        const aRatio = a.major_flood_level ? (a.current_level / a.major_flood_level) : 0;
        const bRatio = b.major_flood_level ? (b.current_level / b.major_flood_level) : 0;
        return bRatio - aRatio; // Descending
    }).slice(0, 4);

    // Transform real data into percentages for the gauge
    const gauges = sortedStations.map(record => {
        let percentage = 0;
        if (record.major_flood_level && record.major_flood_level > 0) {
            percentage = Math.min(100, (record.current_level / record.major_flood_level) * 100);
        }

        let color = '#22c55e'; // Green
        if (percentage > 80) color = '#ef4444'; // Red
        else if (percentage > 60) color = '#f97316'; // Orange
        else if (percentage > 40) color = '#eab308'; // Yellow

        return { label: record.station_name, val: Math.round(percentage), color };
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
