import { Wind, Thermometer, Compass, CheckCircle2, Info } from "lucide-react";

export const WeatherCard = ({ data }: any) => {
  return (
    <div className="bg-white rounded-2xl p-6 h-[50vh] shadow-xl border border-slate-100 relative">
      {/* Icon Info dengan Tooltip */}
      <div className="absolute bottom-6 right-6 group">
        <Info
          size={18}
          className="text-slate-600 hover:text-blue-500 cursor-help transition-colors"
        />

        {/* Konten Penjelasan Data */}
        <div className="absolute right-0 bottom-full mb-3 w-72 bg-slate-900/80 backdrop-blur-md text-white p-5 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none transition-all duration-300 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
          {/* Header dengan Aksen Garis */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-blue-500 rounded-full"></div>
            <p className="font-black text-[10px] text-blue-400 uppercase tracking-[0.15em]">
              Informasi Parameter
            </p>
          </div>

          <div className="space-y-4">
            {/* Item 1: Angin */}
            <div className="group/item">
              <p className="text-[11px] font-bold text-white flex items-center gap-1.5 mb-1">
                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                Kecepatan Angin
              </p>
              <p className="text-[10px] text-slate-300 leading-relaxed pl-2.5 border-l border-slate-700 ml-0.5">
                Rata-rata pergerakan udara permukaan laut dalam satuan{" "}
                <span className="text-blue-300">knot</span>.
              </p>
            </div>

            {/* Item 2: Suhu */}
            <div className="group/item">
              <p className="text-[11px] font-bold text-white flex items-center gap-1.5 mb-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                Suhu Laut
              </p>
              <p className="text-[10px] text-slate-300 leading-relaxed pl-2.5 border-l border-slate-700 ml-0.5">
                Estimasi temperatur permukaan air (
                <span className="text-emerald-300">SST</span>) di wilayah Laut
                Sawu.
              </p>
            </div>

            {/* Item 3: GFS */}
            <div className="group/item">
              <p className="text-[11px] font-bold text-white flex items-center gap-1.5 mb-1">
                <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                Model GFS Maritim
              </p>
              <p className="text-[10px] text-slate-300 leading-relaxed pl-2.5 border-l border-slate-700 ml-0.5">
                Pemodelan{" "}
                <span className="text-amber-300">Global Forecast System</span>{" "}
                untuk akurasi wilayah pesisir.
              </p>
            </div>
          </div>

          {/* Panah Tooltip (Tail) */}
          <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-slate-900 rotate-45 border-r border-b border-white/10"></div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            Status Maritim
          </p>
          <h2 className="text-2xl font-black text-slate-800">Cuaca Laut</h2>
        </div>

        <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
          <CheckCircle2 size={12} /> Aman
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Angin */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Wind size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Kecepatan Angin
            </span>
          </div>
          <p className="text-lg font-bold text-slate-700">
            {data?.kecepatan_angin || "0"}{" "}
            <span className="text-xs font-normal">knot</span>
          </p>
        </div>

        {/* Suhu Laut */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Thermometer size={14} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Suhu Permukaan
            </span>
          </div>
          <p className="text-lg font-bold text-slate-700">
            {data?.suhu_laut || "0"}°C
          </p>
        </div>
      </div>

      {/* Arah Angin / Kompas */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Compass size={16} className="text-blue-500" />
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Arah Angin: {data?.arah_angin || "0"}° (Timur Laut)
          </p>
        </div>
        <p className="text-[9px] text-slate-400 font-medium italic border-t border-slate-200 pt-2 mt-1">
          * Data real-time berdasarkan pemodelan maritim GFS NTT
        </p>
      </div>
    </div>
  );
};
