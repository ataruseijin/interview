import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("APIキーが読み込めていません。");
    }

    const { message } = await req.json();

    // ★あなたの本番用データ（ここを後でちゃんと書き換えてください）
    const RESUME_DATA = {
      name: "あなたの名前",
      q1_background: "これまではWeb開発に従事してきました...",
      q2_values: "大切にしたい価値観は「101点のサービス」です...",
      q3_motivation: "御社のビジョンに共感しました...",
      persona: "あなたは求職者のAIアバターです。丁寧かつ熱意を持って回答してください。"
    };

    const systemPrompt = `
      【役割】
      ${RESUME_DATA.persona}

      【あなたの基本情報】
      [経歴]: ${RESUME_DATA.q1_background}
      [価値観]: ${RESUME_DATA.q2_values}
      [志望動機]: ${RESUME_DATA.q3_motivation}
    `;

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ★ここを修正！最も安定している「gemini-pro」に戻しました
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "承知いたしました。面接官様の質問にお答えします。" }] },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });

  } catch (error) {
    console.error("Error:", error);
    // エラー詳細を画面に出す（デバッグ用）
    return NextResponse.json({ 
      text: `⛔ エラーが発生しました ⛔\n${error.message}` 
    }, { status: 500 });
  }
}