
import React from 'react';
import { Player } from '../types';

interface BowlerModalProps {
  isOpen: boolean;
  bowlers: Player[];
  currentBowlerId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

const BowlerModal: React.FC<BowlerModalProps> = ({ isOpen, bowlers, currentBowlerId, onSelect, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      <div className="glass w-full max-w-sm rounded-3xl overflow-hidden relative z-10 border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Select Bowler</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-1">Next Over</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">&times;</button>
          </div>
          
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
            {bowlers.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelect(b.id)}
                className={`flex justify-between items-center p-4 rounded-2xl border transition-all active:scale-95 ${
                  b.id === currentBowlerId 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20' 
                    : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                }`}
              >
                <div className="text-left">
                  <p className="font-bold text-sm">{b.name}</p>
                  <p className={`text-[9px] uppercase tracking-tighter font-black ${b.id === currentBowlerId ? 'text-slate-900' : 'text-slate-500'}`}>
                    {Math.floor(b.ballsBowled / 6)}.{b.ballsBowled % 6} Overs • {b.wickets} Wkts
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">{b.runsConceded} Runs</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BowlerModal;
