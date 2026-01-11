
import React from 'react';

interface ScoreCardProps {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  crr: string;
  teamName: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ runs, wickets, overs, balls, crr, teamName }) => {
  return (
    <div className="p-4 mt-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 p-6 shadow-xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-widest">{teamName} INNINGS</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-5xl font-black text-white">{runs}</h2>
              <span className="text-3xl font-light text-emerald-200">/ {wickets}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-red-500 live-indicator" />
              <span className="text-[10px] font-bold tracking-tighter text-white">LIVE</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-end relative z-10">
          <div>
            <span className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest block mb-0.5">OVERS</span>
            <p className="text-xl font-bold text-white leading-none">{overs}.{balls}</p>
          </div>
          <div className="text-right">
            <span className="text-emerald-200 text-[10px] font-bold uppercase tracking-widest block mb-0.5">CRR</span>
            <p className="text-xl font-bold text-white leading-none">{crr}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
