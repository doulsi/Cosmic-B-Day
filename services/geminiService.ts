
import { GoogleGenAI, Type } from "@google/genai";
import { NASAData, CosmicReading } from "../types";

export const generateCosmicReading = async (nasaData: NASAData, birthDate: string): Promise<CosmicReading> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Based on this NASA Astronomy Picture of the Day from the user's "Cosmic Birthday":
    Title: ${nasaData.title}
    Explanation: ${nasaData.explanation}
    Birth Date: ${birthDate}

    Generate a poetic, uplifting cosmic birthday reading. 
    The tone should be wonder-filled and slightly astrological but scientifically grounded in the image description.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: {
            type: Type.STRING,
            description: "A 2-3 sentence poetic reading relating the astronomical image to the user's destiny."
          },
          starSign: {
            type: Type.STRING,
            description: "The zodiac sign for the birth date."
          },
          luckyConstellation: {
            type: Type.STRING,
            description: "A constellation mentioned in or relevant to the image or the sign."
          }
        },
        required: ["message", "starSign", "luckyConstellation"]
      }
    }
  });

  try {
    const json = JSON.parse(response.text || '{}');
    return {
      message: json.message || "The stars aligned perfectly on the day you were born.",
      starSign: json.starSign || "Cosmic Voyager",
      luckyConstellation: json.luckyConstellation || "The Milky Way"
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      message: "The universe whispers its secrets in silence. Your birth was a significant event in the cosmic calendar.",
      starSign: "Astral Being",
      luckyConstellation: "Orion"
    };
  }
};
