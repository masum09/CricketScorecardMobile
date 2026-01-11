
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MatchState, Player, BallEvent, WicketType, ExtraType } from './types';
import { ICONS } from './constants';
import ScoreCard from './components/ScoreCard';
import PlayerStats from './components/PlayerStats';
import ControlPanel from './components/ControlPanel';
import HistoryTimeline from './components/HistoryTimeline';
import WicketModal from './components/WicketModal';
import BowlerModal from './components/BowlerModal';
import SetupModal from './components/SetupModal';
import MatchSummary from './components/MatchSummary';
import NextBatsmanModal from './components/NextBatsmanModal';
import { generateCommentary } from './services/geminiService';

const SAVED_MATCH_KEY = 'crictrack_pro_saved_match';

const generateInitialPlayers = (count: number = 11): Record<string, Player> => {
  const players: Record<string, Player> = {};
  for (let i = 1; i <= count; i++) {
    players[`p${i}`] = { 
      id: `p${i}`, 
      name: `Batsman ${i}`, 
      runs: 0, 
      balls: 0, 
      fours: 0, 
      sixes: 0, 
      wickets: 0, 
      ballsBowled: 0, 
      runsConceded: 0,
      isOut: false
    };
  }
  for (let i = 1; i <= count; i++) {
    players[`b${i}`] = { 
      id: `b${i}`, 
      name: `Bowler ${i}`, 
      runs: 0, 
      balls: 0, 
      fours: 0, 
      sixes: 0, 
      wickets: 0, 
      ballsBowled: 0, 
      runsConceded: 0,
      isOut: false
    };
  }
  return players;
};

