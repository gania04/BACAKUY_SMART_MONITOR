
import React from 'react';
import { Buku } from '../types';

interface Props {
  books: Buku[];
}

const BookTable: React.FC<Props> = ({ books }) => {
  const formatIDR = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Katalog & Riwayat Data</h2>
        <span className="text-sm text-slate-500">{books.length} Buku Terdaftar</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Judul</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Belum ada data tersedia.</td>
              </tr>
            ) : (
              books.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{b.judul}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded text-xs">{b.kategori}</span></td>
                  <td className="px-6 py-4">{formatIDR(b.harga)}</td>
                  <td className="px-6 py-4 font-mono">⭐ {b.rating}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      b.status_penjualan === 'Laris' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {b.status_penjualan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {b.created_at ? new Date(b.created_at).toLocaleDateString('id-ID') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;
