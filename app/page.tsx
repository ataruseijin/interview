// app/page.js
"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "こんにちは！私はAIアバターです。私の経歴や志望動機について、何でも聞いてください。" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.text }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "エラーが発生しました。" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // よくある質問ボタンのクリックハンドラ
  const handleQuickAsk = (text) => {
    setInput(text);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>AI Interview Avatar</h1>
        <p style={{fontSize: '0.8rem', opacity: 0.8}}>Generative AI Powered</p>
      </header>

      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.messageRow, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={msg.role === "user" ? styles.userBubble : styles.botBubble}>
              {msg.text.split("\n").map((t, i) => <div key={i}>{t}</div>)}
            </div>
          </div>
        ))}
        {isLoading && <div style={styles.loading}>AIが入力中...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        {/* サジェストボタン */}
        <div style={styles.suggestArea}>
          <button style={styles.suggestBtn} onClick={() => handleQuickAsk("転職理由を教えて")}>転職理由</button>
          <button style={styles.suggestBtn} onClick={() => handleQuickAsk("大切にしている価値観は？")}>価値観</button>
          <button style={styles.suggestBtn} onClick={() => handleQuickAsk("なぜこの会社を志望したの？")}>志望動機</button>
        </div>

        <form onSubmit={sendMessage} style={styles.form}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="自由に質問を入力してください..."
          />
          <button type="submit" style={styles.sendBtn} disabled={isLoading}>
            送信
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif", backgroundColor: "#f4f4f9" },
  header: { padding: "15px", backgroundColor: "#333", color: "#fff", textAlign: "center" },
  chatArea: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" },
  messageRow: { display: "flex" },
  userBubble: { backgroundColor: "#0070f3", color: "#fff", padding: "10px 15px", borderRadius: "15px 15px 0 15px", maxWidth: "80%", lineHeight: "1.5" },
  botBubble: { backgroundColor: "#fff", color: "#333", padding: "10px 15px", borderRadius: "15px 15px 15px 0", maxWidth: "80%", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", lineHeight: "1.5" },
  loading: { fontSize: "0.8rem", color: "#888", marginLeft: "10px" },
  inputArea: { padding: "15px", backgroundColor: "#fff", borderTop: "1px solid #ddd" },
  suggestArea: { display: "flex", gap: "10px", marginBottom: "10px", overflowX: "auto", paddingBottom: "5px" },
  suggestBtn: { padding: "5px 12px", borderRadius: "20px", border: "1px solid #0070f3", color: "#0070f3", background: "none", cursor: "pointer", fontSize: "0.8rem", whiteSpace: "nowrap" },
  form: { display: "flex", gap: "10px" },
  input: { flex: 1, padding: "12px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "1rem" },
  sendBtn: { padding: "0 20px", backgroundColor: "#0070f3", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
};