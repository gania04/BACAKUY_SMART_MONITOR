
import React, { useState, useMemo } from 'react';
import { Buku } from '../types';
import { evaluateModel } from '../lib/modelEvaluation';
import { DecisionTree } from '../lib/decisionTree';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Activity, Target, ShieldCheck, Zap, AlertCircle, Info, PieChart } from 'lucide-react';
import DecisionTreeViz from './DecisionTreeViz';

interface Props {
  data: Buku[];
}

const EvaluasiModel: React.FC<Props> = ({ data }) => {
  const [isRetraining, setIsRetraining] = useState(false);

  const evaluationResults = useMemo(() => {
    if (data.length < 5) return null;
    return evaluateModel(data);
  }, [data, isRetraining]);

  const treeStructure = useMemo(() => {
    const model = new DecisionTree();
    model.train(data);
    return {
      structure: model.getTreeStructure(),
      importance: model.getFeatureImportance()
    };
  }, [data, isRetraining]);

  if (data.length < 10) return (
    <div className="bg-white p-16 text-center rounded-[3rem] border-2 border-dashed border-slate-200">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
        <AlertCircle size={40} />
      </div>
      <h3 className="text-2xl font-black text-slate-800">Data Tidak Mencukupi</h3>
      <p className="text-slate-500 mt-2 max-w-md mx-auto">Anda butuh minimal 10 records data buku untuk melakukan evaluasi performa model yang valid.</p>
    </div>
  );

  const handleRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => setIsRetraining(false), 800);
  };

  const metrics = evaluationResults!;

  return (
    <div className="space-y-10 pb-20">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-jakarta uppercase">Model Evaluation Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium">Pengukuran kualitas prediksi menggunakan dataset validasi.</p>
        </div>
        <button 
          onClick={handleRetrain}
          disabled={isRetraining}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
        >
          <Zap size={18} className={isRetraining ? "animate-pulse" : ""} />
          {isRetraining ? "Retraining..." : "Retrain & Re-evaluate"}
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricScoreCard title="Accuracy" score={metrics.accuracy} icon={Target} color="indigo" desc="Rasio prediksi benar dari total data." />
        <MetricScoreCard title="Precision" score={metrics.precision} icon={ShieldCheck} color="emerald" desc="Kualitas prediksi kelas 'Laris'." />
        <MetricScoreCard title="Recall" score={metrics.recall} icon={Activity} color="amber" desc="Kemampuan mendeteksi semua buku 'Laris'." />
        <MetricScoreCard title="F1-Score" score={metrics.f1} icon={PieChart} color="rose" desc="Keseimbangan Precision & Recall." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CONFUSION MATRIX */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold font-jakarta">Confusion Matrix</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">True Positive</p>
              <p className="text-2xl font-black text-emerald-600">{metrics.confusionMatrix.tp}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">False Positive</p>
              <p className="text-2xl font-black text-rose-500">{metrics.confusionMatrix.fp}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">False Negative</p>
              <p className="text-2xl font-black text-rose-500">{metrics.confusionMatrix.fn}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">True Negative</p>
              <p className="text-2xl font-black text-slate-800">{metrics.confusionMatrix.tn}</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] leading-relaxed text-indigo-700">
            <strong>Analisis:</strong> Model Anda berhasil menebak {metrics.confusionMatrix.tp} buku Laris dengan benar. Ada {metrics.confusionMatrix.fp} kesalahan tipe I (kegagalan deteksi).
          </div>
        </div>

        {/* FEATURE IMPORTANCE */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl lg:col-span-2">
          <h3 className="text-lg font-bold font-jakarta mb-6">Variabel Paling Berpengaruh</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={treeStructure.importance} layout="vertical" margin={{ left: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" fontSize={10} width={100} tick={{ fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="importance" fill="#4f46e5" radius={[0, 8, 8, 0]} name="Importance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROC CURVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-xl font-bold font-jakarta">ROC Curve Analysis</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">AUC Score: {metrics.auc.toFixed(3)}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black ${metrics.auc > 0.8 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
              {metrics.auc > 0.8 ? 'EXCELLENT' : 'STABLE'}
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.rocCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="fpr" stroke="#ffffff30" fontSize={10} label={{ value: 'FPR', position: 'insideBottom', offset: -5, fill: '#666' }} />
                <YAxis stroke="#ffffff30" fontSize={10} label={{ value: 'TPR', position: 'insideLeft', angle: -90, fill: '#666' }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="tpr" stroke="#6366f1" fill="#4f46e530" strokeWidth={3} />
                <Line type="linear" dataKey="fpr" stroke="#ffffff20" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-6 text-[11px] text-slate-400 leading-relaxed italic"> ROC Curve memvisualisasikan trade-off antara True Positive Rate dan False Positive Rate. Semakin mendekati pojok kiri atas, semakin cerdas modelnya.</p>
        </div>

        {/* EDUCATIONAL INSIGHTS */}
        <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <Zap className="absolute -right-8 -bottom-8 opacity-10" size={200} />
          <h3 className="text-2xl font-black mb-6 font-jakarta">Insight untuk Editor</h3>
          <div className="space-y-6 relative z-10">
            <InsightItem 
              num="01" 
              title="Akurasi Model" 
              text={`Model memiliki tingkat kepercayaan sebesar ${Math.round(metrics.accuracy * 100)}%. Ini berarti 8 dari 10 buku dapat diprediksi dengan tepat.`} 
            />
            <InsightItem 
              num="02" 
              title="Faktor Kunci" 
              text={`Berdasarkan Entropy, variabel ${treeStructure.importance[0].feature} adalah penentu utama status Laris. Fokuskan strategi marketing pada variabel ini.`} 
            />
            <InsightItem 
              num="03" 
              title="Keseimbangan Data" 
              text="F1-Score yang stabil menunjukkan model tidak bias terhadap satu kelas saja (Laris maupun Biasa)." 
            />
          </div>
        </div>
      </div>

      {/* TREE VIZ */}
      <DecisionTreeViz data={treeStructure.structure} />
    </div>
  );
};

const MetricScoreCard = ({ title, score, icon: Icon, color, desc }: any) => {
  const percentage = Math.round(score * 100);
  const status = percentage > 85 ? 'EXCELLENT' : percentage > 70 ? 'GOOD' : 'FAIR';
  
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl hover:-translate-y-1 transition-all">
      <div className={`w-10 h-10 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
        <Icon size={20} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h4 className="text-3xl font-black text-slate-800">{percentage}%</h4>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full bg-${color}-50 text-${color}-600`}>{status}</span>
      </div>
      <p className="text-[10px] text-slate-500 font-medium mt-3 leading-tight">{desc}</p>
      <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full bg-${color}-500`}
        />
      </div>
    </div>
  );
};

const InsightItem = ({ num, title, text }: any) => (
  <div className="flex gap-4">
    <span className="text-indigo-300 font-black text-lg">{num}</span>
    <div>
      <h5 className="font-bold text-sm mb-1">{title}</h5>
      <p className="text-xs text-indigo-100/80 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default EvaluasiModel;
