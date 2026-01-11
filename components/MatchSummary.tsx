
import React, { useEffect, useState } from 'react';
import { MatchState } from '../types';
import { ICONS } from '../constants';
import { generateMatchReport } from '../services/geminiService';

interface MatchSummaryProps {
  match: MatchState;
  onClose: () => void;
  onReset: () => void;
}

const MatchSummary: React.FC<MatchSummaryProps> = ({ match, onClose, onReset }) => {
  const [report, setReport] = useState<string>('Generating final report...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReport = async () => {
      const text = await generateMatchReport(match);
      setReport(text);
      setLoading(false);
    };
    getReport();
  }, [match]);

  const sortedBatsmen = Object.values(match.players).sort((a, b) => b.runs - a.runs);
  const sortedBowlers = Object.values(match.players).sort((a, b) => b.wickets - a.wickets);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-300">
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-emerald-600 to-teal-900 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" />
            </svg>
          </div>
          
          <div className="relative z-10 scale-125 mb-4">
            {ICONS.TROPHY}
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Match Completed</h2>
          <p className="text-emerald-200 font-bold tracking-widest text-xs mt-1 uppercase">{match.teamName} Innings</p>
        </div>

        {/* Score Summary Card */}
        <div className="px-6 -mt-12 relative z-10">
          <div className="glass rounded-3xl p-6 shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Final Score</p>
                <h3 className="text-4xl font-black text-white">{match.totalRuns}<span className="text-2xl text-slate-500">/{match.wickets}</span></h3>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Overs Bowled</p>
                <h3 className="text-2xl font-bold text-white">{match.overs}.{match.ballsInOver}</h3>
              </div>
            </div>

            <div className="h-px bg-white/5 mb-6" />

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">AI Match Report</h4>
                {loading ? (
                   <div className="space-y-2 animate-pulse">
                     <div className="h-3 bg-white/5 rounded w-full"></div>
                     <div className="h-3 bg-white/5 rounded w-5/6"></div>
                   </div>
                ) : (
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    {report}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 mt-8 space-y-6">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">Top Performances</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Best Batsman */}
              <div className="glass rounded-2xl p-4 border border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Top Batsman</span>
                <p className="text-lg font-bold text-white mt-1">{sortedBatsmen[0].name}</p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl font-black text-emerald-400">{sortedBatsmen[0].runs}</span>
                  <span className="text-xs text-slate-500">({sortedBatsmen[0].balls}b)</span>
                </div>
              </div>
              {/* Best Bowler */}
              <div className="glass rounded-2xl p-4 border border-white/5">
                <span className="text-[9px] font-bold text-slate-500 uppercase">Top Bowler</span>
                <p className="text-lg font-bold text-white mt-1">{sortedBowlers[0].name}</p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl font-black text-emerald-400">{sortedBowlers[0].wickets}</span>
                  <span className="text-xs text-slate-500">Wickets</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden border border-white/5">
             <div className="p-4 bg-white/2 border-b border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Innings Extras</h4>
             </div>
             <div className="p-4 grid grid-cols-4 gap-4 text-center">
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">WD</span>
                  <span className="text-lg font-bold text-white">{match.extras.wides}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">NB</span>
                  <span className="text-lg font-bold text-white">{match.extras.noBalls}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">BYE</span>
                  <span className="text-lg font-bold text-white">{match.extras.byes}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1">LB</span>
                  <span className="text-lg font-bold text-white">{match.extras.legByes}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-t border-white/10 flex gap-4">
        <button 
          onClick={onClose}
          className="flex-1 py-4 px-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all active:scale-95"
        >
          View Scorecard
        </button>
        <button 
          onClick={onReset}
          className="flex-1 py-4 px-4 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95"
        >
          NEW MATCH
        </button>
      </div>
    </div>
  );
};

export default MatchSummary;
