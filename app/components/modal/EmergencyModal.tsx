import { X, Phone, ShieldAlert, Map, Radio } from "lucide-react";
import { createPortal } from "react-dom";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal = ({ isOpen, onClose }: EmergencyModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl max-h-[95vh] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header Red Alert - Menyesuaikan padding di mobile */}
        <div className="bg-red-900 px-5 py-5 sm:px-8 sm:py-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert size={24} className="animate-pulse shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none">Protokol Darurat</h2>
              <p className="text-[10px] sm:text-xs font-medium text-red-100 uppercase tracking-widest mt-1">Kabupaten Flores Timur</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 sm:p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Section 1: Gempa Bumi */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-black text-slate-800 text-xs sm:text-sm uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                Saat Gempa Bumi
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex gap-2"><span>1.</span> <span><b className="text-slate-900">Drop!</b> Berlindung di bawah meja.</span></li>
                <li className="flex gap-2"><span>2.</span> <span><b className="text-slate-900">Cover!</b> Lindungi kepala dan leher.</span></li>
                <li className="flex gap-2"><span>3.</span> <span><b className="text-slate-900">Hold on!</b> Bertahan hingga guncangan berhenti.</span></li>
                <li className="flex gap-2"><span>4.</span> <span>Hindari kaca dan benda yang mudah jatuh.</span></li>
              </ul>
            </div>

            {/* Section 2: Tsunami */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-black text-slate-800 text-xs sm:text-sm uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Peringatan Tsunami
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex gap-2"><span>1.</span> <span>Segera menjauh dari garis pantai.</span></li>
                <li className="flex gap-2"><span>2.</span> <span>Cari tempat ketinggian minimal 20m.</span></li>
                <li className="flex gap-2"><span>3.</span> <span>Gunakan jalur evakuasi yang tersedia.</span></li>
                <li className="flex gap-2"><span>4.</span> <span>Tetap di tempat hingga status dicabut.</span></li>
              </ul>
            </div>

            {/* Section 3: Kontak Penting */}
            <div className="md:col-span-2 bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100">
              <h3 className="font-black text-slate-800 text-xs sm:text-sm uppercase mb-4 flex items-center gap-2 justify-center">
                <Phone size={14} className="text-indigo-600" />
                Kontak Darurat Flotim
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "BPBD Flotim", tel: "0811-0401-4640", link: "tel:081104014640" },
                  { label: "Basarnas", tel: "115", link: "tel:115" },
                  { label: "Ambulans / RS", tel: "118", link: "tel:118" },
                  { label: "Polres Flotim", tel: "110", link: "tel:110" },
                ].map((contact, idx) => (
                  <a 
                    key={idx}
                    href={contact.link}
                    className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-indigo-300 transition-colors active:scale-95"
                  >
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{contact.label}</span>
                    <span className="text-xs sm:text-sm font-black text-indigo-600">{contact.tel}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fixed */}
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100 shrink-0">
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">
            Pantau informasi resmi dari BMKG dan BPBD setempat.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};