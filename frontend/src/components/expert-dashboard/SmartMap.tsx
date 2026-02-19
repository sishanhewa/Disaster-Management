import { useEffect, useRef } from 'react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import '@arcgis/core/assets/esri/themes/dark/main.css';

interface SmartMapProps {
    onFeatureSelected: (attributes: Record<string, any> | null, layerTitle: string) => void;
}

// Mock red-alert zone polygons for demonstration
const ALERT_ZONES = [
    {
        name: 'Colombo District',
        severity: 'RED ALERT',
        hazard: 'Flash Flood Risk',
        water_level: 4.2,
        rainfall_24h: 185,
        population_at_risk: 42000,
        advisory: 'Immediate evacuation recommended for low-lying areas',
        rings: [
            [79.75, 6.80], [79.95, 6.80], [80.00, 6.90], [79.98, 7.00],
            [79.90, 7.05], [79.78, 7.00], [79.72, 6.92], [79.75, 6.80]
        ]
    },
    {
        name: 'Ratnapura District',
        severity: 'RED ALERT',
        hazard: 'Landslide + Flood',
        water_level: 4.8,
        rainfall_24h: 220,
        population_at_risk: 18500,
        advisory: 'Landslide warnings active — avoid hill slopes',
        rings: [
            [80.30, 6.55], [80.55, 6.55], [80.60, 6.70], [80.55, 6.80],
            [80.40, 6.85], [80.28, 6.75], [80.25, 6.65], [80.30, 6.55]
        ]
    },
    {
        name: 'Matara Coast',
        severity: 'AMBER ALERT',
        hazard: 'Storm Surge',
        water_level: 3.1,
        rainfall_24h: 95,
        population_at_risk: 8200,
        advisory: 'Coastal areas on watch — monitor tidal conditions',
        rings: [
            [80.45, 5.90], [80.65, 5.88], [80.70, 5.98], [80.60, 6.05],
            [80.48, 6.02], [80.42, 5.95], [80.45, 5.90]
        ]
    }
];

const SmartMap = ({ onFeatureSelected }: SmartMapProps) => {
    const mapDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let view: MapView;

        if (mapDiv.current) {
            const webMap = new WebMap({
                portalItem: {
                    id: '35745e77307c45959f095f632d0328d5'
                }
            });

            view = new MapView({
                container: mapDiv.current,
                map: webMap,
                center: [80.7718, 7.8731],
                zoom: 7,
                popup: { autoCloseEnabled: false }
            });

            // --- Add Red Alert Zone Overlays ---
            const alertLayer = new GraphicsLayer({ title: 'Alert Zones' });

            ALERT_ZONES.forEach((zone) => {
                const isRed = zone.severity === 'RED ALERT';

                const polygon = new Polygon({
                    rings: [zone.rings.map(([lng, lat]) => [lng, lat])],
                    spatialReference: { wkid: 4326 }
                });

                const symbol = new SimpleFillSymbol({
                    color: isRed ? [239, 68, 68, 0.35] : [245, 158, 11, 0.30], // red or amber
                    outline: new SimpleLineSymbol({
                        color: isRed ? [239, 68, 68, 0.9] : [245, 158, 11, 0.9],
                        width: 2,
                        style: 'dash'
                    })
                });

                const graphic = new Graphic({
                    geometry: polygon,
                    symbol: symbol,
                    attributes: {
                        Zone: zone.name,
                        Severity: zone.severity,
                        Hazard: zone.hazard,
                        'Water Level (m)': zone.water_level,
                        'Rainfall 24h (mm)': zone.rainfall_24h,
                        'Population at Risk': zone.population_at_risk,
                        Advisory: zone.advisory
                    }
                });

                alertLayer.add(graphic);
            });

            webMap.when(() => {
                webMap.add(alertLayer);

                // Apply popup templates on all feature layers
                webMap.layers.forEach((layer: any) => {
                    if (layer.type === 'feature') applyPopupTemplate(layer as FeatureLayer);
                    if (layer.type === 'group') {
                        (layer as any).layers?.forEach((subLayer: any) => {
                            if (subLayer.type === 'feature') applyPopupTemplate(subLayer as FeatureLayer);
                        });
                    }
                });
            });

            // Wire up click → left panel
            view.on('click', async (event) => {
                const hitTestResult = await view.hitTest(event);

                const graphicHit = hitTestResult.results.find(
                    (r: any) => r.type === 'graphic' && r.graphic?.attributes
                ) as any;

                if (graphicHit) {
                    const attributes = graphicHit.graphic.attributes;
                    const layerTitle = (graphicHit.graphic.layer as any)?.title || 'Feature Info';
                    onFeatureSelected(attributes, layerTitle);
                } else {
                    onFeatureSelected(null, '');
                }
            });
        }

        return () => {
            if (view) view.destroy();
        };
    }, []);

    return <div className="h-full w-full rounded-b-xl overflow-hidden" ref={mapDiv}></div>;
};

function applyPopupTemplate(layer: FeatureLayer) {
    layer.when(() => {
        if (!layer.fields || layer.fields.length === 0) return;
        const fieldInfos = layer.fields
            .filter((f: any) => !['Shape', 'SHAPE', 'FID'].includes(f.name))
            .map((f: any) => ({
                fieldName: f.name,
                label: f.alias || f.name,
                format: f.type === 'double' || f.type === 'integer' ? { digitSeparator: true, places: 2 } : undefined
            }));
        layer.popupTemplate = new PopupTemplate({ title: layer.title || 'Feature', content: [{ type: 'fields', fieldInfos }], outFields: ['*'] });
    });
}

export default SmartMap;
