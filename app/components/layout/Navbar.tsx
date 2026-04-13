import { useEffect, useState } from "react"; 
import { createPortal } from "react-dom";
import { Bell, Code, Zap, Map, Database, Fish } from "lucide-react";
import { EmergencyModal } from "../modal/EmergencyModal"; 
import { DeveloperModal } from "../modal/DeveloperModal";

export const Navbar = ({ activeMenu, setActiveMenu }: { activeMenu: string, setActiveMenu: (m: string) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDevOpen, setIsDevOpen] = useState(false);

  const handleMenuClick = (id: string) => {
    setActiveMenu(id);
    if (id === "arsip") {
      setTimeout(() => {
        const element = document.getElementById("arsip-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const menuItems = [
    { name: "Pemantauan", id: "gempa", icon: Map },
    { name: "Zona Ikan", id: "ikan", icon: Fish },
    { name: "Arsip", id: "arsip", icon: Database }
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

if (!mounted) return null;

return createPortal(
    <>
      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 left-0 right-0 z-[99999] flex items-center justify-between px-3 md:px-8 py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-3">
          <h1 className="text-base md:text-xl font-black tracking-tighter text-slate-900 uppercase leading-none">
            EWS <span className="text-indigo-600">Flotim</span>
          </h1>
          
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-slate-100 border border-slate-200 rounded-full">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">Live System</span>
          </div>
        </div>

        {/* Desktop Menu (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)} 
              className={`text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer transition-colors relative group ${
                activeMenu === item.id ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all ${activeMenu === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 md:gap-4">
          <button 
            onClick={() => setIsDevOpen(true)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Code size={18} />
          </button>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer bg-red-900 text-white rounded-full md:rounded-lg shadow-lg hover:bg-red-700 transition-all group"
          >
            <Zap size={14} className="fill-yellow-400 text-yellow-400 shrink-0" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest whitespace-nowrap">
              Protokol Darurat
            </span>
          </button>
        </div>
      </nav>

      {/* --- BOTTOM TAB BAR (Mobile Only) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0d1117]/80 backdrop-blur-xl border-t border-slate-700 px-6 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? "text-indigo-700 scale-105" : "text-slate-200"
                }`}
              >
                <div className={`p-1.5 rounded-xl ${isActive ? "bg-indigo-50" : ""}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter">
                  {item.name} 
                </span>
              </button>
            );
          })}
        </div>
      </div>,

      <DeveloperModal isOpen={isDevOpen} onClose={() => setIsDevOpen(false)} />
      <EmergencyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>,
    document.body
  );
};