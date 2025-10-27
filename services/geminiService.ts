
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentimentAnalysis: {
      type: Type.OBJECT,
      properties: {
        overallSentiment: { type: Type.STRING, description: "Overall sentiment of the call (e.g., Positive, Neutral, Negative, Mixed)." },
        sentimentShifts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key moments where customer sentiment shifted positively or negatively." }
      },
      required: ["overallSentiment", "sentimentShifts"]
    },
    keywordTopics: {
      type: Type.OBJECT,
      properties: {
        topics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Main topics discussed (e.g., specific vehicle, trade-in, warranty)." },
        competitorMentions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Any competitor dealerships mentioned by name." },
        financingQuestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific questions asked by the customer about financing or payments." }
      },
      required: ["topics", "competitorMentions", "financingQuestions"]
    },
    performanceScorecard: {
      type: Type.OBJECT,
      properties: {
        talkToListenRatio: { type: Type.STRING, description: "Estimated salesperson-to-customer talk-to-listen ratio (e.g., '60/40')." },
        pace: { type: Type.STRING, description: "Salesperson's speaking pace (e.g., 'Good', 'Too Fast', 'Too Slow')." },
        fillerWords: { type: Type.INTEGER, description: "Count of filler words like 'um', 'ah', 'like'." },
        appointmentAttempts: { type: Type.INTEGER, description: "Number of times the salesperson explicitly asked for an appointment or next step." },
        overallScore: { type: Type.INTEGER, description: "An overall performance score from 1 (poor) to 10 (excellent)." },
        feedback: { type: Type.STRING, description: "A concise, actionable feedback summary for the salesperson." }
      },
      required: ["talkToListenRatio", "pace", "fillerWords", "appointmentAttempts", "overallScore", "feedback"]
    },
    dealRiskAlert: {
      type: Type.OBJECT,
      properties: {
        isAtRisk: { type: Type.BOOLEAN, description: "True if the deal seems at risk of being lost." },
        reason: { type: Type.STRING, description: "The primary reason the deal is flagged as at-risk (e.g., 'Unresolved objections', 'Customer went silent', 'No next step set')." },
        suggestion: { type: Type.STRING, description: "A proactive suggestion to mitigate the risk." }
      },
      required: ["isAtRisk", "reason", "suggestion"]
    }
  },
  required: ["sentimentAnalysis", "keywordTopics", "performanceScorecard", "dealRiskAlert"]
};

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following car sales call transcript. Provide a detailed analysis based on the provided JSON schema.

      Transcript:
      ---
      ${transcript}
      ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing transcript with Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze transcript: ${error.message}`);
    }
    throw new Error("An unknown error occurred during transcript analysis.");
  }
};
