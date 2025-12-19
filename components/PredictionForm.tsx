
import React, { useState } from 'react';
import { KATEGORI_BUKU, INITIAL_FORM_STATE } from '../constants';
import { Buku, StatusPenjualan } from '../types';
import { DecisionTree } from '../lib/decisionTree';
import { insertBook } from '../lib/supabase';
import { Save, Cpu, CheckCircle2 } from 'lucide-react';

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
    {children}
  </label>
);

interface Props {
  trainingData: Buku[];
  onSuccess: () => void;
}

const PredictionForm: React.FC<Props> = ({ trainingData, onSuccess }) => {
  const [formData, setFormData] = useState<Buku>(INITIAL_FORM_STATE as any);
  const [result, setResult] = useState<StatusPenjualan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'cloud' | 'local' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSaveStatus(null);
    
    try {
      // 1. Jalankan Decision Tree (Local Inference)
      const dt = new DecisionTree();
      dt.train(trainingData);
      const prediction = dt.predict(formData);
      
      // 2. Simpan ke database (dengan fallback otomatis)
      const { success, isCloud } = await insertBook({ 
        ...formData, 
        status_penjualan: prediction 
      });
      
      if (success) {
        setResult(prediction);
        setSaveStatus(isCloud ? 'cloud' : 'local');
        onSuccess();
      }
    } catch (err) {
      alert("Gagal memproses prediksi. Periksa konsol browser.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 md:p-14">
        <div className="mb-12 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Form Analisis Produk</h2>
            <p className="text-slate-500 mt-2 font-medium">Input spesifikasi untuk klasifikasi performa pasar otomatis.</p>
          </div>
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
            <Cpu size={24} />
          </div>
        </div>
        
        <form onSubmit={handlePredict} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
          <div className="md:col-span-2">
            <FormLabel>Judul Buku</FormLabel>
            <input 
              required name="judul" value={formData.judul} onChange={handleChange}
              className="form-input w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all font-semibold"
              placeholder="Contoh: Belajar Data Mining Dasar"
            />
          </div>

          <div>
            <FormLabel>Kategori Buku</FormLabel>
            <select name="kategori" value={formData.kategori} onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold">
              {KATEGORI_BUKU.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div>
            <FormLabel>Harga Jual (IDR)</FormLabel>
            <input 
              type="number" required name="harga" value={formData.harga} onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <FormLabel>Jenis Cover</FormLabel>
            <select name="jenis_cover" value={formData.jenis_cover} onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold">
              <option value="Softcover">Softcover</option>
              <option value="Hardcover">Hardcover</option>
            </select>
          </div>

          <div>
            <FormLabel>Penulis Populer?</FormLabel>
            <select name="penulis_populer" value={formData.penulis_populer} onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold">
              <option value="Ya">Ya (Artis/Tokoh Publik)</option>
              <option value="Tidak">Tidak (Baru/Akademisi)</option>
            </select>
          </div>

          <div>
            <FormLabel>Rating Editor (1-5)</FormLabel>
            <input 
              type="number" step="0.1" max="5" min="1" required name="rating" value={formData.rating} onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold"
            />
          </div>

          <div>
            <FormLabel>Diskon (%)</FormLabel>
            <input 
              type="number" required name="diskon" value={formData.diskon} onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold"
            />
          </div>

          <div className="md:col-span-2 pt-8">
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-5 rounded-3xl shadow-2xl transition-all flex items-center justify-center gap-4 text-lg active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  MEMPROSES...
                </>
              ) : (
                <><Save size={20} /> ANALISIS & SIMPAN DATA</>
              )}
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className={`p-10 rounded-[3rem] border-4 animate-in zoom-in duration-500 flex flex-col md:flex-row items-center gap-10 ${
          result === 'Laris' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg ${
             result === 'Laris' ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
          }`}>
            {result === 'Laris' ? '🏆' : '📄'}
          </div>
          <div className="text-center md:text-left flex-1">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-1">Hasil Klasifikasi AI</h3>
            <p className="text-5xl font-black mb-3 tracking-tighter">Prediksi: {result}</p>
            <div className="flex items-center gap-2 text-xs font-bold opacity-70">
              <CheckCircle2 size={14} />
              <span>Status: {saveStatus === 'cloud' ? 'Tersimpan di Cloud Database' : 'Tersimpan di Browser (Mode Offline)'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
