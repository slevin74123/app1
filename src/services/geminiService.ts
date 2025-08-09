export interface AskGeminiOptions {
  model?: string;
}

export interface AskGeminiSuccess {
  success: true;
  data: { text: string };
}

export interface AskGeminiError {
  success: false;
  error: string;
}

export type AskGeminiResponse = AskGeminiSuccess | AskGeminiError;

export async function askGemini(prompt: string, options: AskGeminiOptions = {}): Promise<AskGeminiResponse> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, ...options })
    });

    return (await res.json()) as AskGeminiResponse;
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
} 