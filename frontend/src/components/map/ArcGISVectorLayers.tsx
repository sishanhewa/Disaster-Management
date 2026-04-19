import { useEffect, useRef, useState, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { floodApi } from '../../api/endpoints';

export interface LayerDef {
    id: string;
    label: string;
    icon: string;
    defaultOn: boolean;
    type?: 'vector' | 'raster';
    url?: string;             
    style?: L.PathOptions;    
    tooltipField?: string;    
    tooltipLabel?: string;    
}

export const ALL_LAYER_DEFS: LayerDef[] = [
    {
        id: 'rivers',
        label: 'Rivers',
        icon: '🌊',
        defaultOn: false,
        style: { color: '#38bdf8', weight: 1.8, opacity: 0.55, fillOpacity: 0 },
        tooltipField: 'RIVER_NAME',
        tooltipLabel: 'River',
    },
    {
        id: 'floodNov2025',
        label: 'Flood Zones',
        icon: '🔴',
        defaultOn: false,
        style: { color: '#ef4444', weight: 1.5, opacity: 0.5, fillColor: '#ef4444', fillOpacity: 0.12 },
        tooltipField: 'Name',
        tooltipLabel: 'Flood Zone',
    },
    {
        id: 'districts',
        label: 'Districts',
        icon: '🗺️',
        defaultOn: false,
        style: { color: '#64748b', weight: 1.5, opacity: 0.35, fillColor: '#94a3b8', fillOpacity: 0.05, dashArray: '3,3' },
        tooltipField: 'ADM2_EN',
        tooltipLabel: 'District',
    },
];

interface ArcGISVectorLayersProps {
    activeLayers: Set<string>;
}

export function ArcGISVectorLayers({ activeLayers }: ArcGISVectorLayersProps) {
    const map = useMap();
    const layerCache = useRef<Record<string, any>>({}); 
    const leafletLayers = useRef<Record<string, L.GeoJSON>>({}); 

    const fetchLayer = useCallback(async (layerDef: LayerDef) => {
        if (layerCache.current[layerDef.id]) return layerCache.current[layerDef.id];
        try {
            const data = await floodApi.getArcgisGeoJson(layerDef.id);
            layerCache.current[layerDef.id] = data;
            return data;
        } catch (err) {
            console.error(`Failed to fetch layer ${layerDef.id}:`, err);
            return null;
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        const syncLayers = async () => {
            for (const def of ALL_LAYER_DEFS) {
                if (def.type === 'raster') continue;

                const isActive = activeLayers.has(def.id);
                const existingLayer = leafletLayers.current[def.id];

                if (isActive && !existingLayer) {
                    const data = await fetchLayer(def);
                    if (cancelled || !data || !activeLayers.has(def.id)) continue;

                    const geoLayer = L.geoJSON(data, {
                        style: () => def.style || {},
                        onEachFeature: (feature, layer) => {
                            if (def.tooltipField && feature.properties) {
                                const value = feature.properties[def.tooltipField]
                                    || feature.properties['Name']
                                    || feature.properties['name']
                                    || feature.properties['NAME'];
                                if (value) {
                                    layer.bindTooltip(
                                        `<strong>${def.tooltipLabel || def.label}:</strong> ${value}`,
                                        { sticky: true, direction: 'top' }
                                    );
                                }
                            }
                        },
                    });

                    geoLayer.addTo(map);
                    leafletLayers.current[def.id] = geoLayer;
                } else if (!isActive && existingLayer) {
                    try {
                        existingLayer.removeFrom(map);
                        map.removeLayer(existingLayer);
                    } catch (e) {}
                    delete leafletLayers.current[def.id];
                }
            }
        };

        syncLayers();
        return () => { cancelled = true; };
    }, [activeLayers, map, fetchLayer]);

    return null;
}

export function LayerTogglePanel({ isOpen, activeLayers, onToggle, onClose }: any) {
    
    

    if (!isOpen) return null;

    return (
        <div className={`absolute top-20 right-3 z-[1001] w-56 rounded-xl border shadow-2xl overflow-hidden transition-all bg-slate-900/95 border-white/10 backdrop-blur-lg`}>
            <div className={`px-3 py-2 flex items-center justify-between border-b border-white/5`}>
                <span className={`text-xs font-semibold uppercase tracking-wider text-slate-400`}>GIS Layers</span>
                <button onClick={onClose} className={`text-xs px-1.5 py-0.5 rounded text-slate-500 hover:text-slate-300`}>✕</button>
            </div>
            <div className="py-1 max-h-72 overflow-y-auto">
                {ALL_LAYER_DEFS.map(def => {
                    const isActive = activeLayers.has(def.id);
                    return (
                        <button key={def.id} onClick={() => onToggle(def.id)} className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${isActive ? ('bg-sky-950/50 text-sky-300') : ('text-slate-300 hover:bg-white/5')}`}>
                            <span className="text-sm">{def.icon}</span>
                            <span className="flex-1 text-left font-medium">{def.label}</span>
                            <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors ${isActive ? 'border-sky-500 bg-sky-500' : ('border-slate-600')}`}>
                                {isActive && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
