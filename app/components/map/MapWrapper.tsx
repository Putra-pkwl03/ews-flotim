'use client';

import dynamic from 'next/dynamic';

// 1. Tambahkan history ke dalam interface
interface MapProps {
  lat: number;
  lon: number;
  magnitude: number;
  fishingPoints: any[];
  history: any; // Tambahkan ini
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

// 2. Terima history di parameter fungsi
export default function MapWrapper({ lat, lon, magnitude, fishingPoints, history }: MapProps) {
  return (
    <div className="w-full h-full">
      {/* 3. Teruskan history ke MapContainer */}
      <MapContainer 
        lat={lat} 
        lon={lon} 
        magnitude={magnitude} 
        titikIkan={fishingPoints} 
        history={history} 
      />
    </div>
  );
}