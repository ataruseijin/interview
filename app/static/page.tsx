// app/static/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "bot" | "user"; text: string };

export default function StaticPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "こんにちは！こちらは「静的回答モード」です。\n私の経歴や志望動機について、事前に用意した回答をご覧いただけます。" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ★ここが「完璧な回答」のデータです
// ★表の内容を反映した回答データ
  const ANSWERS: Record<string, string> = {
    q1: `【これまでの経歴と転職理由】
表形式で簡潔にお伝えします。

1. **株式会社ネクサス**（営業）
社会人としての基礎スキルを身につけるため、未経験から営業職に挑戦しました。

2. **NTTマーケティングアクト**（営業）
光ファイバーの普及に携わる中でIT技術そのものへの関心が強くなり、「技術で顧客を支えたい」と考え転職しました。

3. **有限会社クレオネット**（キッティング）
ITインフラの基礎やハードウェア知識を現場で叩き上げ、次のステップとしてよりユーザーに近いヘルプデスク業務を目指しました。

4. **SCSKサービスウェア株式会社**（BPO/ヘルプデスク）
17年間在籍。マネージャーとしてFAQ改善やRPA導入を主導しましたが、BPOという立場上、改善がクライアントの決定範囲内に留まることに限界を感じ、「自社の一員として根幹から改善したい」と考えるようになりました。

5. **キャリアリンク株式会社**（BPO/DX推進）
DX推進というテーマに共感し入社しましたが、実際の業務が定型的な事務処理管理中心で、強みである「RPAやデータ活用」と乖離があったため、早期に環境を変える決断をしました。`,
    
    q2: `【大切にしている価値観・必須条件】
大切にしているのは「実効性のある業務改善」です。

直近の経験から、次の会社では以下の点を重視しています。
・「RPA」や「CRM」などのITツール活用が歓迎される環境であること。
・泥臭い現場対応だけでなく、データに基づいた仕組み化や効率化が評価されること。
・御社の「101点のサービス」のように、言われたこと以上の付加価値（改善提案）を出せる風土であること。`,
    
    q3: `【志望動機】
「ITスキルを活かして顧客体験と業務効率を同時に向上させたい」という私の軸が、御社の環境でこそ実現できると考えたからです。

前職ではスキルのミスマッチがありましたが、その分「自分が本当に貢献できるのはITを活用した改善フェーズだ」と再確認できました。

御社のCSリーダーとして、SCSK時代に培ったマネジメント力と、技術的な改善スキル（RPA/CRM）を掛け合わせ、顧客満足度を高める仕組みを作りたいと考えています。`
  };

  const handleAsk = (key: string, questionText: string) => {
    // ユーザーの質問を表示
    setMessages(prev => [...prev, { role: "user", text: questionText }]);
    
    // ちょっとだけ考えてる風の間を入れる
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: ANSWERS[key] }]);
    }, 600);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Interview Chatbot (Static)</h1>
        <Link href="/" style={styles.backLink}>← TOPへ戻る</Link>
      </header>

      <div style={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...styles.messageRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={msg.role === "user" ? styles.userBubble : styles.botBubble}>
              {msg.text.split("\n").map((t, idx) => <div key={idx} style={{minHeight: '1em'}}>{t}</div>)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <p style={styles.guide}>質問を選択してください：</p>
        <div style={styles.buttonContainer}>
          <button style={styles.optionBtn} onClick={() => handleAsk("q1", "これまでの経歴と転職理由は？")}>
            1. 経歴・転職理由
          </button>
          <button style={styles.optionBtn} onClick={() => handleAsk("q2", "大切にしている価値観は？")}>
            2. 価値観・必須条件
          </button>
          <button style={styles.optionBtn} onClick={() => handleAsk("q3", "志望動機は？")}>
            3. 志望動機
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: "600px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif", backgroundColor: "#f4f4f9" },
  header: { padding: "15px", backgroundColor: "#2c3e50", color: "#fff", textAlign: "center", position: "relative" },
  backLink: { position: "absolute", left: "15px", top: "15px", color: "#fff", textDecoration: "none", fontSize: "0.9rem" },
  chatArea: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" },
  messageRow: { display: "flex" },
  userBubble: { backgroundColor: "#0070f3", color: "#fff", padding: "12px 16px", borderRadius: "18px 18px 0 18px", maxWidth: "85%", lineHeight: "1.6", fontSize: "0.95rem" },
  botBubble: { backgroundColor: "#fff", color: "#333", padding: "12px 16px", borderRadius: "18px 18px 18px 0", maxWidth: "85%", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", lineHeight: "1.6", fontSize: "0.95rem", whiteSpace: "pre-wrap" },
  inputArea: { padding: "20px", backgroundColor: "#fff", borderTop: "1px solid #ddd" },
  guide: { textAlign: "center", color: "#666", marginBottom: "10px", fontSize: "0.9rem" },
  buttonContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  optionBtn: { padding: "12px", backgroundColor: "#fff", color: "#0070f3", border: "1px solid #0070f3", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold", transition: "0.2s" },
};