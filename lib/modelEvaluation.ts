
import { Buku, EvaluationMetrics, StatusPenjualan } from '../types';
import { DecisionTree } from './decisionTree';

/**
 * UTILITY UNTUK EVALUASI PERFORMA MODEL
 */

export const trainTestSplit = (data: Buku[], ratio: number = 0.7) => {
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  const splitIdx = Math.floor(shuffled.length * ratio);
  return {
    train: shuffled.slice(0, splitIdx),
    test: shuffled.slice(splitIdx)
  };
};

export const evaluateModel = (data: Buku[]): EvaluationMetrics => {
  const { train, test } = trainTestSplit(data, 0.75);
  const model = new DecisionTree();
  model.train(train);

  let tp = 0, tn = 0, fp = 0, fn = 0;

  test.forEach(buku => {
    const actual = buku.status_penjualan;
    const predicted = model.predict(buku);

    if (actual === 'Laris' && predicted === 'Laris') tp++;
    if (actual === 'Biasa' && predicted === 'Biasa') tn++;
    if (actual === 'Biasa' && predicted === 'Laris') fp++;
    if (actual === 'Laris' && predicted === 'Biasa') fn++;
  });

  const accuracy = (tp + tn) / (tp + tn + fp + fn || 1);
  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  const f1 = 2 * (precision * recall) / (precision + recall || 1);

  // Simplified ROC calculation (randomizing thresholds is hard for hard-label DT, 
  // so we simulate based on node confidence if we had probabilities, here we simulate 3 points)
  const rocCurve = [
    { fpr: 0, tpr: 0 },
    { fpr: fp / (fp + tn || 1), tpr: tp / (tp + fn || 1) },
    { fpr: 1, tpr: 1 }
  ].sort((a,b) => a.fpr - b.fpr);

  // Calculate AUC using trapezoidal rule
  let auc = 0;
  for (let i = 0; i < rocCurve.length - 1; i++) {
    auc += (rocCurve[i+1].fpr - rocCurve[i].fpr) * (rocCurve[i+1].tpr + rocCurve[i].tpr) / 2;
  }

  return {
    accuracy, precision, recall, f1,
    confusionMatrix: { tp, tn, fp, fn },
    rocCurve,
    auc
  };
};
