import { useEffect, useRef } from 'react';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import LayerList from '@arcgis/core/widgets/LayerList';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import '@arcgis/core/assets/esri/themes/dark/main.css';

interface SmartMapProps {
    onFeatureSelected: (attributes: Record<string, any> | null, layerTitle: string) => void;
}

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

            // --- Add Real ArcGIS Feature Layer ---
            const arcGisLayer = new FeatureLayer({
                url: 'https://services3.arcgis.com/J7ZFXmR8rSmQ3FGf/arcgis/rest/services/Flood_Map/FeatureServer/11',
                outFields: ["*"]
            });

            webMap.when(() => {
                webMap.add(arcGisLayer);

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

            // --- Add Layer Toggles (Operational Layers) ---
            const layerList = new LayerList({
                view: view
            });
            const layerListExpand = new Expand({
                view: view,
                content: layerList,
                expanded: false,
                expandTooltip: "Toggle Data Layers"
            });
            view.ui.add(layerListExpand, 'top-right');

            // --- Add Basemap Gallery (Names, Rivers, Terrain) ---
            const basemapGallery = new BasemapGallery({
                view: view
            });
            const bgExpand = new Expand({
                view: view,
                content: basemapGallery,
                expanded: false,
                expandTooltip: "Change Base Map (Hide/Show Rivers/Names)"
            });
            view.ui.add(bgExpand, 'top-right');

            // Wire up click → left panel
            view.on('click', async (event) => {
                const hitTestResult = await view.hitTest(event);

                // For Feature Layers, the result is in results array, and has graphic.attributes
                const featureHit = hitTestResult.results.find(
                    (r: any) => (r.type === 'graphic' || r.type === 'feature') && r.graphic?.attributes
                ) as any;

                if (featureHit) {
                    const attributes = featureHit.graphic.attributes;
                    const layerTitle = (featureHit.graphic.layer as any)?.title || 'Feature Info';
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
