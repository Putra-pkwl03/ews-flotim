import { Heart, Mail, Globe, Map as MapIcon, Activity, Database, Zap } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#151f36] pt-20 pb-10 px-8 mt-auto relative overflow-hidden border-t border-slate-800">
      {/* Background Decor: Map Grid & Glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
          
          {/* Section 1: Branding & Geospatial Focus */}
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-700 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white">
                  <MapIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
                    EWS <span className="text-indigo-500">Flotim</span>
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Geo-Analysis Engine</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono bg-slate-800/50 border border-slate-700 text-indigo-300 px-2.5 py-1 rounded-md">
                  LAT: 8.3478° S
                </span>
                <span className="text-[10px] font-mono bg-slate-800/50 border border-slate-700 text-indigo-300 px-2.5 py-1 rounded-md">
                  LNG: 122.9833° E
                </span>
              </div>
            </div>

            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
              Platform pemantauan terintegrasi untuk mitigasi bencana dan pemetaan sumber daya maritim Flores Timur menggunakan kecerdasan artifisial.
            </p>
            
            {/* Social Media Row with Brand Colors */}
            <div className="flex items-center gap-4">
              <a href="https://www.linkedin.com/in/ma-ruf-hariam-1b894b267/" target="_blank" 
                 className="group p-2.5 bg-slate-800/50 border border-slate-700 hover:border-[#0077b5] rounded-xl transition-all hover:shadow-[0_0_15px_rgba(0,119,181,0.3)]">
                <svg className="w-5 h-5 fill-slate-400 group-hover:fill-[#0077b5] transition-colors" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.instagram.com/putra_pkwl03/" target="_blank" 
                 className="group p-2.5 bg-slate-800/50 border border-slate-700 hover:border-[#e4405f] rounded-xl transition-all hover:shadow-[0_0_15px_rgba(228,64,95,0.3)]">
                <svg className="w-5 h-5 fill-slate-400 group-hover:fill-[#e4405f] transition-colors" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849s-.011 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.267-.07-1.646-.07-4.849s.012-3.584.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.617 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.339-.2 6.78-2.617 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.338-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://my-portfolio-putra.vercel.app/" target="_blank" 
                 className="group p-2.5 bg-slate-800/50 border border-slate-700 hover:border-emerald-500 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Globe size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
              </a>
              <a href="mailto:putrapongkowulu@gmail.com" 
                 className="group p-2.5 bg-slate-800/50 border border-slate-700 hover:border-red-500 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <Mail size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* Section 2: Technical Pipeline */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-indigo-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Data Integration
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: 'StormGlass', detail: 'Weather ML', color: 'bg-blue-500' },
                { name: 'Gemini AI', detail: 'LLM Analysis', color: 'bg-indigo-500' },
                { name: 'HuggingFace', detail: 'Custom Models', color: 'bg-yellow-500' },
                { name: 'OpenWeather', detail: 'Real-time API', color: 'bg-orange-500' }
              ].map((api) => (
                <div key={api.name} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl group hover:bg-slate-800/60 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-4 ${api.color} rounded-full`}></div>
                    <span className="text-xs font-bold text-slate-300 uppercase italic">{api.name}</span>
                  </div>
                  <span className="text-[9px] font-medium text-slate-500 uppercase">{api.detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: System Status */}
          <div className="md:col-span-3 space-y-6 md:text-right text-left">
            <div className="flex items-center gap-2 md:justify-end">
              <Activity size={16} className="text-emerald-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Network Pulse
              </span>
            </div>
            
            <div className="inline-flex flex-col gap-4 w-full md:w-auto">
              <div className="p-5 bg-slate-800/40 border border-slate-700/50 rounded-2xl space-y-4 backdrop-blur-sm">
                {['Engine', 'Sync', 'Uptime'].map((status) => (
                  <div key={status} className="flex items-center gap-4 justify-between md:justify-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{status}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-emerald-400">99.9%</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Metadata */}
        <div className="mt-20 pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              © {currentYear} Ma'ruf Hariam • Version 4.0.2-Stable
            </p>
            <div className="hidden md:block w-px h-4 bg-slate-800"></div>
            <a 
              href="https://saweria.co/putrapkwl03" 
              target="_blank" 
              className="text-[10px] font-black text-orange-400 hover:text-orange-300 uppercase tracking-[0.2em] flex items-center gap-2 transition-all group"
            >
              <Heart size={12} className="group-hover:scale-125 transition-transform fill-current" />
              Support System
            </a>
          </div>
          
          <div className="flex items-center gap-3">
            <Database size={12} className="text-slate-600" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em]">
              Data Privacy Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};