import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Complaint } from '../types';

interface CityMapProps {
  complaints?: Complaint[];
  selectedLocation?: { lat: number; lng: number } | null;
  onSelectLocation?: (lat: number, lng: number) => void;
  onSelectComplaint?: (complaint: Complaint) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactiveSelect?: boolean;
}

export const CityMap: React.FC<CityMapProps> = ({
  complaints = [],
  selectedLocation,
  onSelectLocation,
  onSelectComplaint,
  center = [40.7128, -74.0060],
  zoom = 13,
  height = '500px',
  interactiveSelect = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tempMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Handle map clicks for selecting a report location
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onSelectLocation) {
          onSelectLocation(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update selected location pin (e.g. while reporting)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tempMarkerRef.current) {
      tempMarkerRef.current.remove();
      tempMarkerRef.current = null;
    }

    if (selectedLocation) {
      const icon = L.divIcon({
        className: 'custom-selected-pin',
        html: `
          <div style="
            background: #2563eb;
            color: white;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(37,99,235,0.6);
            transform: translate(-16px, -16px);
            animation: bounce 1s infinite alternate;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 4px;">
          <strong style="color: #1e293b; display: block; margin-bottom: 2px;">Selected Issue Coordinate</strong>
          <span style="color: #64748b; font-family: monospace;">${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}</span>
        </div>
      `).openPopup();
      tempMarkerRef.current = marker;
      map.panTo([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  // Render complaint markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    complaints.forEach((comp) => {
      if (!comp.latitude || !comp.longitude) return;

      // Color scheme based on priority & status
      let bgColor = '#2563eb'; // blue (normal/active)
      if (comp.status === 'resolved') {
        bgColor = '#10b981'; // green
      } else if (comp.priority === 'critical') {
        bgColor = '#ef4444'; // red
      } else if (comp.priority === 'high') {
        bgColor = '#f97316'; // orange
      } else if (comp.priority === 'medium') {
        bgColor = '#eab308'; // yellow/amber
      }

      const customIcon = L.divIcon({
        className: 'custom-city-pin',
        html: `
          <div style="
            background: ${bgColor};
            color: white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transform: translate(-14px, -14px);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="font-size: 11px; font-weight: bold;">
              ${comp.priority === 'critical' ? '!' : comp.status === 'resolved' ? '✓' : '•'}
            </span>
          </div>
        `,
        iconSize: [28, 28],
      });

      const marker = L.marker([comp.latitude, comp.longitude], { icon: customIcon });

      const statusBadge = `
        <span style="
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          background: ${comp.status === 'resolved' ? '#dcfce7; color: #15803d;' : '#dbeafe; color: #1d4ed8;'}
        ">
          ${comp.status.replace('_', ' ')}
        </span>
      `;

      const priorityBadge = `
        <span style="
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          background: #f1f5f9;
          color: #475569;
          margin-left: 4px;
        ">
          ${comp.priority.toUpperCase()}
        </span>
      `;

      const popupContent = `
        <div style="font-family: inherit; max-width: 260px; line-height: 1.4;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 11px; font-weight: 800; color: #64748b; font-family: monospace;">#${comp.reference_number}</span>
            <div>${statusBadge}${priorityBadge}</div>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${comp.title}</h4>
          <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${comp.description}
          </p>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            📍 <strong>${comp.ward}</strong> &bull; ${comp.address_text || 'Metropolitan Area'}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span style="font-size: 10px; color: #94a3b8;">${new Date(comp.created_at).toLocaleDateString()}</span>
            <button id="view-complaint-${comp.id}" style="
              background: #2563eb;
              color: white;
              border: none;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            ">
              View Details →
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-complaint-${comp.id}`);
        if (btn && onSelectComplaint) {
          btn.onclick = () => onSelectComplaint(comp);
        }
      });

      markersLayer.addLayer(marker);
    });
  }, [complaints, onSelectComplaint]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Floating Interactive Guide */}
      {interactiveSelect && (
        <div className="absolute top-3 left-14 z-[500] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-ping" />
          Click anywhere on the map to place problem location pin
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-[500] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200 text-xs flex flex-wrap items-center gap-3">
        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
          <span className="text-slate-600 font-medium">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" />
          <span className="text-slate-600 font-medium">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 ring-2 ring-blue-200" />
          <span className="text-slate-600 font-medium">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          <span className="text-slate-600 font-medium">Resolved</span>
        </div>
      </div>
    </div>
  );
};
