
import React, { useState } from 'react';
import { MatchState, Player } from '../types';
import { ICONS } from '../constants';

interface PlayerStatsProps {
  match: MatchState;
  onUpdatePlayerName: (id: string, newName: string) => void;
  onBowlerChange: () => void;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ match, onUpdatePlayerName, onBowlerChange }) => {
  const striker = match.players[match.strikerId];
  const nonStriker = match.players[match.nonStrikerId];
  
  // Get all bowlers who have bowled or are currently bowling
  const bowlingPerformers = match.bowlingSquad
    .map(id => match.players[id])
    .filter(p => p.ballsBowled > 0 || p.id === match.currentBowlerId);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const calculateSR = (runs: number, balls: number) => {
    if (balls === 0) return "0.0";
    return ((runs / balls) * 100).toFixed(1);
  };

  const calculateEconomy = (runs: number, balls: number) => {
    if (balls === 0) return "0.0";
    const overs = balls / 6;
    return (runs / overs).toFixed(2);
  };

  const saveName = () => {
    if (editingId && tempName.trim()) {
      onUpdatePlayerName(editingId, tempName.trim());
      setSavedId(editingId);
      setTimeout(() => setSavedId(null), 2000);
    }
    setEditingId(null);
  };

  const handleEditClick = (player: Player) => {
    setEditingId(player.id);
    setTempName(player.name);
  };

  const renderPlayerName = (player: Player, isStriker: boolean = false, isBowler: boolean = false) => {
    const isEditing = editingId === player.id;
    const isRecentlySaved = savedId === player.id;
    const isActiveBowler = isBowler && player.id === match.currentBowlerId;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <input
            autoFocus 
            type="text" 
            value={tempName}
            onFocus={(e) => e.target.select()}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveName()}
            onBlur={saveName}
            className="bg-slate-900 border-2 border-emerald-500 ring-4 ring-emerald-500/10 rounded-lg px-2 py-1 text-sm text-white focus:outline-none w-32 shadow-xl z-10"
          />
          <button 
            onMouseDown={(e) => e.preventDefault()} 
            onClick={saveName} 
            className="p-1.5 bg-emerald-500 rounded-lg text-slate-950 hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            title="Save changes"
          >
            {ICONS.CHECK}
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 group/name relative">
        {isStriker && <span className="text-emerald-400 font-bold">•</span>}
        {isActiveBowler && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />}
        
        <button 
          onClick={() => handleEditClick(player)}
          className={`font-semibold text-left transition-all duration-300 hover:text-emerald-400 active:scale-95 ${
            isRecentlySaved ? 'text-emerald-400' : (isActiveBowler ? 'text-emerald-400' : 'text-slate-200')
          }`}
        >
          {player.name}{isStriker ? '*' : ''}
        </button>

        {isRecentlySaved ? (
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter ml-1 animate-out fade-out duration-1000">Saved</span>
        ) : (
          <button 
            onClick={() => handleEditClick(player)} 
            className="opacity-0 group-hover/name:opacity-100 text-slate-500 hover:text-emerald-400 transition-all p-1"
            title="Edit name"
          >
            {ICONS.EDIT}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5 border border-white/5 shadow-lg">
        {/* Batting Section */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <h4>Batting</h4>
            <div className="flex gap-4">
              <span className="w-10 text-center">R</span>
              <span className="w-10 text-center">B</span>
              <span className="w-12 text-center">SR</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center group">
              <div className="flex items-center">{renderPlayerName(striker, true)}</div>
              <div className="flex gap-4 text-sm font-bold">
                <span className="w-10 text-center text-white">{striker.runs}</span>
                <span className="w-10 text-center text-slate-400">{striker.balls}</span>
                <span className="w-12 text-center text-slate-400">{calculateSR(striker.runs, striker.balls)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center group opacity-70 hover:opacity-100 transition-opacity pl-4">
              <div className="flex items-center">{renderPlayerName(nonStriker)}</div>
              <div className="flex gap-4 text-sm font-bold">
                <span className="w-10 text-center text-white">{nonStriker.runs}</span>
                <span className="w-10 text-center text-slate-400">{nonStriker.balls}</span>
                <span className="w-12 text-center text-slate-400">{calculateSR(nonStriker.runs, nonStriker.balls)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bowling Section */}
        <div className="p-4 bg-white/2">
          <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bowling</h4>
               <button onClick={onBowlerChange} className="text-[8px] font-black bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 transition-colors">Change Bowler</button>
             </div>
             <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="w-10 text-center">O</span>
               <span className="w-8 text-center">R</span>
               <span className="w-8 text-center">W</span>
               <span className="w-10 text-center">ECN</span>
             </div>
          </div>
          
          <div className="space-y-3">
            {bowlingPerformers.map((b) => (
              <div key={b.id} className={`flex justify-between items-center transition-opacity ${b.id !== match.currentBowlerId ? 'opacity-60 hover:opacity-100' : ''}`}>
                <div className="flex items-center gap-2">
                  {renderPlayerName(b, false, true)}
                </div>
                <div className="flex gap-4 text-sm font-bold">
                  <span className="w-10 text-center text-white">
                    {Math.floor(b.ballsBowled / 6)}.{b.ballsBowled % 6}
                  </span>
                  <span className="w-8 text-center text-slate-400">{b.runsConceded}</span>
                  <span className="w-8 text-center text-emerald-400">{b.wickets}</span>
                  <span className="w-10 text-center text-slate-400 font-medium">{calculateEconomy(b.runsConceded, b.ballsBowled)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
