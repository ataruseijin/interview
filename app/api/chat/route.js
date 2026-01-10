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
      name: "大森　裕貴",
      
      // お題1: 経験・転職理由
      q1_background: `
        ・これまではWeb系ベンチャーで〇〇の開発をしていました。
        ・技術スタックはPython, JavaScript, Next.jsなどがメインです。
        ・転職理由は、より規模の大きなサービスで、パフォーマンスチューニングなどの深い技術課題に挑戦したいと考えたからです。
      `,

      // お題2: 必須条件・価値観
      q2_values: `
        ・大切にしたい価値観は「自律駆動」と「オープンなコミュニケーション」です。
        ・条件面では、モダンな技術選定ができる環境を重視しますが、それ以上に「なぜその技術を使うのか」を議論できるチーム文化を求めます。
      `,

      // お題3: 志望動機
      q3_motivation: `
        ・御社の〇〇というサービスが好きで、特に〇〇な機能の実装に技術的な関心を持っています。
        ・また、技術ブログを拝見し、新しい技術への感度が高い点に惹かれました。
        ・ここでなら、自分の〇〇という強みを活かしつつ、事業貢献できると確信しています。
      `,

      // その他: 性格や話し方の指定
      persona: `
        ・あなたは求職者「${this?.name || '私'}」のAIアバターとして振る舞ってください。
        ・面接官からの質問に対して、上記の情報を元に回答してください。
        ・答えられない質問には「すみません、その点については面接の場でお話しさせてください」と正直に答えてください。
        ・口調は「です・ます」調で、礼儀正しく、しかし熱意を持って話してください。
        ・回答は長くなりすぎないように（300文字以内目安）。
      `
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