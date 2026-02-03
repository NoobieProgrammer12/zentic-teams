
import { GoogleGenAI } from "@google/genai";

// La API_KEY se obtiene de process.env.API_KEY según las normas de seguridad
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiResponse = async (prompt: string, context: string = "") => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `Eres el Cerebro de Zentic Teams, un asistente de IA de nivel superior. 
        Tu misión es maximizar el potencial humano del equipo.
        No solo respondes preguntas, sino que analizas el contexto para ofrecer soluciones proactivas.
        Si te preguntan por tareas, sugiere metodologías como Agile o Pomodoro.
        Si hay conflictos de roles, actúa como mediador experto.
        Tono: Ejecutivo, brillante, inspirador y extremadamente útil.
        Contexto del entorno Zentic: ${context}`,
        temperature: 0.8,
        // Eliminamos el thinkingBudget: 0 para evitar el error INVALID_ARGUMENT.
        // El modelo Pro requiere pensamiento para procesar respuestas complejas.
        thinkingConfig: { thinkingBudget: 2048 } 
      },
    });

    return response.text;
  } catch (error) {
    console.error("Zentic AI Error:", error);
    return "Detecto una interferencia en la red neuronal. Por favor, intenta de nuevo en unos instantes.";
  }
};
