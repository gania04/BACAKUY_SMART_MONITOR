
import React, { useState } from 'react';
import { TabType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Search, 
  Library, 
  BarChart3, 
  TrendingUp, 
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PieChart
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prediksi', label: 'Prediksi Jual', icon: Search },
    { id: 'katalog', label: 'Katalog Buku', icon: Library },
    { id: 'statistik', label: 'Analisis Dasar', icon: BarChart3 },
    { id: 'evaluasi', label: 'Evaluasi Model', icon: PieChart },
    { id: 'setup', label: 'Setup System', icon: Settings },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 88 : 280 }}
      className="hidden lg:flex flex-col bg-slate-900 text-slate-400 p-4 fixed h-full z-50 transition-all border-r border-slate-800 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-10 px-2 mt-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[48px] h-[48px] bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <BookOpen size={24} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="whitespace-nowrap"
              >
                <h2 className="text-white font-jakarta font-black tracking-tight leading-none text-xl">BOOKSMART</h2>
                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Premium Analytics</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-4 mb-4"
            >
              Main Navigation
            </motion.p>
          )}
        </AnimatePresence>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as TabType)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all group relative ${
              activeTab === item.id 
                ? 'sidebar-active translate-x-1' 
                : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} strokeWidth={2.5} className={activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
            {!isCollapsed && <span className="text-sm">{item.label}</span>}
            
            {isCollapsed && (
              <div className="absolute left-20 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800/50 space-y-4">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-3 bg-slate-800/30 hover:bg-slate-800/60 rounded-xl transition-colors border border-slate-800/50"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        
        <div className={`flex items-center gap-3 p-3 bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="min-w-[32px] h-[32px] rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 border-2 border-indigo-400 flex items-center justify-center text-[10px] font-black text-white">
            AD
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-white truncate">Administrator</p>
              <p className="text-[8px] text-slate-500 font-medium uppercase">Premium Access</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
