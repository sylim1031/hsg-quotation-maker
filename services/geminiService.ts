
import { GoogleGenAI, Type } from "@google/genai";
import { MasterItem } from "../types";

export const analyzeQuotationContext = async (userInput: string, masterItems: MasterItem[]) => {
  // Always create a new GoogleGenAI instance inside the function to ensure the correct context/API key usage.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const masterItemsDescription = masterItems.map(item => 
    `- ID: ${item.id}\n  Name: ${item.name}\n  Units: [${item.units.join(', ')}]\n  Description: ${item.description || 'No description provided'}`
  ).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following business context and suggest quotation line items based on the provided master data list.
    
    Context: "${userInput}"
    
    Master Items (Important: Refer to the specific 'Units' list for each item):
    ${masterItemsDescription}
    
    Rules:
    1. Extract relevant items from the master list.
    2. For each item, provide exactly as many values in 'unitValues' as there are 'Units' defined for that item.
    3. For example, if an item has Units: ['부', '종'], 'unitValues' must be an array of 2 numbers (e.g., [100, 2]).
    4. If an item has only 1 Unit: ['일'], 'unitValues' must be an array of 1 number (e.g., [3]).
    5. Provide a brief note explaining the logic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            itemId: { type: Type.STRING, description: 'The ID from the master list' },
            unitValues: { 
              type: Type.ARRAY, 
              items: { type: Type.NUMBER },
              description: 'Array of quantities corresponding to the defined units of the item' 
            },
            notes: { type: Type.STRING, description: 'Reasoning for this line item' },
          },
          required: ["itemId", "unitValues", "notes"],
        },
      },
    },
  });

  try {
    // The text property returns the generated string output. Do not call it as a method text().
    const text = response.text?.trim() || '[]';
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI response:", e);
    return [];
  }
};
