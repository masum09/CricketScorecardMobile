
import React from 'react';
import { Player } from '../types';

interface NextBatsmanModalProps {
  isOpen: boolean;
  availablePlayers: Player[];
  onSelect: (id: string) => void;
}

const NextBatsmanModal: React.FC<NextBatsmanModalProps> = ({ isOpen, availablePlayers, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
      <div className="glass w-full max-w-sm rounded-3xl overflow-hidden relative z-10 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Next Batsman</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1 italic">A wicket has fallen. Who's in next?</p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
            {availablePlayers.length > 0 ? (
              availablePlayers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 text-white hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-400 transition-all active:scale-95 group"
                >
                  <div className="text-left">
                    <p className="font-bold text-sm group-hover:text-slate-950">{p.name}</p>
                    <p className="text-[9px] uppercase tracking-tighter font-black text-slate-500 group-hover:text-slate-900">Available to bat</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-slate-950/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-slate-500 text-sm">No more batsmen available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextBatsmanModal;
