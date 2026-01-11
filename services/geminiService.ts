
import { GoogleGenAI } from "@google/genai";
import { MatchState } from "../types";

export const generateCommentary = async (match: MatchState): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    You are a professional cricket commentator. 
    Provide a very short, punchy, and exciting 1-sentence commentary on the current match state.
    
    Current Match Status:
    Team: ${match.teamName} vs ${match.opponentName}
    Score: ${match.totalRuns}/${match.wickets}
    Overs: ${match.overs}.${match.ballsInOver}
    Current Batting: ${match.players[match.strikerId].name} (${match.players[match.strikerId].runs} runs off ${match.players[match.strikerId].balls} balls)
    Recent Form: ${match.history.slice(0, 3).map(e => e.isWicket ? 'Wicket' : e.runs).join(', ')}
    
    Keep it under 20 words. Focus on the excitement of the moment.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    
    return response.text || "What a match we have on our hands today!";
  } catch (error) {
    console.error("Commentary generation failed:", error);
    return "The atmosphere is electric here at the stadium!";
  }
};

export const generateMatchReport = async (match: MatchState): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const playersStr = Object.values(match.players)
    .map(p => `${p.name}: ${p.runs} runs, ${p.wickets} wickets`)
    .join(', ');

  const prompt = `
    Summarize this cricket match as a sports journalist in 2 short paragraphs.
    Match: ${match.teamName} vs ${match.opponentName}
    Final Score: ${match.totalRuns}/${match.wickets} in ${match.overs}.${match.ballsInOver} overs.
    Player performances: ${playersStr}
    
    Focus on the top performers and the overall team effort.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    
    return response.text || "A solid performance by the team leads to a memorable match.";
  } catch (error) {
    console.error("Report generation failed:", error);
    return "Match concluded with a spirited performance from both sides.";
  }
};
