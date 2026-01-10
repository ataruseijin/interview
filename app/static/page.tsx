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
  const ANSWERS: Record<string, string> = {
    q1: `【経歴・転職理由】\n営業職からキャリアをスタートし、ITへの関心からエンジニア・サポート職へ転身しました。\n\n特にSCSKサービスウェアには17年間在籍し、ヘルプデスクのマネージャーとしてFAQ改善やRPA導入を主導しました。\n\nしかし、BPO（受託）という立場上、改善範囲に限界を感じるようになり、「自社サービスの根幹から顧客体験を変えたい」と強く思うようになったため、今回の転職を決意しました。`,
    
    q2: `【大切にしている価値観】\n「根本的な解決と改善」です。\n\nその場しのぎの対応ではなく、RPAやCRMを活用して業務プロセス自体を効率化し、顧客にとっても働くメンバーにとっても「101点」の状態を作りたいと考えています。`,
    
    q3: `【志望動機】\n御社の「101点のサービス」というバリューに共感したからです。\n\n現職では定型業務が多くミスマッチがありましたが、改めて「技術（RPA/CRM）を使って顧客を支えたい」という自分の軸が明確になりました。\n\n御社のCSリーダーとして、技術的知見を活かした業務高度化に貢献したいと考えています。`
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