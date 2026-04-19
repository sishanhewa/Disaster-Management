import { useEffect, useRef } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import PopupTemplate from '@arcgis/core/PopupTemplate';

interface IncidentMapProps {
    incidents: any[];
    isReportingMode: boolean;
    onLocationSelect?: (lat: number, lon: number) => void;
    selectedLat?: number | null;
    selectedLon?: number | null;
}

const IncidentMap = ({ incidents, isReportingMode, onLocationSelect, selectedLat, selectedLon }: IncidentMapProps) => {
    const mapDiv = useRef<HTMLDivElement>(null);
    const viewRef = useRef<MapView | null>(null);
    const incidentsLayerRef = useRef<GraphicsLayer | null>(null);
    const selectionLayerRef = useRef<GraphicsLayer | null>(null);

    // Refs to bypass stale React closures in the Esri event listener
    const isReportingRef = useRef(isReportingMode);
    const onLocationSelectRef = useRef(onLocationSelect);

    useEffect(() => {
        isReportingRef.current = isReportingMode;
        onLocationSelectRef.current = onLocationSelect;
    }, [isReportingMode, onLocationSelect]);

    useEffect(() => {
        if (!mapDiv.current) return;

        const incidentsLayer = new GraphicsLayer();
        const selectionLayer = new GraphicsLayer();
        incidentsLayerRef.current = incidentsLayer;
        selectionLayerRef.current = selectionLayer;

        const map = new Map({
            basemap: 'hybrid', // Base terrain + labels, no external models
            layers: [incidentsLayer, selectionLayer]
        });

        const view = new MapView({
            container: mapDiv.current,
            map: map,
            center: [80.7718, 7.8731], // Center of Sri Lanka
            zoom: 7,
            ui: { components: ['zoom', 'compass'] }
        });
        
        viewRef.current = view;

        view.on('click', (event) => {
            if (isReportingRef.current && onLocationSelectRef.current && event.mapPoint?.latitude != null && event.mapPoint?.longitude != null) {
                event.stopPropagation(); // Prevents default map un-focusing or popup
                onLocationSelectRef.current(event.mapPoint.latitude, event.mapPoint.longitude);
            }
        });

        return () => {
            if (view) {
                view.destroy();
                viewRef.current = null;
            }
        };
    }, []);

    // Effect for updating incident pins
    useEffect(() => {
        if (!incidentsLayerRef.current) return;
        incidentsLayerRef.current.removeAll();

        const graphics = incidents.filter(i => i.latitude && i.longitude).map(inc => {
            const point = new Point({
                longitude: inc.longitude,
                latitude: inc.latitude
            });

            // Color code based on severity
            let color = [239, 68, 68]; // Red default
            if (inc.severity === 'low') color = [16, 185, 129]; // Emerald (green)
            if (inc.severity === 'moderate') color = [234, 179, 8]; // Yellow 
            if (inc.severity === 'high') color = [249, 115, 22]; // Orange

            const markerSymbol = new SimpleMarkerSymbol({
                color: color,
                outline: {
                    color: [255, 255, 255],
                    width: 1
                },
                size: 10
            });

            const template = new PopupTemplate({
                title: `{title}`,
                content: `
                    <div style="font-family: sans-serif;">
                        <b>Hazard:</b> {hazardType}<br>
                        <b>Severity:</b> {severity}<br>
                        <b>Status:</b> {responseStatus}<br>
                        <b>Date:</b> {incidentDate}<br><br>
                        <p style="font-size: 12px; color: #555;">{description}</p>
                    </div>
                `
            });

            return new Graphic({
                geometry: point,
                symbol: markerSymbol,
                attributes: inc,
                popupTemplate: template
            });
        });

        incidentsLayerRef.current.addMany(graphics);
    }, [incidents]);

    // Effect for drawing the "Reporting Mode" selection pin
    useEffect(() => {
        if (!selectionLayerRef.current) return;
        selectionLayerRef.current.removeAll();

        if (isReportingMode && selectedLat && selectedLon) {
            const point = new Point({
                longitude: selectedLon,
                latitude: selectedLat
            });

            const markerSymbol = new SimpleMarkerSymbol({
                color: [59, 130, 246], // Blue pin for selection
                outline: {
                    color: [255, 255, 255],
                    width: 2
                },
                size: 14
            });

            const graphic = new Graphic({
                geometry: point,
                symbol: markerSymbol
            });

            selectionLayerRef.current.add(graphic);
        }
    }, [isReportingMode, selectedLat, selectedLon]);

    return (
        <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-700 shadow-xl relative z-0">
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
                {isReportingMode && (
                    <div className="bg-blue-600/90 text-white px-3 py-1.5 rounded-lg shadow font-semibold text-xs animate-bounce pointer-events-auto">
                        📍 Reporting Mode: Click map to pin location!
                    </div>
                )}
            </div>
            <div className="w-full h-full" ref={mapDiv}></div>
        </div>
    );
};

export default IncidentMap;
