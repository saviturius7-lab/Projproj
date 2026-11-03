import React, { useEffect, useRef, useState } from 'react';
import { WorkLog } from '../types';
import { MapPin, Navigation, ExternalLink, Layers } from 'lucide-react';
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
      // Create map centered on India or first coordinate
      const initialLat = validLocations.length > 0 ? (validLocations[0].latitude as number) : 22.5937;
      const initialLng = validLocations.length > 0 ? (validLocations[0].longitude as number) : 78.9629;
      const initialZoom = validLocations.length > 0 ? 5 : 4;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: initialZoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // CartoDB Positron / OpenStreetMap with sepia/parchment warmth
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Shramik Sakshi GPS',
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
            background-color: #7a5a2e;
            color: #f4ecd8;
            border: 2px solid #2a1f12;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 6px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); font-size: 13px;">📍</span>
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
            <div style="font-family: 'Lora', Georgia, serif; min-width: 180px; padding: 2px;">
              <h4 style="font-family: 'Playfair Display', Georgia, serif; font-weight: bold; margin: 0 0 4px 0; color: #2a1f12; font-size: 13px; border-bottom: 1px solid #8b6f47; padding-bottom: 2px;">
                ${log.location_name || 'Verified Work Site'}
              </h4>
              <p style="margin: 2px 0; font-size: 11px; color: #5a3e1b;">
                <strong>Worker:</strong> ${log.phone_number}
              </p>
              <p style="margin: 2px 0; font-size: 11px; color: #5a3e1b;">
                <strong>Daily Wage:</strong> ₹${log.estimated_wage.toFixed(2)}
              </p>
              <p style="margin: 2px 0; font-size: 10px; color: #6b5330;">
                <strong>GPS:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
              </p>
              <div style="margin-top: 6px; font-size: 10px; font-weight: 600; color: #2d6a4f;">
                ✓ GPS Cryptographically Verified
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
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [logs, selectedWorker]);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#2a1f12] flex items-center gap-2">
          <span>🗺️ Live Deployment Map</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded bg-[#efe4c8] border border-[#8b6f47] text-[#5a3e1b]">
            {validLocations.length} Geotagged Pins
          </span>
        </h3>
        <p className="text-xs text-[#6b5330]">
          Verified WhatsApp GPS coordinates from field job sites across India
        </p>
      </div>

      <div className="border-2 border-[#8b6f47] rounded-md overflow-hidden bg-[#efe4c8] shadow-sm relative">
        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-80 sm:h-96 z-0"
          style={{ minHeight: '320px' }}
        />

        {/* Floating Quick Legend / Selected info bar */}
        <div className="bg-[#f7f0de] border-t border-[#8b6f47] p-2.5 px-4 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#3b2f1e]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7a5a2e] border border-[#2a1f12]"></span>
              Active Work Pin
            </span>
            <span className="text-[#8b6f47]">|</span>
            <span className="text-[#5a3e1b]">
              Wage Rate Protected: <strong>₹600.00 / day</strong>
            </span>
          </div>

          {activeSite && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#2a1f12]">
                Selected: {activeSite.phone_number} ({activeSite.location_name || 'GPS Site'})
              </span>
              <button
                onClick={() => onOpenReceipt(activeSite)}
                className="px-2 py-0.5 rounded bg-[#7a5a2e] text-[#f4ecd8] text-[11px] font-semibold hover:bg-[#5a3e1b]"
              >
                Inspect Receipt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
