import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("APIキーが読み込めていません。");
    }

    const { message } = await req.json();

    // ★あなたの本番用データ（ここを後であなたの経歴に書き換えてください）
    const RESUME_DATA = {
      name: "あなたの名前",
      q1_background: "Webエンジニアとして3年経験があります...",
      q2_values: "ユーザー視点を大切にしています...",
      q3_motivation: "御社の技術力に惹かれました...",
      persona: "あなたは丁寧なAIアバターです。"
    };

    const systemPrompt = `
      【役割】
      ${RESUME_DATA.persona}
      【基本情報】
      [経歴]: ${RESUME_DATA.q1_background}
      [価値観]: ${RESUME_DATA.q2_values}
      [志望動機]: ${RESUME_DATA.q3_motivation}
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ★ここが修正ポイント！確実に動く「gemini-pro」を指定
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "承知いたしました。" }] },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });

  } catch (error) {
    console.error("Error:", error);
    // エラーが起きても、原因がわかるように詳細を表示し続ける設定
    return NextResponse.json({ 
      text: `⛔ エラーが発生しました ⛔\n原因: ${error.message}` 
    }, { status: 500 });
  }
}