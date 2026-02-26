import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
    try {
        let { imageBase64, mimeType, apiKey, model = 'gemini-1.5-flash-latest' } = await req.json();

        // Normalize model names to avoid 404 errors from older client local storage
        if (model === 'gemini-1.5-flash') model = 'gemini-1.5-flash-latest';
        if (model === 'gemini-1.5-pro') model = 'gemini-1.5-pro-latest';

        if (!imageBase64 || !mimeType) {
            return NextResponse.json({ error: 'Missing imageBase64 or mimeType' }, { status: 400 });
        }

        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 401 });
        }

        const ai = new GoogleGenAI({ apiKey: key });

        // The prompt explicitly asks ONLY for the whisky name.
        const prompt = 'あなたは世界有数のウイスキーエキスパートです。この画像に写っているウイスキーのラベルから、ウイスキーの「商品名」のみを特定して出力してください。商品名以外の説明や装飾は一切不要です。';

        const response = await ai.models.generateContent({
            model: model,
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: mimeType,
                            }
                        }
                    ]
                }
            ]
        });

        const recognizedName = response.text ? response.text.trim() : null;

        if (!recognizedName) {
            return NextResponse.json({ error: 'Could not recognize the whisky name from the image.' }, { status: 500 });
        }

        return NextResponse.json({ name: recognizedName });
    } catch (error: any) {
        console.error('Recognition error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
