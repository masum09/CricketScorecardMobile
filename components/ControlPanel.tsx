
import React from 'react';
import { ExtraType } from '../types';
import { ICONS } from '../constants';

interface ControlPanelProps {
  onRun: (runs: number) => void;
  onExtra: (type: ExtraType) => void;
  onWicketClick: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onRun, onExtra, onWicketClick }) => {
  const runs = [0, 1, 2, 3, 4, 6];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto glass border-t border-white/10 p-4 pb-8 rounded-t-3xl z-40">
      <div className="grid grid-cols-6 gap-2 mb-4">
        {runs.map((r) => (
          <button
            key={r}
            onClick={() => onRun(r)}
            className="aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all active:scale-95 group"
          >
            <span className="text-xl font-black text-slate-100 group-hover:text-emerald-400">{r}</span>
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onExtra(ExtraType.WIDE)}
          className="py-3 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
        >
          Wide
        </button>
        <button
          onClick={() => onExtra(ExtraType.NO_BALL)}
          className="py-3 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
        >
          NB
        </button>
        <button
          onClick={() => onExtra(ExtraType.BYE)}
          className="py-3 rounded-xl bg-slate-800 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-colors"
        >
          Bye
        </button>
        <button
          onClick={onWicketClick}
          className="py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-500 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/30 transition-colors"
        >
          {ICONS.WICKET}
          OUT
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
