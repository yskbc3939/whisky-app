import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        const { name, apiKey, model = 'gemini-2.5-flash' } = await req.json();

        if (!name) {
            return NextResponse.json({ error: 'Missing whisky name query' }, { status: 400 });
        }

        const key = apiKey || process.env.GEMINI_API_KEY;
        if (!key) {
            return NextResponse.json({ error: 'Missing Gemini API Key' }, { status: 401 });
        }

        const genAI = new GoogleGenerativeAI(key);

        const prompt = `「${name}」というウイスキーに関する詳細情報を以下のJSONフォーマットの配列で出力してください。複数の候補セットがある場合は最大3つまで出力してください。
可能な限りGoogle検索（Grounded）を使用して最新の情報を取得してください。もし検索に失敗したり制限に引っかかった場合は、あなたの内部知識のみを使って回答を作成してください。
出力は必ずJSON配列のみとし、マークダウン（\`\`\`json など）は除外してください。

【重要な言語ルール】
- name, region, caskType は必ず英語で出力してください。
- tastingNotes は必ず日本語で出力してください。
- distilledYear, bottledYear, caskNumber は数値またはコード（言語不問）。

【Whiskybase連携】
- whiskybase.com でこのウイスキーを検索し、OVERALL RATINGの数値（100点満点）と該当ページのURLを取得してください。
- 見つからない場合は両方とも空文字を返してください。

必須フィールド：
- name: ウイスキーの商品名（英語で出力）
- distilledYear: 蒸溜年（不明な場合は空文字を返すか推測）
- bottledYear: ボトリング年（不明な場合は空文字を返すか推測）
- region: 地域（英語で出力。例: Japanese, Speyside, Highland, Islay, Campbeltown 等）
- caskType: 樽タイプ（英語で出力。例: Sherry Butt, Bourbon Barrel, Mizunara 等。不明な場合は空文字）
- caskNumber: 樽番号（不明な場合は空文字）
- tastingNotes: テイスティングノート（日本語で出力。香り、味わい、余韻などの特徴）
- whiskybaseRating: Whiskybase.comのOVERALL RATING（例: "87"）。見つからない場合は空文字。
- whiskybaseUrl: Whiskybase.comの該当ウイスキーページURL（例: "https://www.whiskybase.com/whiskies/whisky/12345"）。見つからない場合は空文字。

出力例:
[
  {
    "name": "Yamazaki 12 Year Old",
    "distilledYear": "",
    "bottledYear": "",
    "region": "Japanese",
    "caskType": "Sherry Butt",
    "caskNumber": "",
    "tastingNotes": "熟した柿や桃の香り。奥行きのある甘味と厚みのある味わい。",
    "whiskybaseRating": "87",
    "whiskybaseUrl": "https://www.whiskybase.com/whiskies/whisky/12345/yamazaki-12-year-old"
  }
]`;

        let textResult = "";
        try {
            // 1. Try with Google Search Tool enabled
            const generativeModel = genAI.getGenerativeModel({
                model: model,
                tools: [{ googleSearch: {} }] as any,
            });
            const result = await generativeModel.generateContent(prompt);
            const response = await result.response;
            textResult = response.text() ? response.text().trim() : "";
        } catch (searchError) {
            console.warn("Google Search failed or restricted, falling back to internal knowledge:", searchError);

            // 2. Fallback to Internal Knowledge Mode
            const fallbackModel = genAI.getGenerativeModel({ model });
            const result = await fallbackModel.generateContent(prompt);
            const response = await result.response;
            textResult = response.text() ? response.text().trim() : "";
        }

        // Attempt to parse JSON
        let candidates = [];
        try {
            // Clean markdown just in case the model ignores the instruction
            const cleanedText = textResult.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
            candidates = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse JSON result:", textResult);
            return NextResponse.json({ error: 'Failed to parse AI response into JSON', rawText: textResult }, { status: 500 });
        }

        return NextResponse.json({ candidates });
    } catch (error: any) {
        console.error('Search error:', error);
        return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
    }
}
