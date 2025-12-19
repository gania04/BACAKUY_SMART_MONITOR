
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { Buku } from '../types';
import { KATEGORI_BUKU } from '../constants';

interface Props {
  data: Buku[];
}

const Analytics: React.FC<Props> = ({ data }) => {
  if (data.length === 0) return (
    <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300">
      Mulai tambahkan data untuk melihat visualisasi analytics.
    </div>
  );

  // Data for Pie Chart (Status Distribution)
  const statusData = [
    { name: 'Laris', value: data.filter(b => b.status_penjualan === 'Laris').length },
    { name: 'Biasa', value: data.filter(b => b.status_penjualan === 'Biasa').length },
  ];
  const COLORS = ['#10b981', '#94a3b8'];

  // Data for Bar Chart (Kategori Count)
  const categoryData = KATEGORI_BUKU.map(k => ({
    name: k,
    total: data.filter(b => b.kategori === k).length,
    laris: data.filter(b => b.kategori === k && b.status_penjualan === 'Laris').length
  })).filter(c => c.total > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Penjualan</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Penjualan per Kategori</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Legend />
              <Bar dataKey="total" name="Total Buku" fill="#818cf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laris" name="Laris" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
