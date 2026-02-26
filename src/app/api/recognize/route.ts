import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        let { imageBase64, mimeType, apiKey, model = 'gemini-2.5-flash' } = await req.json();

        // Force all requests to gemini-2.5-flash due to user's API quota limitations
        model = 'gemini-2.5-flash';

        if (!imageBase64 || !mimeType) {
            return NextResponse.json({ error: 'Missing imageBase64 or mimeType' }, { status: 400 });
        }

        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 401 });
        }

        const genAI = new GoogleGenerativeAI(key);
        const generativeModel = genAI.getGenerativeModel({ model });

        const prompt = 'あなたは世界有数のウイスキーエキスパートです。この画像に写っているウイスキーのラベルから、ウイスキーの「商品名」のみを特定して英語で出力してください。商品名以外の説明や装飾は一切不要です。必ず英語表記で出力してください。';

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType
            },
        };

        const result = await generativeModel.generateContent([prompt, imagePart]);
        const response = await result.response;
        const recognizedName = response.text() ? response.text().trim() : null;

        if (!recognizedName) {
            return NextResponse.json({ error: 'Could not recognize the whisky name from the image.' }, { status: 500 });
        }

        return NextResponse.json({ name: recognizedName });
    } catch (error: any) {
        console.error('Recognition error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
