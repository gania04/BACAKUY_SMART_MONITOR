
import React, { useRef, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { motion } from 'framer-motion';

interface Props {
  data: any;
}

const DecisionTreeViz: React.FC<Props> = ({ data }) => {
  const treeContainerRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden h-[600px] w-full relative tree-container" ref={treeContainerRef}>
      <div className="absolute top-6 left-8 z-10">
        <h3 className="text-xl font-black text-slate-800 font-jakarta">Arsitektur Pohon Keputusan</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Gunakan mouse/touch untuk zoom dan drag struktur model.</p>
      </div>

      <div className="h-full w-full">
        <Tree 
          data={data} 
          orientation="vertical"
          pathFunc="step"
          translate={{ x: 400, y: 100 }}
          nodeSize={{ x: 250, y: 150 }}
          renderCustomNodeElement={(rd3tProps) => {
            const isLeaf = rd3tProps.nodeDatum.name.includes("PREDIKSI");
            const isLaris = rd3tProps.nodeDatum.name.includes("Laris");
            
            return (
              <g>
                <rect 
                  width="200" 
                  height="80" 
                  x="-100" 
                  y="-40" 
                  rx="16" 
                  fill={isLeaf ? (isLaris ? "#ecfdf5" : "#fff1f2") : "#f8fafc"} 
                  stroke={isLeaf ? (isLaris ? "#10b981" : "#f43f5e") : "#e2e8f0"}
                  strokeWidth="2"
                />
                <text 
                  dy="0" 
                  textAnchor="middle" 
                  className="font-black text-[12px]" 
                  fill={isLeaf ? (isLaris ? "#065f46" : "#9f1239") : "#1e293b"}
                  style={{ fontSize: '12px', fontWeight: '800' }}
                >
                  {rd3tProps.nodeDatum.name.split(' ➜ ').pop()}
                </text>
                <text 
                  dy="20" 
                  textAnchor="middle" 
                  className="text-[10px]" 
                  fill="#64748b"
                  style={{ fontSize: '10px' }}
                >
                  Samples: {rd3tProps.nodeDatum.attributes?.samples} | Entropy: {rd3tProps.nodeDatum.attributes?.entropy}
                </text>
                {rd3tProps.nodeDatum.name.includes('➜') && (
                  <text 
                    dy="-50" 
                    textAnchor="middle" 
                    fill="#4f46e5" 
                    style={{ fontSize: '11px', fontWeight: 'bold' }}
                  >
                    {rd3tProps.nodeDatum.name.split(' ➜ ')[0]}
                  </text>
                )}
              </g>
            );
          }}
        />
      </div>
    </div>
  );
};

export default DecisionTreeViz;
