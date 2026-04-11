"use client";
import { useState, useRef, useEffect, FormEvent } from "react";

// メッセージの型定義
type Message = {
  role: "bot" | "user";
  text: string;
};

export default function Home() {
  // 初期メッセージを具体的なものに変更
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "bot", 
      text: "こんにちは！大森裕貴のAIアバターです。<br>職務経歴書と履歴書に基づき、経歴や志望動機についてお答えします。" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]); // isLoadingの変化時もスクロール

  // メッセージ送信処理（共通化）
  const postMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // ユーザーのメッセージを追加
    setMessages((prev) => [...prev, { role: "user", text: text }]);
    setInput(""); // 入力欄クリア
    setIsLoading(true);

    try {
      // エンドポイントはご自身の環境に合わせてください (例: /api/chat または /api/gemini)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      
      if (!res.ok) throw new Error("API Error");

      const data = await res.json();
      
      // バックエンドからの改行コード(\n)を<br>に変換（HTML表示用）
      // ※バックエンドが既にHTMLを返している場合は、この置換は不要または調整してください
      const formattedText = data.text; //.replace(/\n/g, "<br />");

      setMessages((prev) => [...prev, { role: "bot", text: formattedText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", text: "すみません、エラーが発生しました。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // フォーム送信ハンドラ
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    postMessage(input);
  };

  // クイック質問ボタン（即時送信するように変更）
  const handleQuickAsk = (text: string) => {
    postMessage(text);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>AI回答モード（β版）</h1>
        <p style={{fontSize: '0.8rem', opacity: 0.8}}>大森 裕貴のVirtual Agent</p>
      </header>

      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.messageRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            {/* HTMLタグ（表や太字）を有効にするために dangerouslySetInnerHTML を使用 */}
            <div 
              style={msg.role === "user" ? styles.userBubble : styles.botBubble}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
        {isLoading && (
          <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
             <div style={{...styles.botBubble, color: "#888", fontStyle: "italic"}}>
                回答を生成中...
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <p style={styles.guideText}>よくある質問：</p>
        <div style={styles.suggestArea}>
          <button style={styles.suggestBtn} onClick={() => handleQuickAsk("これまでご経験されている会社の入社理由・転職理由（今回含）を差し支えのない範囲で出来る限り詳しく教えてください。")}>
            入社理由・転職理由
          </button>
          <button style={styles.suggestBtn} onClick={() => handleQuickAsk("次の会社での必要最低条件を教えてください。業種・職種・給与という観点から、ご自身が大切にしたい価値観なども含め、出来る限りその背景も含めて教えていただけますでしょうか。")}>
            次の会社での必要最低条件
          </button>
          <button style={styles.suggestBtn} onClick={() => handleQuickAsk("当社へご興味を持っていただいている点を教えてください。")}>
            興味を持っている点
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="自由に質問を入力してください..."
            disabled={isLoading}
          />
          <button type="submit" style={styles.sendBtn} disabled={isLoading}>
            送信
          </button>
        </form>
      </div>
    </div>
  );
}

// スタイルの型定義
const styles: { [key: string]: React.CSSProperties } = {
  container: { maxWidth: "600px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif", backgroundColor: "#f4f4f9" },
  header: { padding: "15px", backgroundColor: "#333", color: "#fff", textAlign: "center" },
  
  chatArea: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" },
  messageRow: { display: "flex", width: "100%" },
  
  // ユーザーの吹き出し
  userBubble: { backgroundColor: "#0070f3", color: "#fff", padding: "12px 16px", borderRadius: "18px 18px 0 18px", maxWidth: "85%", lineHeight: "1.6", fontSize: "0.95rem", wordBreak: "break-word" },
  
  // ボットの吹き出し（白背景・HTML対応）
  botBubble: { backgroundColor: "#fff", color: "#333", padding: "12px 16px", borderRadius: "18px 18px 18px 0", maxWidth: "90%", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", lineHeight: "1.6", fontSize: "0.95rem", wordBreak: "break-word" },
  
  loading: { fontSize: "0.8rem", color: "#888", marginLeft: "10px" },
  
  inputArea: { padding: "15px", backgroundColor: "#fff", borderTop: "1px solid #ddd" },
  guideText: { fontSize: "0.8rem", color: "#666", marginBottom: "8px", fontWeight: "bold" },
  
  suggestArea: { display: "flex", gap: "8px", marginBottom: "12px", overflowX: "auto", paddingBottom: "5px", scrollbarWidth: "none" },
  suggestBtn: { padding: "6px 14px", borderRadius: "20px", border: "1px solid #0070f3", color: "#0070f3", background: "#f0f8ff", cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap", flexShrink: 0 },
  
  form: { display: "flex", gap: "10px" },
  input: { flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", outline: "none" },
  sendBtn: { padding: "0 20px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", transition: "opacity 0.2s" },
};