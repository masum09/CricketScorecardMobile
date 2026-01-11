
import React from 'react';
import { WicketType } from '../types';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: WicketType) => void;
}

const WicketModal: React.FC<WicketModalProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const types = Object.values(WicketType);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="glass w-full max-w-sm rounded-3xl overflow-hidden relative z-10 border border-white/10 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-red-500">Dismissal Type</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => onSubmit(t)}
                className="py-4 px-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all"
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WicketModal;
