import { GoogleGenAI, Type } from "@google/genai";
import { StockRecommendation } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';

/**
 * Feature 1 & 2: Analyze user interest and provide market overview + recommendations.
 * Uses Google Search Grounding for real-time data.
 */
export const getMarketAnalysis = async (userInterest: string): Promise<{ analysis: string, recommendations: StockRecommendation[] }> => {
  try {
    const prompt = `
      The user is interested in: "${userInterest}".
      1. Provide a concise "Market of the Day" summary relevant to this interest using real-time data.
      2. Recommend 3 specific stocks or ETFs that fit this interest today.
      
      Format the output as a JSON object with two keys:
      - "analysis": string (The market summary)
      - "recommendations": array of objects with keys: symbol, name, reason, riskLevel (Low/Medium/High).
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable grounding
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysis: { type: Type.STRING },
                recommendations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            symbol: { type: Type.STRING },
                            name: { type: Type.STRING },
                            reason: { type: Type.STRING },
                            riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
                        }
                    }
                }
            }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Market Analysis Error:", error);
    // Fallback if search fails or limit reached
    return {
      analysis: "Unable to fetch real-time market data at the moment. However, general market sentiment for this sector remains volatile.",
      recommendations: [
        { symbol: "SPY", name: "SPDR S&P 500", reason: "General market exposure", riskLevel: "Medium" }
      ]
    };
  }
};

/**
 * Feature 5: Analyze a specific trade (Coach).
 */
export const analyzeTradePerformance = async (ticker: string, entry: number, exit: number, direction: string, notes: string): Promise<string> => {
  try {
    const prompt = `
      Analyze this trade:
      Ticker: ${ticker}
      Direction: ${direction}
      Entry: ${entry}
      Exit: ${exit}
      User Notes: ${notes}

      Calculate the P&L percentage.
      Explain if this was a profitable trade mechanically.
      Provide 3 brief bullet points on what factors typically influence this stock (sector, volatility).
      Be a "tough love" trading coach.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    return response.text || "Could not analyze trade.";
  } catch (error) {
    console.error("Trade Analysis Error:", error);
    return "Error analyzing trade. Please try again.";
  }
};

/**
 * Feature 6: Company Intelligence Chat.
 * Uses Search Grounding.
 */
export const getCompanyIntelligence = async (query: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  try {
    // We construct a chat history for context
    const chat = ai.chats.create({
      model: MODEL_FAST,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a specialized financial analyst AI. Provide detailed, data-backed answers about companies, earnings, and news. Always cite sources if possible.",
      },
      history: history.map(h => ({ role: h.role, parts: h.parts })),
    });

    const result = await chat.sendMessage({ message: query });
    return result.text || "I couldn't find information on that company.";
  } catch (error) {
    console.error("Company Intel Error:", error);
    return "Sorry, I am having trouble connecting to the market data right now.";
  }
};

/**
 * Feature 3: Backtest Logic (Simulated by AI for the sake of the demo, 
 * as real backtesting requires massive historical datasets).
 */
export const runBacktestSimulation = async (strategyDescription: string): Promise<{ summary: string, dataPoints: number[] }> => {
  try {
    const prompt = `
      Simulate a backtest for the following trading strategy: "${strategyDescription}".
      Generate a realistic generic profit/loss curve for 30 days based on the nature of this strategy.
      
      Return JSON:
      {
        "summary": "A brief 2 sentence analysis of why this strategy worked or failed in the simulation.",
        "dataPoints": [Array of 30 numbers representing cumulative portfolio value starting at 10000]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No data");
  } catch (error) {
    // Fallback mock
    return {
        summary: "Simulation offline. Showing linear growth fallback.",
        dataPoints: Array.from({length: 30}, (_, i) => 10000 + (i * 100))
    };
  }
};
