
export type StatusPenjualan = 'Laris' | 'Biasa';

export interface Buku {
  id?: number;
  judul: string;
  kategori: string;
  harga: number;
  penulis_populer: 'Ya' | 'Tidak';
  halaman: number;
  jenis_cover: 'Hardcover' | 'Softcover';
  rating: number;
  stok: number;
  diskon: number;
  status_penjualan?: StatusPenjualan;
  created_at?: string;
}

export interface DecisionTreeNode {
  attribute?: keyof Buku | string;
  children?: Record<string, DecisionTreeNode>;
  prediction?: StatusPenjualan;
  entropy?: number;
  samples?: number;
}

export type TabType = 'dashboard' | 'prediksi' | 'katalog' | 'statistik' | 'evaluasi' | 'setup';

export interface StatisticalReport {
  mean: number;
  median: number;
  mode: number[];
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  confusionMatrix: {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
  };
  rocCurve: { fpr: number; tpr: number }[];
  auc: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}
