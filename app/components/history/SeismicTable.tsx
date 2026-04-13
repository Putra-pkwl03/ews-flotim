import { useState } from "react";
import { Badge } from "../ui/Badge";
import { ChevronDown, ChevronUp, MapPin, Activity, Clock } from "lucide-react";

export const SeismicTable = ({ history }: { history: any[] }) => {
  const [showAll, setShowAll] = useState(false);
  const initialDisplayCount = 5;
  const displayData = showAll ? history : history?.slice(0, initialDisplayCount);

  return (
    <div id="arsip-section" className="mt-8 md:mt-12 px-4 md:px-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">
          Riwayat Aktivitas Seismik
        </h3>
        
        {history?.length > initialDisplayCount && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-indigo-600 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:text-indigo-800 transition-all px-3 py-1.5 bg-indigo-50 md:bg-transparent hover:bg-indigo-50 rounded-full md:rounded-lg"
          >
            {showAll ? (
              <>Sembunyikan <ChevronUp size={14} /></>
            ) : (
              <>Lihat Semua ({history.length}) <ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>

      {/* --- MOBILE VIEW (Card Layout) --- */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {displayData?.map((item, idx) => (
          <div key={item.id || idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-2 max-w-[70%]">
                <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <span className="text-sm font-bold text-slate-700 leading-tight">{item.wilayah}</span>
              </div>
              <Badge variant={parseFloat(item.magnitude) > 5 ? "red" : "yellow"}>
                {item.magnitude} SR
              </Badge>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5">
                <Activity size={14} className="text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">{item.kedalaman}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">{item.tanggal_jam}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW (Classic Table) --- */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Wilayah</th>
                <th className="px-6 py-4">Magnitudo</th>
                <th className="px-6 py-4">Kedalaman</th>
                <th className="px-6 py-4">Waktu Lokal</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayData?.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.wilayah}</td>
                  <td className="px-6 py-4">
                    <Badge variant={parseFloat(item.magnitude) > 5 ? "red" : "yellow"}>
                      {item.magnitude} SR
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{item.kedalaman}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">{item.tanggal_jam}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 rounded">
                      Tercatat
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {(!history || history.length === 0) && (
        <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-sm italic">
            Belum ada data riwayat yang tersedia untuk wilayah ini.
          </p>
        </div>
      )}
      
      {/* Helper Text */}
      {!showAll && history?.length > initialDisplayCount && (
        <p className="mt-4 text-center text-[9px] md:text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
          Menampilkan {initialDisplayCount} data terbaru dari total {history.length} kejadian
        </p>
      )}
    </div>
  );
};