
import React from 'react';
import { Block } from '../types';
import { Icons } from '../constants';

interface BlockCardProps {
  block: Block;
}

const BlockCard: React.FC<BlockCardProps> = ({ block }) => {
  const date = new Date(block.time * 1000).toLocaleString();
  
  return (
    <div className="gradient-border p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/20 p-2 rounded-lg">
            <Icons.Bitcoin />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white leading-none">Block #{block.height}</h2>
            <p className="text-gray-400 text-sm mt-1">{block.hash}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-full text-sm font-medium border border-neutral-700">
          <Icons.Clock />
          <span>{date}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Transactions', value: block.tx.length },
          { label: 'Size', value: `${block.size} B` },
          { label: 'Weight', value: block.weight },
          { label: 'Difficulty', value: block.difficulty },
        ].map((stat, idx) => (
          <div key={idx} className="bg-neutral-900/50 p-3 rounded border border-neutral-800">
            <p className="text-gray-500 text-xs uppercase tracking-wider">{stat.label}</p>
            <p className="text-lg font-bold text-white mono">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs text-orange-500 font-bold uppercase tracking-widest block mb-1">Merkle Root</label>
          <div className="bg-black p-3 rounded text-xs mono text-gray-300 break-all border border-neutral-800">
            {block.merkleroot}
          </div>
        </div>
        <div>
          <label className="text-xs text-blue-500 font-bold uppercase tracking-widest block mb-1">Chain Work</label>
          <div className="bg-black p-3 rounded text-xs mono text-gray-300 break-all border border-neutral-800">
            {block.chainwork}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockCard;
