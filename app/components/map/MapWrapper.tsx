'use client';

import dynamic from 'next/dynamic';

interface MapProps {
  lat: number;
  lon: number;
  magnitude: number;
  fishingPoints: any[];
}

const MapContainer = dynamic(() => import('./MapContainer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <p className="text-blue-500 text-[10px] tracking-[0.3em] uppercase font-bold mb-2">SISTEM SENTINEL</p>
        <p className="text-slate-500 text-[9px] tracking-widest animate-bounce">MENGINISIALISASI PETA...</p>
      </div>
    </div>
  )
});

export default function MapWrapper({ lat, lon, magnitude, fishingPoints }: MapProps) {
  return (
    <div className="w-full h-full">
      {/* Cukup kirim datanya saja ke MapContainer */}
      <MapContainer 
        lat={lat} 
        lon={lon} 
        magnitude={magnitude} 
        titikIkan={fishingPoints} 
      />
    </div>
  );
}