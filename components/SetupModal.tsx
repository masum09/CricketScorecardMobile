
import React, { useState, useEffect } from 'react';
import { MatchState } from '../types';

interface SetupModalProps {
  isOpen: boolean;
  match: MatchState;
  onSave: (data: { 
    teamName: string; 
    opponentName: string; 
    battingNames: string[]; 
    bowlingNames: string[];
    maxOvers: number;
    playersPerSide: number;
  }) => void;
  onClose: () => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ isOpen, match, onSave, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'params' | 'batting' | 'bowling'>('params');
  const [formData, setFormData] = useState({
    teamName: match.teamName,
    opponentName: match.opponentName,
    maxOvers: match.maxOvers,
    playersPerSide: match.playersPerSide,
    battingNames: Array.from({ length: 11 }, (_, i) => match.players[`p${i + 1}`]?.name || `Batsman ${i + 1}`),
    bowlingNames: Array.from({ length: 11 }, (_, i) => match.players[`b${i + 1}`]?.name || `Bowler ${i + 1}`),
  });

  // Adjust name arrays if player count changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      battingNames: prev.battingNames.length !== prev.playersPerSide 
        ? Array.from({ length: prev.playersPerSide }, (_, i) => prev.battingNames[i] || `Batsman ${i + 1}`)
        : prev.battingNames,
      bowlingNames: prev.bowlingNames.length !== prev.playersPerSide 
        ? Array.from({ length: prev.playersPerSide }, (_, i) => prev.bowlingNames[i] || `Bowler ${i + 1}`)
        : prev.bowlingNames,
    }));
  }, [formData.playersPerSide]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleNameChange = (type: 'batting' | 'bowling', idx: number, name: string) => {
    const key = type === 'batting' ? 'battingNames' : 'bowlingNames';
    const updated = [...formData[key]];
    updated[idx] = name;
    setFormData({ ...formData, [key]: updated });
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="glass w-full max-w-sm max-h-[90vh] rounded-3xl overflow-hidden relative z-10 border border-white/10 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Match Setup</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Configure match parameters</p>
          </div>

          <div className="flex bg-slate-900 p-1 mx-6 mt-4 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('params')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'params' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Match
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('batting')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'batting' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Batting
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bowling')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'bowling' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Bowling
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6 scrollbar-hide">
            {activeTab === 'params' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Players Per Side</label>
                    <select 
                      value={formData.playersPerSide} 
                      onChange={e => setFormData({...formData, playersPerSide: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 appearance-none"
                    >
                      {[2,3,4,5,6,7,8,9,10,11].map(n => <option key={n} value={n} className="bg-slate-900">{n} Players</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Total Overs</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="50"
                      value={formData.maxOvers} 
                      onChange={e => setFormData({...formData, maxOvers: parseInt(e.target.value) || 1})} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Batting Team</label>
                  <input type="text" value={formData.teamName} onChange={e => setFormData({...formData, teamName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Bowling Team</label>
                  <input type="text" value={formData.opponentName} onChange={e => setFormData({...formData, opponentName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            )}

            {activeTab === 'batting' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-200">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Batting Squad Names</label>
                {formData.battingNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-4 text-[9px] font-bold text-slate-600">{idx + 1}</span>
                    <input type="text" value={name} onChange={e => handleNameChange('batting', idx, e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder={`Player ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bowling' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-200">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bowling Squad Names</label>
                {formData.bowlingNames.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-4 text-[9px] font-bold text-slate-600">{idx + 1}</span>
                    <input type="text" value={name} onChange={e => handleNameChange('bowling', idx, e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder={`Bowler ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-t border-white/10 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="flex-[2] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">Start Match</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupModal;
