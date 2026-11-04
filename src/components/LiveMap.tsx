import React, { useEffect, useRef, useState } from 'react';
import { WorkLog } from '../types';
import { MapPin, Compass, FileText } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';

interface LiveMapProps {
  logs: WorkLog[];
  selectedWorker: string;
  onOpenReceipt: (log: WorkLog) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ logs, selectedWorker, onOpenReceipt }) => {
  const { t } = useLanguage();
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
        attribution: '&copy; OpenStreetMap | Shramik Sakshi',
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
            background: linear-gradient(135deg, #10b981 0%, #064e3b 100%);
            color: #ffffff;
            border: 2px solid #34d399;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px rgba(52, 211, 153, 0.5);
          ">
            <span style="transform: rotate(45deg); font-size: 13px;">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const bounds = L.latLngBounds([]);

      validLocations.forEach((log) => {
        const lat = Number(log.latitude);
        const lng = Number(log.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend([lat, lng]);

          const marker = L.marker([lat, lng], { icon: customIcon });

          const popupContent = `
            <div style="font-family: 'Inter', sans-serif; min-width: 200px; padding: 4px; background: #0c2330; color: #edf8f5; border-radius: 6px;">
              <div style="border-bottom: 2px solid #1c556f; padding-bottom: 4px; margin-bottom: 6px;">
                <span style="font-size: 10px; color: #22d3ee; font-weight: bold; text-transform: uppercase;">
                  WORK LOCATION PIN
                </span>
                <h4 style="font-weight: 800; margin: 2px 0 0 0; color: #edf8f5; font-size: 14px;">
                  ${log.location_name || 'Work Site'}
                </h4>
              </div>
              <p style="margin: 3px 0; font-size: 12px; color: #9fc7bd;">
                <strong style="color: #edf8f5;">Worker:</strong> ${log.phone_number}
              </p>
              <p style="margin: 3px 0; font-size: 12px; color: #34d399; font-weight: bold;">
                Daily Wage: ₹${log.estimated_wage.toFixed(2)}
              </p>
              <span style="font-family: monospace; font-size: 11px; color: #22d3ee; font-weight: bold;">
                ${log.verification_token}
              </span>
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
    <div className="retro-card rounded-xl p-4 sm:p-6 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-[#1b4b60] pb-3.5 mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="retro-stamp-cyan text-[11px] font-extrabold px-2.5 py-0.5 rounded">
              {t.surveyPlotBadge}
            </span>
            <span className="text-xs font-mono font-bold text-[#34d399]">
              {validLocations.length} {t.plottedStationsCount}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#edf8f5] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#22d3ee] shrink-0" />
            <span>{t.mapChartTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#93c3b7] mt-0.5 font-medium">
            {t.mapChartSubtitle}
          </p>
        </div>
      </div>

      <div className="retro-inset rounded-xl overflow-hidden shadow-inner">
        <div
          ref={mapContainerRef}
          className="w-full h-80 sm:h-96 z-0"
          style={{ minHeight: '320px' }}
        />

        {/* Map footer bar */}
        <div className="bg-[#061824] border-t border-[#1b485d] p-3 px-4 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 text-[#edf8f5]">
          <div className="flex flex-wrap items-center gap-3 font-semibold text-[#8ebfb4]">
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping shrink-0"></span>
              <span>{t.activePinLabel}</span>
            </span>
            <span className="hidden sm:inline text-[#1c4b60]">•</span>
            <span className="text-[#22d3ee]">
              {t.surveyScaleLabel}
            </span>
            <span className="hidden sm:inline text-[#1c4b60]">•</span>
            <span className="text-[#34d399] font-bold">
              ✓ {t.gpsProtocolActive}
            </span>
          </div>

          {activeSite && (
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <span className="font-mono font-bold text-[#22d3ee] text-xs sm:text-sm">
                {t.selectedLabel}: {activeSite.phone_number}
              </span>
              <button
                onClick={() => onOpenReceipt(activeSite)}
                className="retro-btn-petrol px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <FileText className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span>{t.viewVoucherBtn}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
