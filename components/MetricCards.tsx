
import React, { useState, useEffect } from 'react';
import { Buku } from '../types';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, Package, Trophy } from 'lucide-react';

interface Props {
  data: Buku[];
}

const CountUp = ({ value, duration = 1.5, prefix = '', suffix = '' }: { value: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end) * 5;
    let timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / 20));
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [value, duration]);

  const formatted = prefix === 'Rp ' 
    ? new Intl.NumberFormat('id-ID').format(count)
    : count;

  return <span>{prefix}{formatted}{suffix}</span>;
};

const MetricCards: React.FC<Props> = ({ data }) => {
  const total = data.length;
  const laris = data.filter(b => b.status_penjualan === 'Laris').length;
  const percLaris = total > 0 ? (laris / total) * 100 : 0;
  const avgHarga = total > 0 ? (data.reduce((acc, b) => acc + b.harga, 0) / total) : 0;
  const totalStok = data.reduce((acc, b) => acc + b.stok, 0);

  const cards = [
    { 
      title: 'Total Judul Buku', 
      value: total, 
      icon: Package, 
      color: 'indigo', 
      trend: '+12% MoM',
      positive: true
    },
    { 
      title: 'Best-Seller Rate', 
      value: Math.round(percLaris), 
      suffix: '%',
      icon: Trophy, 
      color: 'emerald', 
      trend: 'Top Performer',
      positive: true
    },
    { 
      title: 'Estimasi Nilai Stok', 
      value: Math.round((avgHarga * totalStok) / 1000000), 
      prefix: 'Rp ',
      suffix: 'jt',
      icon: DollarSign, 
      color: 'amber', 
      trend: '+5.4% YoY',
      positive: true
    },
    { 
      title: 'Kapasitas Gudang', 
      value: totalStok, 
      icon: Users, 
      color: 'violet', 
      trend: '82% Utilitas',
      positive: false
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((c, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group relative overflow-hidden bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="relative z-10">
            <div className={`w-12 h-12 rounded-2xl bg-${c.color}-50 flex items-center justify-center text-${c.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
              <c.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.title}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
              <CountUp value={c.value} prefix={c.prefix} suffix={c.suffix} />
            </h3>
            <div className="flex items-center gap-1 mt-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                c.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {c.positive && <TrendingUp size={10} />}
                {c.trend}
              </span>
            </div>
          </div>
          
          <div className={`absolute bottom-0 right-0 p-4 opacity-5 text-${c.color}-600`}>
            <c.icon size={100} strokeWidth={1} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricCards;
