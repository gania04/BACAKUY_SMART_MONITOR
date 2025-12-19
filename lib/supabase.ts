
import { createClient } from '@supabase/supabase-js';
import { Buku } from '../types';

// Supabase Configuration - Updated with User Credentials
const supabaseUrl = 'https://oftpulsqxjhhtfukmmtr.supabase.co';
const supabaseAnonKey = 'sb_publishable_lxEMD_lLdbVD6UFrPkEfYQ_UmdW_pBU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const LOCAL_STORAGE_KEY = 'booksmart_local_db';
const TABLE_NAME = 'penjualan_buku';

export const INITIAL_SEED: Buku[] = [
  { judul: 'Laskar Pelangi', kategori: 'Fiksi', harga: 95000, penulis_populer: 'Ya', halaman: 529, jenis_cover: 'Softcover', rating: 4.8, stok: 120, diskon: 10, status_penjualan: 'Laris' },
  { judul: 'Filosofi Teras', kategori: 'Self-Help', harga: 88000, penulis_populer: 'Ya', halaman: 320, jenis_cover: 'Softcover', rating: 4.9, stok: 300, diskon: 5, status_penjualan: 'Laris' },
  { judul: 'Bumi Manusia', kategori: 'Fiksi', harga: 135000, penulis_populer: 'Ya', halaman: 535, jenis_cover: 'Hardcover', rating: 4.9, stok: 45, diskon: 0, status_penjualan: 'Laris' }
];

const getLocalBooks = (): Buku[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalBooks = (books: Buku[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(books));
};

/**
 * Memeriksa apakah domain Supabase bisa dijangkau
 */
export const checkConnection = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: { 'apikey': supabaseAnonKey }
    });
    return res.ok || res.status === 200;
  } catch (e) {
    return false;
  }
};

export const fetchBooks = async (): Promise<{ data: Buku[], isCloud: boolean, errorDetail?: string }> => {
  console.log('🔄 Melakukan Re-Sync ke Cloud: bacakuy smart monitor...');
  
  try {
    const isReachable = await checkConnection();
    if (!isReachable) throw new Error('Network Unreachable');

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (data) {
      saveLocalBooks(data);
      return { data, isCloud: true };
    }
    
    return { data: getLocalBooks().length > 0 ? getLocalBooks() : INITIAL_SEED, isCloud: true };

  } catch (err: any) {
    let errorDetail = '';
    if (err.message === 'Network Unreachable' || err.message?.includes('fetch')) {
      errorDetail = `DOMAIN TERBLOKIR: Gagal menghubungi ${supabaseUrl}. Pastikan domain ini diizinkan di firewall/antivirus anda.`;
    } else {
      errorDetail = `KESALAHAN API: ${err.message}`;
    }

    const localData = getLocalBooks();
    return { 
      data: localData.length > 0 ? localData : INITIAL_SEED, 
      isCloud: false, 
      errorDetail 
    };
  }
};

export const insertBook = async (book: Buku): Promise<{ success: boolean, isCloud: boolean }> => {
  const newBook = { ...book, created_at: new Date().toISOString() };
  
  try {
    const { error } = await supabase.from(TABLE_NAME).insert([newBook]);
    if (error) throw error;
    
    const current = getLocalBooks();
    saveLocalBooks([newBook, ...current]);
    return { success: true, isCloud: true };
  } catch (err: any) {
    const current = getLocalBooks();
    saveLocalBooks([newBook, ...current]);
    return { success: true, isCloud: false };
  }
};

export const seedDatabaseIfEmpty = async () => {
  try {
    const { count, error } = await supabase.from(TABLE_NAME).select('*', { count: 'exact', head: true });
    if (!error && count === 0) {
      await supabase.from(TABLE_NAME).insert(INITIAL_SEED);
    }
  } catch (e) {}
};
