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
      name: "あなたの名前", // ※必要に応じて変更してください
      
      // お題1: 経験・転職理由（キャリアストーリー）
      q1_background: `
        【キャリアの概要】
        営業職からスタートし、IT技術への関心の高まりと共にエンジニア・サポート職へ転身しました。
        特に「SCSKサービスウェア」には17年間在籍し、ヘルプデスクのリーダー・マネージャーとして、FAQ改善やRPA導入などの業務改善を主導してきました。

        【詳細な経歴】
        1. 株式会社ネクサス（営業）: 社会人としての基礎を構築。
        2. NTTマーケティングアクト: 通信回線の営業を通じ、IT技術そのものへ興味を持ち転身を決意。
        3. 有限会社クレオネット: キッティング業務でITインフラ・ハードウェアの基礎を叩き上げました。
        4. SCSKサービスウェア: 17年間在籍。テクニカルサポートから開始し、マネージャーへ昇格。現場改善（RPA導入など）で実績を上げましたが、「BPO（受託）」という立場の限界を感じ、「自社サービスの根幹から改善したい」と考えるようになりました。
        5. キャリアリンク（現職）: DX推進を志し入社しましたが、実際の業務が定型処理管理中心で、自身の強みである「ITツール活用・データ改善」とかけ離れていたため、早期の転職を決意しました。
      `,

      // お題2: 必須条件・価値観
      q2_values: `
        【大切にしている価値観】
        「根本的な解決と改善」です。
        BPO時代に感じた「決められた範囲でしか改善できないもどかしさ」を払拭し、サービスの当事者として、システムや業務フローの根幹から顧客体験を向上させたいと考えています。

        【必須条件】
        ・「RPA」や「CRM」などのITスキルを活かし、泥臭い業務改善だけでなく、仕組み化による効率化が評価される環境。
        ・御社の「101点のサービス」のように、期待値を超えた提案が歓迎される風土。
      `,

      // お題3: 志望動機
      q3_motivation: `
        【なぜ御社か】
        今回紹介を受け、御社であれば私の最大の強みである「ITスキルを用いたサポート業務の高度化（RPA/CRM活用）」が最大限に活かせると確信したからです。
        
        現職ではミスマッチがありましたが、その分「自分が本当にやりたいこと（技術で顧客を支え、業務を効率化する）」が明確になりました。
        CSリーダーとして、単なる問い合わせ対応に留まらず、技術的な知見を活かして開発部門へのフィードバックや業務プロセスの自動化を推進し、顧客満足度と生産性の両方を向上させたいと考えています。
      `,

      // AIの人格設定
      persona: `
        ・あなたは求職者である私のAIアバターです。
        ・面接官（シナジーマーケティング株式会社）に対し、丁寧かつ論理的に回答してください。
        ・特に「SCSKでの17年の実績」は自信を持ってアピールしてください。
        ・前職（キャリアリンク）の短期離職については、「明確なスキルのミスマッチと、やりたいことの再確認ができた前向きな決断」であると伝えてください。
        ・口調は「～と考えております」「～という経験がございます」など、落ち着いたビジネスマンのトーンで話してください。
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