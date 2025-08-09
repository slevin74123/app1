import { NextResponse } from 'next/server';
import { getGeminiModel, DEFAULT_GEMINI_MODEL } from '@/config/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ success: false, error: 'Prompt invalid.' }, { status: 400 });
    }

    const generativeModel = getGeminiModel(model ?? DEFAULT_GEMINI_MODEL);

    const result = await generativeModel.generateContent(prompt);
    const text = result?.response?.text?.() ?? '';

    return NextResponse.json({ success: true, data: { text } });
  } catch (error) {
    const message = (error as Error)?.message ?? 'Eroare necunoscută la Gemini';
    console.error('Gemini API error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
} 