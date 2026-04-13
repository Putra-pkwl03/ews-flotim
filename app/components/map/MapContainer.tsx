'use client';

import { MapContainer as LeafletMap, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherMarkers } from './WeatherMarkers';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Pisahkan pengecekan window agar tidak error di server (Next.js)
const isServer = typeof window === 'undefined';

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (map && center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function MapContainer({ lat, lon, magnitude, titikIkan }: any) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safety values
  const safeLat = lat || -8.3405;
  const safeLon = lon || 122.9806;
  const safeMag = magnitude || 0;
  const position: [number, number] = [safeLat, safeLon];

  // Inisialisasi icon di dalam komponen atau pastikan hanya di client
  const earthquakeIcon = !isServer ? L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-24 h-24 bg-red-500 rounded-full animate-ping opacity-10"></div>
        <div class="relative w-6 h-6 bg-red-600 rounded-full border-[3px] border-white shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
      </div>
    `,
    iconSize: [96, 96],
    iconAnchor: [48, 48],
  }) : null;

  if (!mounted) return <div className="h-full w-full bg-slate-950 animate-pulse" />;

  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 z-0 overflow-hidden border border-white/10 shadow-inner">
        <LeafletMap 
          center={position} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false} // Biasanya lebih rapi untuk dashboard
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            attribution='&copy; Google Maps'
          />
          
          <ChangeView center={position} />

          {/* Render Ikon Cuaca & Titik Ikan */}
          {titikIkan && <WeatherMarkers points={titikIkan} />}

          {/* Marker Episenter Gempa */}
          {earthquakeIcon && <Marker position={position} icon={earthquakeIcon} />}

          <Circle
            center={position}
            radius={safeMag * 5000} 
            pathOptions={{ 
              fillColor: '#ef4444', 
              color: '#ef4444', 
              weight: 2, 
              fillOpacity: 0.15, 
              dashArray: '5, 10' 
            }}
          />
        </LeafletMap>
      </div>
      
      {/* HUD Info dengan pengecekan toFixed */}
      <div className="absolute top-6 left-6 z-[400] bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
        <p className="text-[9px] text-red-500 font-black uppercase tracking-widest">Live Monitoring</p>
        <p className="text-white text-xs font-mono">
          {safeLat.toFixed(4)}°S / {safeLon.toFixed(4)}°E
        </p>
      </div>
    </div>
  );
}