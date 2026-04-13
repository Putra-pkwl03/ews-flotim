import { Badge } from "../ui/Badge";
import { MapPin, Clock, AlertCircle, ExternalLink } from "lucide-react";

export const EarthquakeCard = ({ data }: any) => {
  // Karena data dari database berbentuk Array [{}], kita ambil index ke-0
  const item = Array.isArray(data) ? data[0] : data;

  if (!item) return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex items-center justify-center h-full text-slate-400 text-xs">
      Memuat data gempa...
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col h-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Kejadian Terkini</p>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Gempa Bumi</h2>
        </div>
        <Badge className="bg-red-50 text-red-600 border-red-100 text-sm py-1 px-3 font-black">
          {item.magnitude} <span className="text-[10px] ml-0.5">SR</span>
        </Badge>
      </div>

      <div className="flex gap-6 mb-6">
        {/* Info Grid */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Kedalaman</p>
              <p className="text-md font-bold text-slate-700">{item.kedalaman}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Koordinat</p>
              <p className="text-[10px] font-bold text-slate-700 leading-tight">
                {item.lintang} <br/> {item.bujur}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter flex items-center gap-1">
              <Clock size={10} /> Waktu Kejadian
            </p>
            <p className="text-xs font-bold text-slate-600 leading-tight">
              {item.tanggal} <br />
              <span className="text-slate-400 font-medium">{item.jam}</span>
            </p>
          </div>
        </div>

        {/* Shakemap Section */}
        {item.shakemap && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <img 
                src={`https://static.bmkg.go.id/${item.shakemap}`} 
                className="w-24 h-24 rounded-xl object-cover border-2 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300" 
                alt="Peta Guncangan"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5"></div>
            </div>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest text-center">Peta<br/>Guncangan</p>
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="space-y-3 border-t border-slate-50 mb-4">
        <div className="flex gap-3 items-start">
          <div className="p-1.5 bg-slate-50 rounded-lg shrink-0">
            <MapPin size={14} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Wilayah</p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
              {item.wilayah}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="p-1.5 bg-amber-50 rounded-lg shrink-0">
            <AlertCircle size={14} className="text-amber-500" />
          </div>
          <div>
            <p className="text-[9px] text-amber-500 uppercase font-black tracking-tighter">Potensi</p>
            <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
              {item.potensi}
            </p>
          </div>
        </div>
      </div>

      {/* Attribution Link */}
      <div className="border-t border-slate-50 flex justify-end">
        <a 
          href="https://data.bmkg.go.id/gempabumi/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 hover:text-blue-500 transition-colors duration-200 group"
        >
          <span>DATA BY BMKG</span>
          <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </a>
      </div>
    </div>
  );
};