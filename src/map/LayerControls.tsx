// src/map/LayerControls.tsx
// On-canvas floating layer controls with filter toggles, camera helpers, and map legend

import React, { useState } from 'react';
import { useMirrahStore, MapLayerToggles } from '../store/useMirrahStore';
import {
  Compass,
  Layers,
  Shield,
  Pickaxe,
  Flame,
  Route,
  HeartHandshake,
  AlertTriangle,
  RotateCcw,
  Network,
  BookOpen,
  ZoomIn,
  ZoomOut,
  X,
} from 'lucide-react';

interface LayerControlsProps {
  onSnapNorth: () => void;
  onResetView: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({
  onSnapNorth,
  onResetView,
  onZoomIn,
  onZoomOut,
}) => {
  const { layerToggles, toggleLayer, kharaanControl, zahariControl } = useMirrahStore();
  const [showLegend, setShowLegend] = useState(false);

  const layers: { key: keyof MapLayerToggles; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'controlZones', label: 'Control Zones (62/38)', icon: <Shield className="w-3.5 h-3.5" />, color: 'text-amber-400' },
    { key: 'resources', label: 'Mineral Resources', icon: <Pickaxe className="w-3.5 h-3.5" />, color: 'text-sky-400' },
    { key: 'military', label: 'Military Outposts', icon: <Layers className="w-3.5 h-3.5" />, color: 'text-amber-300' },
    { key: 'ashenHand', label: 'Ashen Hand Cells', icon: <Flame className="w-3.5 h-3.5" />, color: 'text-red-400' },
    { key: 'routes', label: 'Trade Routes', icon: <Route className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
    { key: 'corridors', label: 'Humanitarian Corridors', icon: <HeartHandshake className="w-3.5 h-3.5" />, color: 'text-purple-400' },
    { key: 'sanctionsHeat', label: 'Sanctions Heat Halo', icon: <AlertTriangle className="w-3.5 h-3.5" />, color: 'text-orange-400' },
    { key: 'showStrategicLinks', label: 'Strategic Links', icon: <Network className="w-3.5 h-3.5" />, color: 'text-yellow-400' },
  ];

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-auto">
      {/* Territory Split Badge */}
      <div className="bg-parchment-950/90 border border-kharaan/40 rounded-lg p-2.5 backdrop-blur-md shadow-document-dark text-xs w-64">
        <div className="flex justify-between items-center mb-1.5 font-serif font-bold text-parchment-100">
          <span>Territorial Status</span>
          <span className="text-[10px] text-red-400 font-mono animate-pulse">● The Seam Contested</span>
        </div>
        <div className="h-2.5 w-full bg-parchment-900 rounded-full overflow-hidden flex border border-parchment-400/20">
          <div
            className="bg-gradient-to-r from-kharaan-dark to-kharaan transition-all duration-700 h-full flex items-center justify-center text-[9px] text-ink-dark font-bold"
            style={{ width: `${kharaanControl}%` }}
          >
            {kharaanControl}%
          </div>
          <div
            className="bg-gradient-to-r from-zahari to-zahari-light transition-all duration-700 h-full flex items-center justify-center text-[9px] text-parchment-100 font-bold"
            style={{ width: `${zahariControl}%` }}
          >
            {zahariControl}%
          </div>
        </div>
        <div className="flex justify-between text-[10px] mt-1 text-parchment-300 font-sans">
          <span className="text-kharaan-light font-medium">Kharaan ({kharaanControl}%)</span>
          <span className="text-zahari-light font-medium">Zahari Front ({zahariControl}%)</span>
        </div>
      </div>

      {/* Layer Toggles Floating Panel */}
      <div className="bg-parchment-950/90 border border-kharaan/30 rounded-lg p-2.5 backdrop-blur-md shadow-document-dark text-xs w-64">
        <div className="text-[11px] font-serif uppercase tracking-wider text-kharaan font-bold mb-2 flex items-center justify-between border-b border-kharaan/20 pb-1">
          <span>Atlas Layers</span>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="text-[9px] font-mono text-parchment-300 hover:text-kharaan-light flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3 h-3 text-kharaan" />
            <span>Legend</span>
          </button>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {layers.map((l) => {
            const active = layerToggles[l.key];
            return (
              <button
                key={l.key}
                onClick={() => toggleLayer(l.key)}
                className={`w-full flex items-center justify-between px-2 py-1 rounded transition-all text-[11px] ${
                  active
                    ? 'bg-parchment-900/90 text-parchment-100 border border-kharaan/30 shadow-sm'
                    : 'bg-parchment-950/40 text-parchment-400 hover:text-parchment-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={active ? l.color : 'text-parchment-500'}>{l.icon}</span>
                  <span>{l.label}</span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    active ? 'bg-kharaan shadow-[0_0_6px_#c9a13b]' : 'bg-parchment-800'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Camera Orientation & Zoom Quick Actions */}
        <div className="mt-3 pt-2 border-t border-kharaan/20 grid grid-cols-2 gap-1.5">
          <button
            onClick={onSnapNorth}
            className="flex items-center justify-center gap-1 bg-parchment-900/80 hover:bg-parchment-800 text-parchment-200 hover:text-kharaan-light py-1 px-1.5 rounded border border-parchment-400/20 text-[10px] font-medium transition-colors"
            title="Orient camera facing directly North"
          >
            <Compass className="w-3 h-3 text-kharaan" />
            <span>Snap North</span>
          </button>
          <button
            onClick={onResetView}
            className="flex items-center justify-center gap-1 bg-parchment-900/80 hover:bg-parchment-800 text-parchment-200 hover:text-kharaan-light py-1 px-1.5 rounded border border-parchment-400/20 text-[10px] font-medium transition-colors"
            title="Reset isometric camera view"
          >
            <RotateCcw className="w-3 h-3 text-kharaan" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* Map Symbology Legend Modal / Drawer */}
      {showLegend && (
        <div className="bg-parchment-950/95 border border-kharaan/40 rounded-lg p-3 backdrop-blur-md shadow-2xl text-xs w-64 animate-in fade-in duration-200">
          <div className="flex justify-between items-center pb-1.5 border-b border-kharaan/20 mb-2 font-serif font-bold text-parchment-100">
            <span>Diplomatic Atlas Symbology</span>
            <button
              onClick={() => setShowLegend(false)}
              className="text-parchment-400 hover:text-parchment-100 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-[10px] text-parchment-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-kharaan border border-ink" />
              <span>Kharaan Sovereign Territory / Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-zahari border border-ink" />
              <span>Zahari Resistance Territory / Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-seam border border-ink animate-pulse" />
              <span>The Seam (Pulsing Ceasefire Buffer)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-600" />
              <span>Ashen Hand Insurgent Node (Hostile)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-kharaan" />
              <span>Gold Road (Primary Veridium Trunk)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-emerald-500 border-dashed border-b" />
              <span>Smuggler's Vein (Clandestine Convoy)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-cyan-400 border-dashed border-b" />
              <span>Mercy Corridor (Maritime Aid Link)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-amber-400" />
              <span>Sanctions Target Heat Halo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
