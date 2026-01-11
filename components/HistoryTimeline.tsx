
import React from 'react';
import { BallEvent, ExtraType } from '../types';

interface HistoryTimelineProps {
  history: BallEvent[];
}

const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="h-16 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
        <span className="text-slate-600 text-xs font-medium">No balls bowled yet</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
      {history.map((event) => (
        <div key={event.id} className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all
            ${event.isWicket 
              ? 'bg-red-500 border-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
              : event.runs === 4 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                : event.runs === 6
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'bg-white/5 border-white/10 text-slate-300'}
          `}>
            {event.isWicket ? 'W' : event.isExtra ? `${event.runs}${event.extraType === ExtraType.WIDE ? 'wd' : 'nb'}` : event.runs}
          </div>
          <span className="text-[9px] font-bold text-slate-500">{event.previousOvers}</span>
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;
