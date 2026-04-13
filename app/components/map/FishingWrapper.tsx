// src/components/map/FishingWrapper.tsx
'use client';
import dynamic from 'next/dynamic';

const SavuMap = dynamic(() => import('../dashboard/SavuFishingMap'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-slate-800" />
});

export default function FishingWrapper({ points }: { points: any[] }) {
  return <SavuMap points={points} />;
}