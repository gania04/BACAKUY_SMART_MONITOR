
import React from 'react';
import { Buku } from '../types';
import { calculateBasicStats, calculatePearson, detectOutliers } from '../lib/statistics';
import { motion } from 'framer-motion';
import { Info, AlertTriangle, TrendingUp, BarChart, Hash, Scale } from 'lucide-react';

interface Props {
  data: Buku[];
}

const DescriptiveAnalysis: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return null;

  const hargaData = data.map(d => d.harga);
  const halamanData = data.map(d => d.halaman);
  const statsHarga = calculateBasicStats(hargaData);
  const statsHalaman = calculateBasicStats(halamanData);
  const pearson = calculatePearson(hargaData, halamanData);
  const outliersHarga = detectOutliers(hargaData);

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-20"
    >
      {/* SECTION 1: CENTRAL TENDENCY & DISPERSION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <AnalysisCard 
          title="Variable: Harga Buku" 
          icon={Hash} 
          color="indigo" 
          stats={statsHarga} 
          formatter={formatIDR} 
        />
        <AnalysisCard 
          title="Variable: Jumlah Halaman" 
          icon={BarChart} 
          color="violet" 
          stats={statsHalaman} 
          formatter={(v) => `${Math.round(v)} hlm`} 
        />
      </div>

      {/* SECTION 2: CORRELATION & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Scale className="text-indigo-400" />
            <h3 className="text-xl font-bold font-jakarta">Pearson Correlation Matrix</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6 w-full">
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Harga vs Halaman</span>
                  <span className="text-2xl font-black text-indigo-400">{pearson.toFixed(3)}</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.abs(pearson) * 100}%` }}
                    className={`h-full ${pearson > 0 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                  />
                </div>
              </div>
              
              <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                <Info size={14} className="inline mr-2" />
                <strong>Interpretasi:</strong> {
                  Math.abs(pearson) > 0.7 
                    ? 'Korelasi sangat kuat. Ukuran fisik buku (halaman) menentukan harga secara signifikan.' 
                    : 'Korelasi moderat. Faktor lain seperti jenis kertas atau populeritas penulis mungkin mempengaruhi harga.'
                }
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <MetricMini label="Skewness" value={statsHarga.skewness.toFixed(2)} />
              <MetricMini label="Kurtosis" value={statsHarga.kurtosis.toFixed(2)} />
              <MetricMini label="IQR" value={formatIDR(statsHarga.iqr)} />
              <MetricMini label="Variance" value={(statsHarga.variance / 1000000).toFixed(0) + 'jt'} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl overflow-hidden relative">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-amber-500" />
            <h3 className="text-xl font-bold font-jakarta">Outlier Detection</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Mendeteksi anomali harga menggunakan metode <strong>Interquartile Range (IQR)</strong>.
          </p>
          
          <div className="space-y-3">
            {outliersHarga.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">
                Tidak ada anomali harga ditemukan.
              </div>
            ) : (
              outliersHarga.map((o, idx) => (
                <div key={idx} className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-700">{formatIDR(o)}</span>
                  <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-black">ANOMALI</span>
                </div>
              ))
            )}
          </div>

          <div className="absolute bottom-0 right-0 p-4 opacity-5 text-indigo-600">
            <AlertTriangle size={120} strokeWidth={1} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AnalysisCard = ({ title, icon: Icon, color, stats, formatter }: any) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
    <div className="flex items-center gap-4 mb-8">
      <div className={`w-12 h-12 rounded-2xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold font-jakarta text-slate-800">{title}</h3>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      <StatBox label="Mean (Rata-rata)" value={formatter(stats.mean)} color={color} />
      <StatBox label="Median (Tengah)" value={formatter(stats.median)} color={color} />
      <StatBox label="Modus (Populer)" value={formatter(stats.mode[0])} color={color} />
      <StatBox label="Std. Deviasi" value={formatter(stats.stdDev)} color={color} />
      <StatBox label="Rentang Min" value={formatter(stats.min)} color={color} />
      <StatBox label="Rentang Max" value={formatter(stats.max)} color={color} />
    </div>
  </div>
);

const StatBox = ({ label, value, color }: any) => (
  <div className="p-4 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all border border-slate-100">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-sm font-black text-slate-800`}>{value}</p>
  </div>
);

const MetricMini = ({ label, value }: any) => (
  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-black text-white">{value}</p>
  </div>
);

export default DescriptiveAnalysis;
