
import React from 'react';
import { Buku } from '../types';

interface Props {
  data: Buku[];
}

const StatistikDeskriptif: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return (
    <div className="bg-white p-12 text-center rounded-[2.5rem] border border-dashed border-slate-300 text-slate-400 font-medium">
      Silakan tambahkan data terlebih dahulu untuk melakukan analisis statistik.
    </div>
  );

  const calculateStats = (numbers: number[]) => {
    const n = numbers.length;
    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const median = n % 2 === 0 ? (sorted[n/2-1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    
    const counts: Record<number, number> = {};
    numbers.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const mode = Number(Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0]);
    
    const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    return { mean, median, mode, stdDev, min: sorted[0], max: sorted[n-1] };
  };

  const hargaStats = calculateStats(data.map(d => d.harga));
  const halamanStats = calculateStats(data.map(d => d.halaman));

  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Simple Correlation
  const corr = (x: number[], y: number[]) => {
    const n = x.length;
    const muX = x.reduce((a, b) => a + b, 0) / n;
    const muY = y.reduce((a, b) => a + b, 0) / n;
    const num = x.reduce((a, xi, i) => a + (xi - muX) * (y[i] - muY), 0);
    const den = Math.sqrt(x.reduce((a, xi) => a + Math.pow(xi - muX, 2), 0) * 
                          y.reduce((a, yi) => a + Math.pow(yi - muY, 2), 0));
    return den === 0 ? 0 : num / den;
  };

  const correlations = [
    { label: 'Harga vs Halaman', val: corr(data.map(d => d.harga), data.map(d => d.halaman)) },
    { label: 'Rating vs Diskon', val: corr(data.map(d => d.rating), data.map(d => d.diskon)) },
    { label: 'Stok vs Harga', val: corr(data.map(d => d.stok), data.map(d => d.harga)) }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Harga */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl">💰</div>
            <h3 className="text-xl font-extrabold text-slate-800">Statistik Harga</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Rata-rata (Mean)" value={formatIDR(hargaStats.mean)} />
            <StatItem label="Nilai Tengah (Median)" value={formatIDR(hargaStats.median)} />
            <StatItem label="Paling Sering (Mode)" value={formatIDR(hargaStats.mode)} />
            <StatItem label="Deviasi Standar" value={formatIDR(hargaStats.stdDev)} />
            <StatItem label="Harga Terendah" value={formatIDR(hargaStats.min)} />
            <StatItem label="Harga Tertinggi" value={formatIDR(hargaStats.max)} />
          </div>
        </div>

        {/* Card Halaman */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">📖</div>
            <h3 className="text-xl font-extrabold text-slate-800">Statistik Halaman</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatItem label="Rata-rata (Mean)" value={`${Math.round(halamanStats.mean)} hlm`} />
            <StatItem label="Nilai Tengah (Median)" value={`${halamanStats.median} hlm`} />
            <StatItem label="Paling Sering (Mode)" value={`${halamanStats.mode} hlm`} />
            <StatItem label="Deviasi Standar" value={halamanStats.stdDev.toFixed(2)} />
            <StatItem label="Tebal Minimum" value={`${halamanStats.min} hlm`} />
            <StatItem label="Tebal Maksimum" value={`${halamanStats.max} hlm`} />
          </div>
        </div>
      </div>

      {/* Heatmap/Correlation Table */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-900/20">
        <h3 className="text-2xl font-black mb-8">Matrix Hubungan Variabel (Korelasi)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {correlations.map((c, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{c.label}</p>
              <p className="text-4xl font-black text-indigo-400">{c.val.toFixed(3)}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${Math.abs(c.val) > 0.6 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <p className="text-[10px] text-slate-300 font-medium">
                  {Math.abs(c.val) > 0.7 ? 'Korelasi Sangat Kuat' : Math.abs(c.val) > 0.4 ? 'Korelasi Moderat' : 'Hubungan Lemah'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string | number }) => (
  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-slate-100 transition-colors">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-base font-extrabold text-slate-800">{value}</p>
  </div>
);

export default StatistikDeskriptif;
