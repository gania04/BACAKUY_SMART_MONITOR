
import React, { useState, useEffect } from 'react';
import { TabType, Buku } from './types';
import { fetchBooks, seedDatabaseIfEmpty, checkConnection } from './lib/supabase';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import PredictionForm from './components/PredictionForm';
import BookTable from './components/BookTable';
import Analytics from './components/Analytics';
import DescriptiveAnalysis from './components/DescriptiveAnalysis';
import EvaluasiModel from './components/EvaluasiModel';
import Instructions from './components/Instructions';
import { Wifi, WifiOff, RefreshCw, Database, AlertCircle, ShieldCheck, CheckCircle2, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [books, setBooks] = useState<Buku[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloud, setIsCloud] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadData = async (isManual = false) => {
    setLoading(true);
    if (isManual) {
      setNetworkError(null);
      await new Promise(r => setTimeout(r, 800));
    }
    
    try {
      const { data, isCloud: cloudStatus, errorDetail } = await fetchBooks();
      setBooks(data);
      
      if (cloudStatus && !isCloud && isManual) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      }
      
      setIsCloud(cloudStatus);
      if (errorDetail) setNetworkError(errorDetail);
      
      if (cloudStatus) seedDatabaseIfEmpty();
    } catch (err) {
      console.warn('Gagal memuat data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReconnect = () => {
    loadData(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Connection Status Banner */}
        <div className={`px-12 py-2 text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-4 transition-all border-b ${
          isCloud 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-amber-50 text-amber-700 border-amber-100'
        }`}>
          <div className="flex items-center gap-2">
            {isCloud ? <Wifi size={12} className="animate-pulse" /> : <WifiOff size={12} />}
            <span>JARINGAN: {isCloud ? 'TERHUBUNG KE BACAKUY CLOUD' : 'TERPUTUS (LOKAL)'}</span>
          </div>
          <span className="opacity-20">|</span>
          <div className="flex items-center gap-2">
            <Globe size={12} />
            <span>PROJECT: oftpulsqxjhhtfukmmtr</span>
          </div>
          <button 
            onClick={handleReconnect}
            disabled={loading}
            className={`ml-4 px-3 py-1 bg-white border rounded-lg transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <RefreshCw size={10} className={loading ? "animate-spin" : ""} />
            {loading ? 'MENGECEK...' : 'RE-SYNC DATABASE'}
          </button>
        </div>

        {/* Success Feedback */}
        {showSuccess && (
          <div className="mx-12 mt-6 bg-emerald-600 text-white p-5 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-300 shadow-2xl shadow-emerald-200">
            <div className="bg-white/20 p-2 rounded-full">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest">Koneksi Supabase Berhasil!</p>
              <p className="text-[10px] opacity-80 font-bold">Koneksi bacakuy smart monitor telah dipulihkan. Seluruh data checkout disinkronkan.</p>
            </div>
          </div>
        )}

        {/* Detailed Network Warning */}
        {networkError && !isCloud && !showSuccess && (
          <div className="mx-12 mt-6 bg-white border-2 border-rose-100 p-6 rounded-[2.5rem] shadow-xl shadow-rose-100/30 flex items-start gap-5 animate-in slide-in-from-top-4">
            <div className="p-4 bg-rose-50 rounded-3xl text-rose-500 shrink-0">
              <AlertCircle size={32} />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-black text-rose-900 uppercase tracking-tighter">Akses Database Ditolak</h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {networkError}
              </p>
              <div className="mt-5 flex items-center gap-4">
                <button onClick={handleReconnect} className="px-5 py-2.5 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
                  Ulangi Tes Koneksi
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 px-6 md:px-12 py-8 max-w-[1600px] w-full mx-auto">
          {loading && books.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Menghubungkan ke Bacakuy Cloud...</p>
                <p className="text-slate-300 text-[9px] font-bold mt-1 tracking-wider uppercase">Project ID: oftpulsqxjhhtfukmmtr</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'dashboard' && (
                <div className="space-y-10">
                  <MetricCards data={books} />
                  <Analytics data={books} />
                </div>
              )}
              {activeTab === 'prediksi' && <PredictionForm trainingData={books} onSuccess={() => loadData(false)} />}
              {activeTab === 'katalog' && <BookTable books={books} />}
              {activeTab === 'statistik' && <DescriptiveAnalysis data={books} />}
              {activeTab === 'evaluasi' && <EvaluasiModel data={books} />}
              {activeTab === 'setup' && <Instructions />}
            </div>
          )}
        </main>

        <footer className="py-8 text-center border-t border-slate-100 mt-auto">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
            Bacakuy Smart Monitor • {isCloud ? 'CLOUD ACTIVE' : 'LOCAL MODE'}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
