
import { Buku, DecisionTreeNode, StatusPenjualan } from '../types';

export class DecisionTree {
  public tree: DecisionTreeNode | null = null;
  private features: (keyof Buku)[] = [
    'kategori', 
    'harga', 
    'penulis_populer', 
    'halaman', 
    'jenis_cover', 
    'rating', 
    'diskon'
  ];
  private importanceScores: Record<string, number> = {};

  constructor() {
    this.features.forEach(f => this.importanceScores[f] = 0);
  }

  private discretize(attr: keyof Buku, value: any): string {
    if (attr === 'harga') {
      if (value < 65000) return 'Murah';
      if (value <= 135000) return 'Sedang';
      return 'Mahal';
    }
    if (attr === 'halaman') {
      if (value < 150) return 'Tipis';
      if (value <= 350) return 'Sedang';
      return 'Tebal';
    }
    if (attr === 'rating') {
      if (value < 3.8) return 'Rendah';
      if (value < 4.6) return 'Bagus';
      return 'Sangat Bagus';
    }
    if (attr === 'diskon') {
      if (value === 0) return 'Tanpa Diskon';
      if (value <= 15) return 'Diskon Kecil';
      return 'Diskon Besar';
    }
    return String(value);
  }

  public calculateEntropy(data: Buku[]): number {
    if (data.length === 0) return 0;
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const label = item.status_penjualan || 'Biasa';
      counts[label] = (counts[label] || 0) + 1;
    });

    let entropy = 0;
    const total = data.length;
    Object.values(counts).forEach(count => {
      const p = count / total;
      entropy -= p * Math.log2(p);
    });
    return entropy;
  }

  private findBestSplit(data: Buku[], attributes: (keyof Buku)[]): { attr: keyof Buku; gain: number } {
    const baseEntropy = this.calculateEntropy(data);
    let bestGain = -1;
    let bestAttr = attributes[0];

    attributes.forEach(attr => {
      const subsets: Record<string, Buku[]> = {};
      data.forEach(item => {
        const val = this.discretize(attr, item[attr]);
        if (!subsets[val]) subsets[val] = [];
        subsets[val].push(item);
      });

      let subsetEntropy = 0;
      Object.values(subsets).forEach(subset => {
        const p = subset.length / data.length;
        subsetEntropy += p * this.calculateEntropy(subset);
      });

      const gain = baseEntropy - subsetEntropy;
      if (gain > bestGain) {
        bestGain = gain;
        bestAttr = attr;
      }
    });

    return { attr: bestAttr, gain: bestGain };
  }

  private buildTree(data: Buku[], attributes: (keyof Buku)[]): DecisionTreeNode {
    const samples = data.length;
    const entropy = this.calculateEntropy(data);
    const labels = [...new Set(data.map(d => d.status_penjualan))];

    if (labels.length === 1) {
      return { prediction: labels[0] as StatusPenjualan, samples, entropy };
    }

    if (attributes.length === 0 || samples < 2) {
      const counts: Record<string, number> = {};
      data.forEach(d => { counts[d.status_penjualan!] = (counts[d.status_penjualan!] || 0) + 1; });
      const prediction = Object.entries(counts).sort((a,b) => b[1] - a[1])[0][0] as StatusPenjualan;
      return { prediction, samples, entropy };
    }

    const { attr, gain } = this.findBestSplit(data, attributes);
    
    // Accumulate importance based on information gain * samples
    this.importanceScores[attr] += (gain * samples);

    const node: DecisionTreeNode = { attribute: attr, children: {}, samples, entropy };
    const remainingAttrs = attributes.filter(a => a !== attr);

    const subsets: Record<string, Buku[]> = {};
    data.forEach(item => {
      const val = this.discretize(attr, item[attr]);
      if (!subsets[val]) subsets[val] = [];
      subsets[val].push(item);
    });

    Object.keys(subsets).forEach(val => {
      node.children![val] = this.buildTree(subsets[val], remainingAttrs);
    });

    return node;
  }

  public train(data: Buku[]): void {
    if (data.length === 0) return;
    this.importanceScores = {};
    this.features.forEach(f => this.importanceScores[f] = 0);
    this.tree = this.buildTree(data, this.features);
  }

  public predict(input: Buku): StatusPenjualan {
    if (!this.tree) return 'Biasa';

    let curr = this.tree;
    while (!curr.prediction) {
      const attr = curr.attribute as keyof Buku;
      const val = this.discretize(attr, input[attr]);
      if (curr.children && curr.children[val]) {
        curr = curr.children[val];
      } else {
        if (input.penulis_populer === 'Ya' && input.rating >= 4.0) return 'Laris';
        return 'Biasa';
      }
    }
    return curr.prediction;
  }

  public getFeatureImportance() {
    const total = Object.values(this.importanceScores).reduce((a, b) => a + b, 0);
    return Object.entries(this.importanceScores)
      .map(([feature, score]) => ({
        feature: feature.replace('_', ' ').toUpperCase(),
        importance: total > 0 ? (score / total) * 100 : 0
      }))
      .sort((a, b) => b.importance - a.importance);
  }

  public getTreeStructure(node: DecisionTreeNode | null = this.tree, name: string = "Root"): any {
    if (!node) return null;
    
    const nodeData: any = {
      name: node.prediction ? `PREDIKSI: ${node.prediction}` : `${String(node.attribute).toUpperCase()}`,
      attributes: {
        samples: node.samples,
        entropy: node.entropy?.toFixed(3)
      }
    };

    if (node.children) {
      nodeData.children = Object.entries(node.children).map(([val, child]) => 
        this.getTreeStructure(child, val)
      );
      // Attach the edge label to children
      nodeData.children.forEach((child: any, i: number) => {
        child.name = `${Object.keys(node.children!)[i]} ➜ ${child.name}`;
      });
    }

    return nodeData;
  }
}
