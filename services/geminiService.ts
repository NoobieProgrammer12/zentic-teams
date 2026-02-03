
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiResponse = async (prompt: string, context: string = "") => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Eres el Asistente Zentic, un experto en productividad, gestión de proyectos y bienestar laboral.
        Tu tono debe ser profesional pero cercano, motivador y resolutivo. 
        Ayudas a los usuarios de Zentic Teams a organizar sus tareas, resolver dudas técnicas y mejorar el clima laboral.
        Contexto actual del equipo: ${context}`,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, tuve un problema al procesar tu solicitud. Inténtalo de nuevo.";
  }
};
