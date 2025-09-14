import { GoogleGenAI, Type } from "@google/genai";
import type { AiSummary, Patient } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateClinicalSummary(patientData: Patient): Promise<AiSummary> {
  const model = "gemini-2.5-flash";
  
  // Omit fields that are not relevant for a clinical summary to save tokens
  const { avatarUrl, ...clinicalData } = patientData;

  const prompt = `
    You are a helpful clinical assistant AI. Your role is to provide a concise, structured summary of a patient's record for a busy clinician in a Kenyan hospital.
    Analyze the provided patient data and generate a clinical summary.
    The summary should be brief and to the point.
    Identify the most critical clinical concerns.
    Suggest actionable next steps appropriate for the context.

    Patient Data:
    ${JSON.stringify(clinicalData, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A brief, one-paragraph clinical summary of the patient's current status.",
            },
            keyConcerns: {
              type: Type.ARRAY,
              description: "A list of the most important clinical concerns or risks.",
              items: { type: Type.STRING },
            },
            suggestedActions: {
              type: Type.ARRAY,
              description: "A list of recommended next steps, such as specific tests, referrals, or medication adjustments.",
              items: { type: Type.STRING },
            },
          },
          required: ["summary", "keyConcerns", "suggestedActions"],
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI model.");
    }
    
    // Safely parse and validate the JSON
    const parsedResponse = JSON.parse(jsonText);

    if (
        typeof parsedResponse.summary !== 'string' ||
        !Array.isArray(parsedResponse.keyConcerns) ||
        !Array.isArray(parsedResponse.suggestedActions)
    ) {
        console.error("Invalid AI response structure:", parsedResponse);
        throw new Error("The AI model returned data in an unexpected format. Please try again.");
    }

    return parsedResponse as AiSummary;

  } catch (error) {
    console.error("Error generating clinical summary:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error) {
        if (error.message.includes('json') || error.message.includes('format')) {
             throw new Error("The AI model returned an invalid format. Please try again.");
        }
         throw new Error(`An AI API error occurred: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI model.");
  }
}