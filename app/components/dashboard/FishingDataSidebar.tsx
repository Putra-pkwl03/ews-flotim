'use client';

interface Point {
  id: number;
  nama: string;
  suhu: number;
  potensi: string;
  pesan: string;
}

export default function FishingDataSidebar({ points = [], onSelect }: { points: Point[], onSelect: (p: Point) => void }) {
  return (
    <div className="w-full h-full border-l border-white/10 flex flex-col ">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-white font-black text-sm tracking-widest uppercase">Marine Data Points</h3>
        <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">
          {points?.length || 0} Active Sensors
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pr-2 space-y-3 custom-scrollbar ">
        {points && points.map((p, index) => (
          <div 
          key={`item-${index}-${p.id || 'no-id'}`} 
    onClick={() => onSelect(p)}
    className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-blue-500/50 p-4 rounded-2xl transition-all cursor-pointer"
  >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] text-white font-bold uppercase tracking-tight">
                {p.nama || 'Unnamed Node'}
              </span>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                p.potensi === 'Sangat Tinggi' ? 'bg-emerald-500/20 text-emerald-400' : 
                p.potensi === 'Potensi Sedang' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {p.potensi}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-tighter">Temperature</span>
                <span className="text-sm text-blue-400 font-mono font-bold">{p.suhu}°C</span>
              </div>
              <div className="flex-1 h-[1.5px] bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_8px_#3b82f6] transition-all duration-1000" 
                  style={{ width: `${Math.min((p.suhu / 35) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}

        {points?.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-600 text-[10px] uppercase font-black tracking-widest">No Sensor Data Available</p>
          </div>
        )}
      </div>
    </div>
  );
}