const App: React.FC = () => {
  const [match, setMatch] = useState<MatchState>({
    totalRuns: 0,
    wickets: 0,
    ballsInOver: 0,
    overs: 0,
    maxOvers: 20,
    playersPerSide: 11,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
    strikerId: 'p1',
    nonStrikerId: 'p2',
    currentBowlerId: 'b1',
    players: generateInitialPlayers(11),
    history: [],
    teamName: "India",
    opponentName: "Australia",
    battingOrder: Array.from({ length: 11 }, (_, i) => `p${i+1}`),
    bowlingSquad: Array.from({ length: 11 }, (_, i) => `b${i+1}`),
    nextBatsmanIndex: 2,
  });

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showNextBatsmanModal, setShowNextBatsmanModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [aiCommentary, setAiCommentary] = useState<string>("Welcome! Set up the match parameters to begin.");
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hasSavedMatch, setHasSavedMatch] = useState(false);

  useEffect(() => {
    setHasSavedMatch(!!localStorage.getItem(SAVED_MATCH_KEY));
    if (match.history.length === 0 && match.totalRuns === 0) {
      setShowSetupModal(true);
    }
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveMatch = () => {
    try {
      localStorage.setItem(SAVED_MATCH_KEY, JSON.stringify(match));
      setHasSavedMatch(true);
      showToast("Match saved successfully!");
    } catch (e) {
      console.error(e);
      showToast("Failed to save match.");
    }
  };

  const handleLoadMatch = () => {
    try {
      const saved = localStorage.getItem(SAVED_MATCH_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMatch(parsed);
        showToast("Match loaded successfully!");
      } else {
        showToast("No saved match found.");
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to load match.");
    }
  };

  const crr = useMemo(() => {
    const totalBalls = match.overs * 6 + match.ballsInOver;
    if (totalBalls === 0) return "0.00";
    return ((match.totalRuns / totalBalls) * 6).toFixed(2);
  }, [match.totalRuns, match.overs, match.ballsInOver]);

  const handleUpdatePlayerName = (id: string, newName: string) => {
    setMatch(prev => ({
      ...prev,
      players: {
        ...prev.players,
        [id]: { ...prev.players[id], name: newName }
      }
    }));
  };

  const handleSetupSave = (data: { 
    teamName: string; 
    opponentName: string; 
    battingNames: string[]; 
    bowlingNames: string[];
    maxOvers: number;
    playersPerSide: number;
  }) => {
    const initialPlayers = generateInitialPlayers(data.playersPerSide);
    
    setMatch({
      totalRuns: 0,
      wickets: 0,
      ballsInOver: 0,
      overs: 0,
      maxOvers: data.maxOvers,
      playersPerSide: data.playersPerSide,
      extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
      strikerId: 'p1',
      nonStrikerId: 'p2',
      currentBowlerId: 'b1',
      players: (() => {
        data.battingNames.forEach((name, idx) => {
          if (initialPlayers[`p${idx + 1}`]) initialPlayers[`p${idx + 1}`].name = name;
        });
        data.bowlingNames.forEach((name, idx) => {
          if (initialPlayers[`b${idx + 1}`]) initialPlayers[`b${idx + 1}`].name = name;
        });
        return initialPlayers;
      })(),
      history: [],
      teamName: data.teamName,
      opponentName: data.opponentName,
      battingOrder: Array.from({ length: data.playersPerSide }, (_, i) => `p${i+1}`),
      bowlingSquad: Array.from({ length: data.playersPerSide }, (_, i) => `b${i+1}`),
      nextBatsmanIndex: 2,
    });
    setShowSetupModal(false);
    showToast("Match setup complete!");
  };

  const handleReset = () => {
    if (confirm("Reset everything for a new match?")) {
      setShowSummary(false);
      setShowSetupModal(true);
    }
  };

  const handleUndo = useCallback(() => {
    if (match.history.length === 0) return;
    setMatch(prev => {
      const lastEvent = prev.history[0];
      const newHistory = prev.history.slice(1);
      const updatedPlayers = { ...prev.players };
      const striker = updatedPlayers[lastEvent.strikerId];
      const bowler = updatedPlayers[lastEvent.bowlerId];
      if (!lastEvent.isWicket) {
        striker.runs -= lastEvent.runs;
        if (!lastEvent.isExtra || lastEvent.extraType === ExtraType.NO_BALL) striker.balls -= 1;
      }
      const newExtras = { ...prev.extras };
      if (lastEvent.isExtra) {
        if (lastEvent.extraType === ExtraType.WIDE) newExtras.wides--;
        if (lastEvent.extraType === ExtraType.NO_BALL) newExtras.noBalls--;
        if (lastEvent.extraType === ExtraType.BYE) newExtras.byes--;
      }
      if (!lastEvent.isExtra || lastEvent.extraType === ExtraType.NO_BALL) bowler.ballsBowled--;
      bowler.runsConceded -= (lastEvent.runs + (lastEvent.isExtra ? 1 : 0));
      if (lastEvent.isWicket) {
        bowler.wickets--;
        updatedPlayers[lastEvent.strikerId].isOut = false;
      }
      let newOvers = prev.overs;
      let newBalls = prev.ballsInOver - 1;
      if (newBalls < 0) {
        newOvers--;
        newBalls = 5;
      }
      return {
        ...prev,
        totalRuns: lastEvent.previousTotalRuns,
        wickets: lastEvent.previousWickets,
        overs: newOvers,
        ballsInOver: newBalls,
        extras: newExtras,
        strikerId: lastEvent.strikerId,
        nonStrikerId: lastEvent.nonStrikerId,
        players: updatedPlayers,
        history: newHistory,
      };
    });
  }, [match.history]);

  const handleBallEvent = useCallback((params: { runs: number, isExtra?: boolean, extraType?: ExtraType, isWicket?: boolean, wicketType?: WicketType }) => {
    setMatch(prev => {
      const { runs, isExtra = false, extraType, isWicket = false, wicketType } = params;
      const updatedPlayers = { ...prev.players };
      const striker = { ...updatedPlayers[prev.strikerId] };
      const bowler = { ...updatedPlayers[prev.currentBowlerId] };

      let addedRuns = runs;
      let extraRun = 0;
      let ballCounted = true;

      const newExtras = { ...prev.extras };
      if (isExtra) {
        extraRun = 1;
        if (extraType === ExtraType.WIDE) { ballCounted = false; newExtras.wides++; }
        else if (extraType === ExtraType.NO_BALL) { ballCounted = false; newExtras.noBalls++; striker.runs += runs; }
        else if (extraType === ExtraType.BYE) newExtras.byes++;
      } else if (!isWicket) {
        striker.runs += runs;
        striker.balls += 1;
        if (runs === 4) striker.fours++;
        if (runs === 6) striker.sixes++;
      }

      if (ballCounted) bowler.ballsBowled++;
      bowler.runsConceded += (addedRuns + extraRun);
      if (isWicket) bowler.wickets++;

      let newBallsInOver = prev.ballsInOver;
      let newOvers = prev.overs;
      let endMatchTriggered = false;

      if (ballCounted) {
        newBallsInOver++;
        if (newBallsInOver === 6) {
          newOvers++;
          newBallsInOver = 0;
          
          if (newOvers >= prev.maxOvers) {
            endMatchTriggered = true;
          } else if (!isWicket) { // Only show change bowler if no wicket fell (wicket handles next batsman first)
            setTimeout(() => setShowBowlerModal(true), 600);
          }
        }
      }

      let newStrikerId = prev.strikerId;
      let newNonStrikerId = prev.nonStrikerId;

      if (addedRuns % 2 !== 0) [newStrikerId, newNonStrikerId] = [newNonStrikerId, newStrikerId];
      if (newBallsInOver === 0 && ballCounted && !endMatchTriggered && !isWicket) [newStrikerId, newNonStrikerId] = [newNonStrikerId, newStrikerId];

      if (isWicket) {
        updatedPlayers[prev.strikerId].isOut = true;
        const remainingBatsmenCount = Object.values(updatedPlayers).filter(p => p.id.startsWith('p') && !p.isOut && p.id !== prev.nonStrikerId).length;
        
        if (remainingBatsmenCount > 0) {
          setTimeout(() => setShowNextBatsmanModal(true), 400);
        } else {
          endMatchTriggered = true;
        }
      }

      if (endMatchTriggered) {
        setTimeout(() => setShowSummary(true), 800);
      }

      const event: BallEvent = {
        id: Math.random().toString(36).substr(2, 9),
        runs, isExtra, extraType, isWicket, wicketType,
        strikerId: prev.strikerId,
        nonStrikerId: prev.nonStrikerId,
        bowlerId: prev.currentBowlerId,
        previousOvers: `${prev.overs}.${prev.ballsInOver}`,
        previousTotalRuns: prev.totalRuns,
        previousWickets: prev.wickets
      };

      updatedPlayers[prev.strikerId] = striker;
      updatedPlayers[prev.currentBowlerId] = bowler;

      return {
        ...prev,
        totalRuns: prev.totalRuns + addedRuns + extraRun,
        wickets: isWicket ? prev.wickets + 1 : prev.wickets,
        ballsInOver: newBallsInOver,
        overs: newOvers,
        extras: newExtras,
        strikerId: newStrikerId,
        nonStrikerId: newNonStrikerId,
        players: updatedPlayers,
        history: [event, ...prev.history].slice(0, 50),
      };
    });
  }, []);

  const handleNextBatsmanSelect = (id: string) => {
    setMatch(prev => {
      let newStrikerId = id;
      let newNonStrikerId = prev.nonStrikerId;
      
      // Rotate strike if over ended during the wicket
      if (prev.ballsInOver === 0 && prev.overs > 0) {
        [newStrikerId, newNonStrikerId] = [newNonStrikerId, newStrikerId];
        setTimeout(() => setShowBowlerModal(true), 600);
      }

      return {
        ...prev,
        strikerId: newStrikerId,
        nonStrikerId: newNonStrikerId
      };
    });
    setShowNextBatsmanModal(false);
  };

  const triggerAiCommentary = useCallback(async () => {
    setIsGeneratingCommentary(true);
    try {
      const text = await generateCommentary(match);
      setAiCommentary(text);
    } catch (e) { console.error(e); }
    finally { setIsGeneratingCommentary(false); }
  }, [match]);

  useEffect(() => {
    if (match.ballsInOver === 0 && match.overs > 0 && match.overs < match.maxOvers && !isGeneratingCommentary && !showNextBatsmanModal) {
      triggerAiCommentary();
    }
  }, [match.overs, match.ballsInOver, match.maxOvers, showNextBatsmanModal]);

  const availableIncomingBatsmen = useMemo(() => {
    return Object.values(match.players).filter(p => 
      p.id.startsWith('p') && 
      !p.isOut && 
      p.id !== match.strikerId && 
      p.id !== match.nonStrikerId
    );
  }, [match.players, match.strikerId, match.nonStrikerId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-lg mx-auto shadow-2xl overflow-hidden relative">
      <header className="p-4 flex items-center justify-between border-b border-white/10 glass sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <span className="font-bold text-slate-950">C</span>
          </div>
          <h1 className="font-bold text-lg tracking-tight">CricTrack Pro</h1>
        </div>
        <div className="flex gap-1 items-center">
          <button 
            onClick={handleLoadMatch} 
            disabled={!hasSavedMatch}
            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20"
            title="Resume Match"
          >
            {ICONS.LOAD}
          </button>
          <button 
            onClick={handleSaveMatch} 
            className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors"
            title="Save Match"
          >
            {ICONS.SAVE}
          </button>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <button onClick={() => setShowSetupModal(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Settings">{ICONS.SETTINGS}</button>
          <button onClick={handleUndo} disabled={match.history.length === 0} className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30" title="Undo">{ICONS.UNDO}</button>
          <button onClick={() => setShowSummary(true)} disabled={match.history.length === 0} className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-colors disabled:opacity-30" title="Complete Match">{ICONS.FLAG}</button>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[110] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-full font-bold text-sm shadow-xl shadow-emerald-500/20">
            {toast}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-32">
        <ScoreCard runs={match.totalRuns} wickets={match.wickets} overs={match.overs} balls={match.ballsInOver} crr={crr} teamName={match.teamName} />

        <div className="px-4 py-2">
          <div className="glass rounded-xl p-3 border-emerald-500/20 border flex gap-3 items-start">
            <div className="mt-1 text-emerald-400">{ICONS.STARS}</div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-500/80">AI Commentary</span>
                {isGeneratingCommentary && <div className="w-2 h-2 rounded-full bg-emerald-500 live-indicator" />}
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">"{aiCommentary}"</p>
            </div>
          </div>
        </div>

        <div className="px-4 mt-6">
          <PlayerStats match={match} onUpdatePlayerName={handleUpdatePlayerName} onBowlerChange={() => setShowBowlerModal(true)} />
        </div>

        <div className="mt-8 px-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-4 px-2">Recent Timeline</h3>
          <HistoryTimeline history={match.history} />
        </div>
      </main>

      <ControlPanel onRun={(r) => handleBallEvent({ runs: r })} onExtra={(t) => handleBallEvent({ runs: 0, isExtra: true, extraType: t })} onWicketClick={() => setShowWicketModal(true)} />
      
      <WicketModal 
        isOpen={showWicketModal} 
        onClose={() => setShowWicketModal(false)} 
        onSubmit={(type) => { handleBallEvent({ runs: 0, isWicket: true, wicketType: type }); setShowWicketModal(false); }} 
      />
      
      <NextBatsmanModal 
        isOpen={showNextBatsmanModal} 
        availablePlayers={availableIncomingBatsmen} 
        onSelect={handleNextBatsmanSelect} 
      />

      <BowlerModal 
        isOpen={showBowlerModal} 
        bowlers={match.bowlingSquad.map(id => match.players[id])} 
        currentBowlerId={match.currentBowlerId}
        onSelect={(id) => { setMatch(p => ({ ...p, currentBowlerId: id })); setShowBowlerModal(false); }} 
        onClose={() => setShowBowlerModal(false)} 
      />
      
      <SetupModal isOpen={showSetupModal} match={match} onSave={handleSetupSave} onClose={() => setShowSetupModal(false)} />
      {showSummary && <MatchSummary match={match} onClose={() => setShowSummary(false)} onReset={handleReset} />}
    </div>
  );
};

export default App;
