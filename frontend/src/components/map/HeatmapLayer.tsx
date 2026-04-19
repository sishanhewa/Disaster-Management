import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

interface HeatmapLayerProps {
    points: { lat: number; lng: number; intensity: number }[];
    maxIntensity?: number;
    radius?: number;
    blur?: number;
}

export default function HeatmapLayer({
    points,
    maxIntensity = 40, 
    radius = 25,
    blur = 15
}: HeatmapLayerProps) {
    const map = useMap();
    const [layer, setLayer] = useState<any | null>(null);
    useEffect(() => {
        if (!map) return;
        const heatPoints = points.map(p => [p.lat, p.lng, p.intensity] as any);
        // @ts-ignore
        const heatLayer = L.heatLayer(heatPoints, {
            radius,
            blur,
            max: maxIntensity,
            maxZoom: 10,
            gradient: {
                0.4: 'blue',
                0.6: 'cyan',
                0.7: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            }
        });

        heatLayer.addTo(map);
        setLayer(heatLayer);

        return () => {
            if (layer && map.hasLayer(layer)) {
                map.removeLayer(layer);
            } else if (map && heatLayer && map.hasLayer(heatLayer)) {
                map.removeLayer(heatLayer);
            }
        };

    }, [map, points, radius, blur, maxIntensity]);

    return null;
}
