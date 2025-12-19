
import { StatisticalReport } from '../types';

/**
 * IMPLEMENTASI STATISTIK DESKRIPTIF DARI NOL
 * Digunakan untuk analisis mendalam variabel numerik (Harga & Halaman).
 */

export const calculateBasicStats = (data: number[]): StatisticalReport => {
  const n = data.length;
  if (n === 0) return { mean: 0, median: 0, mode: [], stdDev: 0, variance: 0, min: 0, max: 0, q1: 0, q3: 0, iqr: 0, skewness: 0, kurtosis: 0 };

  const sorted = [...data].sort((a, b) => a - b);
  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  // Mode
  const counts: Record<number, number> = {};
  data.forEach(x => counts[x] = (counts[x] || 0) + 1);
  const maxFreq = Math.max(...Object.values(counts));
  const mode = Object.keys(counts).filter(k => counts[Number(k)] === maxFreq).map(Number);

  // Variance & StdDev
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Quartiles
  const getQuartile = (arr: number[], q: number) => {
    const pos = (arr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (arr[base + 1] !== undefined) {
      return arr[base] + rest * (arr[base + 1] - arr[base]);
    } else {
      return arr[base];
    }
  };
  const q1 = getQuartile(sorted, 0.25);
  const q3 = getQuartile(sorted, 0.75);
  const iqr = q3 - q1;

  // Skewness (Fisher-Pearson)
  const skewness = (data.reduce((acc, val) => acc + Math.pow(val - mean, 3), 0) / n) / Math.pow(stdDev, 3);

  // Kurtosis (Excess)
  const kurtosis = (data.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / n) / Math.pow(stdDev, 4) - 3;

  return {
    mean, median, mode, stdDev, variance,
    min: sorted[0],
    max: sorted[n - 1],
    q1, q3, iqr, skewness, kurtosis
  };
};

export const calculatePearson = (x: number[], y: number[]): number => {
  const n = x.length;
  const muX = x.reduce((a, b) => a + b, 0) / n;
  const muY = y.reduce((a, b) => a + b, 0) / n;
  const num = x.reduce((acc, xi, i) => acc + (xi - muX) * (y[i] - muY), 0);
  const den = Math.sqrt(
    x.reduce((acc, xi) => acc + Math.pow(xi - muX, 2), 0) *
    y.reduce((acc, yi) => acc + Math.pow(yi - muY, 2), 0)
  );
  return den === 0 ? 0 : num / den;
};

export const detectOutliers = (data: number[]) => {
  const { q1, q3, iqr } = calculateBasicStats(data);
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  return data.filter(x => x < lowerBound || x > upperBound);
};
