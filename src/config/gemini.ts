import 'server-only';
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

// ATENȚIE: Cheia este stocată aici conform cerinței. Acest fișier este server-only.
const GEMINI_API_KEY = 'AIzaSyBQtb4PTT0TqZqQBnG8AtR9wkmOZc83rw8';

export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

/**
 * Returnează un model Gemini configurat. Fișier server-only (nu îl importa în client).
 */
export function getGeminiModel(modelName: string = DEFAULT_GEMINI_MODEL): GenerativeModel {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: modelName });
} 