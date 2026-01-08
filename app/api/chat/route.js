import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 【デバッグ1】APIキーが読み込めているかチェック
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("【致命的エラー】APIキーが読み込めていません。VercelのEnvironment Variables設定を確認してください。");
    }

    const { message } = await req.json();

    // ★ここはご自身のデータに書き換えてOKです（そのままでも動きます）
    const RESUME_DATA = {
      persona: "あなたは優秀なエンジニアです。デバッグを手伝ってください。"
    };

    const systemPrompt = `
      あなたはAIアバターです。以下の設定で回答してください。
      ${RESUME_DATA.persona}
    `;

    // Gemini API呼び出し
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 【デバッグ2】モデル名を最新の軽量モデルに変更してみる（gemini-proだと不安定な場合があるため）
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "デバッグモードで起動しました。" }] },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });

  } catch (error) {
    console.error("詳細エラー:", error);
    
    // 【デバッグ3】エラーの正体を隠さず画面に返す
    // オブジェクトの内容も文字列化して表示
    const errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
    
    return NextResponse.json({ 
      text: `⛔ エラーが発生しました ⛔\n\n【原因】\n${error.message}\n\n【詳細ログ】\n${errorDetails}` 
    }, { status: 500 });
  }
}