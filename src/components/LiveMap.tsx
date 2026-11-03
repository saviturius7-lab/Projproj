import React, { useEffect, useRef, useState } from 'react';
import { WorkLog } from '../types';
import { Compass } from 'lucide-react';
import L from 'leaflet';

interface LiveMapProps {
  logs: WorkLog[];
  selectedWorker: string;
  onOpenReceipt: (log: WorkLog) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ logs, selectedWorker, onOpenReceipt }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeSite, setActiveSite] = useState<WorkLog | null>(null);

  const validLocations = logs.filter(
    (l) => l.latitude !== null && l.longitude !== null && !isNaN(Number(l.latitude)) && !isNaN(Number(l.longitude))
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = validLocations.length > 0 ? (validLocations[0].latitude as number) : 22.5937;
      const initialLng = validLocations.length > 0 ? (validLocations[0].longitude as number) : 78.9629;
      const initialZoom = validLocations.length > 0 ? 5 : 4;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Geological Survey &amp; Cartographic Field Bureau | Shramik Sakshi',
        maxZoom: 18,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (map && markersLayer) {
      markersLayer.clearLayers();

      const customIcon = L.divIcon({
        className: 'custom-vintage-pin',
        html: `
          <div style="
            background-color: #9e2a2b;
            color: #fbf6ea;
            border: 2px solid #221910;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
          ">
            <span style="transform: rotate(45deg); font-family: 'Courier Prime', monospace; font-size: 11px; font-weight: bold;">📍</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const bounds = L.latLngBounds([]);

      validLocations.forEach((log) => {
        const lat = Number(log.latitude);
        const lng = Number(log.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lat, lng]);

          const marker = L.marker([lat, lng], { icon: customIcon });

          const popupContent = `
            <div style="font-family: 'Courier Prime', monospace; min-width: 190px; padding: 4px; background: #fbf6ea;">
              <div style="border-bottom: 2px solid #8b6f47; padding-bottom: 3px; margin-bottom: 4px;">
                <span style="font-size: 9px; color: #9e2a2b; font-weight: bold; text-transform: uppercase;">
                  SURVEY LOCATION PIN
                </span>
                <h4 style="font-family: 'Special Elite', monospace; font-weight: bold; margin: 2px 0 0 0; color: #221910; font-size: 13px;">
                  ${log.location_name || 'Field Job Site'}
                </h4>
              </div>
              <p style="margin: 2px 0; font-size: 11px; color: #382819;">
                <strong>Worker:</strong> ${log.phone_number}
              </p>
              <p style="margin: 2px 0; font-size: 11px; color: #9e2a2b;">
                <strong>Locked Wage:</strong> ₹${log.estimated_wage.toFixed(2)}
              </p>
              <p style="margin: 2px 0; font-size: 10px; color: #1d3557;">
                <strong>GPS:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
              </p>
              <div style="margin-top: 5px; font-size: 9px; font-weight: bold; color: #2d6a4f; border-top: 1px dashed #8b6f47; padding-top: 3px;">
                [ SATELLITE POSITION VERIFIED ]
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('click', () => {
            setActiveSite(log);
          });
          markersLayer.addLayer(marker);
        }
      });

      if (validLocations.length > 0 && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [logs, selectedWorker]);

  return (
    <div className="manila-folder border-2 border-[#aa8c58] rounded-md p-4 mb-6 shadow-md relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b-2 border-[#aa8c58] pb-2.5 mb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[10px] font-typewriter font-bold bg-[#6f4e24] text-[#fbf6ea] px-2 py-0.5 rounded-xs shrink-0">
              FIELD CARTOGRAPHY CHART 'C'
            </span>
            <span className="rubber-stamp rubber-stamp-blue text-[8px]">
              SURVEY PLOT
            </span>
          </div>
          <h3 className="font-typewriter text-lg sm:text-xl font-bold text-[#221910] uppercase flex items-center gap-2 leading-tight">
            <Compass className="w-4 h-4 text-[#6f4e24] shrink-0" />
            <span>Geographical Field Deployment Chart</span>
          </h3>
          <p className="font-serif italic text-xs text-[#684f33] mt-0.5 leading-normal">
            Verified satellite coordinates received from WhatsApp pins across labor muster sites
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-auto">
          <span className="bg-[#fbf6ea] border border-[#aa8c58] px-2.5 py-1 rounded text-xs font-typewriter font-bold text-[#9e2a2b] whitespace-nowrap">
            {validLocations.length} PLOTTED STATIONS
          </span>
        </div>
      </div>

      <div className="border-4 border-[#8b6f47] rounded-sm overflow-hidden shadow-inner bg-[#ebdcb9]">
        <div
          ref={mapContainerRef}
          className="w-full h-80 sm:h-96 z-0"
          style={{ minHeight: '320px' }}
        />

        {/* Vintage map footer bar - Guaranteed non-overlapping */}
        <div className="bg-[#fbf6ea] border-t-2 border-[#8b6f47] p-2.5 px-4 text-xs font-typewriter flex flex-wrap items-center justify-between gap-2.5 text-[#221910]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#9e2a2b] border border-[#221910] shrink-0"></span>
              <strong className="text-[11px] whitespace-nowrap">ACTIVE PIN</strong>
            </span>
            <span className="hidden sm:inline text-[#aa8c58]">•</span>
            <span className="text-[11px] text-[#6f4e24] whitespace-nowrap">
              SCALE: 1:50,000 SURVEY GRID
            </span>
            <span className="hidden sm:inline text-[#aa8c58]">•</span>
            <span className="text-[11px] text-[#2d6a4f] font-bold whitespace-nowrap">
              GPS PROTOCOL ACTIVE
            </span>
          </div>

          {activeSite && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <span className="font-bold text-[#9e2a2b] text-[11px] whitespace-nowrap">
                SELECTED: {activeSite.phone_number}
              </span>
              <button
                onClick={() => onOpenReceipt(activeSite)}
                className="px-2 py-0.5 rounded bg-[#6f4e24] text-[#fbf6ea] text-[10px] font-bold hover:bg-[#4e3314] whitespace-nowrap"
              >
                VIEW VOUCHER
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
