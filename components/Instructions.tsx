
import React from 'react';

const Instructions: React.FC = () => {
  const sqlScript = `
-- 1. Buat tabel di Supabase (Project: bacakuy smart monitor)
-- Akses SQL Editor di https://oftpulsqxjhhtfukmmtr.supabase.co

CREATE TABLE penjualan_buku (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(150),
    kategori VARCHAR(50),
    harga INTEGER,
    penulis_populer VARCHAR(10),
    halaman INTEGER,
    jenis_cover VARCHAR(20),
    rating DECIMAL,
    stok INTEGER,
    diskon INTEGER,
    status_penjualan VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert data awal untuk testing
INSERT INTO penjualan_buku (judul, kategori, harga, penulis_populer, halaman, jenis_cover, rating, stok, diskon, status_penjualan) VALUES
('Laskar Pelangi', 'Fiksi', 95000, 'Ya', 529, 'Softcover', 4.8, 100, 10, 'Laris'),
('Bumi Manusia', 'Fiksi', 125000, 'Ya', 535, 'Hardcover', 4.9, 50, 0, 'Laris'),
('Atomic Habits Indo', 'Self-Help', 110000, 'Ya', 320, 'Softcover', 4.9, 300, 20, 'Laris'),
('Dongeng Si Kancil', 'Anak-anak', 45000, 'Tidak', 50, 'Softcover', 4.0, 500, 25, 'Laris'),
('Python Dasar', 'Teknologi', 180000, 'Tidak', 350, 'Softcover', 3.5, 40, 0, 'Biasa'),
('Investasi Saham', 'Bisnis', 200000, 'Ya', 220, 'Hardcover', 4.6, 60, 10, 'Laris');
`.trim();

  return (
    <div className="space-y-8 pb-12">
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 font-jakarta">🚀 Setup Bacakuy Smart Monitor</h2>
        <div className="space-y-4 text-slate-600">
          <p>Konfigurasi Database untuk Project <strong>oftpulsqxjhhtfukmmtr</strong>:</p>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Buka Dashboard Supabase Anda.</li>
            <li>Pilih menu <strong>SQL Editor</strong> di bilah sisi kiri.</li>
            <li>Klik <strong>New Query</strong>.</li>
            <li>Salin dan tempel kode SQL di bawah ini.</li>
            <li>Klik tombol <strong>Run</strong> untuk membuat tabel <strong>penjualan_buku</strong>.</li>
            <li>Refresh aplikasi ini untuk menyinkronkan data.</li>
          </ol>
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 font-jakarta">💾 SQL Script (Table: penjualan_buku)</h2>
        <pre className="bg-slate-900 text-slate-100 p-6 rounded-xl text-xs overflow-x-auto leading-relaxed">
          <code>{sqlScript}</code>
        </pre>
      </section>
    </div>
  );
};

export default Instructions;
