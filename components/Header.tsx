
import React from 'react';
import { TabType } from '../types';
import { Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<string, { main: string, sub: string }> = {
    dashboard: { main: 'Overview Performa', sub: 'Ringkasan statistik real-time katalog anda' },
    prediksi: { main: 'Mesin Klasifikasi AI', sub: 'Input variabel buku untuk prediksi status penjualan' },
    katalog: { main: 'Basis Data Produk', sub: 'Daftar lengkap riwayat judul buku yang tersimpan' },
    statistik: { main: 'Analisis Deskriptif', sub: 'Wawasan mendalam statistik variabel numerik' },
    evaluasi: { main: 'Model Evaluation', sub: 'Pengukuran akurasi dan validitas algoritma AI' },
    setup: { main: 'Setup & SQL Script', sub: 'Konfigurasi database dan dokumentasi proyek' }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="animate-in slide-in-from-left duration-500">
        <h1 className="text-2xl font-jakarta font-black text-slate-900 tracking-tight leading-none uppercase">
          {current.main}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Engine Active</p>
          </div>
          <span className="text-slate-200">|</span>
          <p className="text-xs font-semibold text-slate-500">{current.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto animate-in slide-in-from-right duration-500">
        <div className="relative group flex-1 md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Cari katalog..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-500 relative">
            <Bell size={18} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>
          
          <div className="h-10 w-px bg-slate-100 mx-2 hidden sm:block"></div>
          
          <button className="flex items-center gap-2 pl-2 pr-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] font-black text-slate-900 leading-none">Admin Editor</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Settings</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
