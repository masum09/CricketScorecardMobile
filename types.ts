
export enum WicketType {
  BOWLED = 'Bowled',
  CAUGHT = 'Caught',
  LBW = 'LBW',
  RUN_OUT = 'Run Out',
  STUMPED = 'Stumped',
  HIT_WICKET = 'Hit Wicket',
  OTHERS = 'Others'
}

export enum ExtraType {
  WIDE = 'Wide',
  NO_BALL = 'No Ball',
  BYE = 'Bye',
  LEG_BYE = 'Leg Bye'
}

export interface Player {
  id: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  wickets: number;
  ballsBowled: number;
  runsConceded: number;
  isOut: boolean;
}

export interface BallEvent {
  id: string;
  runs: number;
  isExtra: boolean;
  extraType?: ExtraType;
  isWicket: boolean;
  wicketType?: WicketType;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  previousOvers: string;
  previousTotalRuns: number;
  previousWickets: number;
}

export interface MatchState {
  totalRuns: number;
  wickets: number;
  ballsInOver: number;
  overs: number;
  maxOvers: number;
  playersPerSide: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
  };
  strikerId: string;
  nonStrikerId: string;
  currentBowlerId: string;
  players: Record<string, Player>;
  history: BallEvent[];
  teamName: string;
  opponentName: string;
  battingOrder: string[];
  bowlingSquad: string[];
  nextBatsmanIndex: number;
}
