"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "bot" | "user"; text: string };

export default function StaticPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "こんにちは！こちらは「静的回答モード」です。<br>私の経歴や志望動機について、事前に用意した回答をご覧いただけます。" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ★画像の内容を一言一句変えずにHTMLテーブル化
  const ANSWERS: Record<string, string> = {
    q1: `【経験した会社の入社理由・転職理由】
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 500px;">
          <thead>
            <tr style="background-color: #f2f2f2; text-align: left;">
              <th style="border: 1px solid #ddd; padding: 8px; width: 20%;">会社名</th>
              <th style="border: 1px solid #ddd; padding: 8px; width: 40%;">入社理由</th>
              <th style="border: 1px solid #ddd; padding: 8px; width: 40%;">転職理由</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">株式会社ネクサス</td>
              <td style="border: 1px solid #ddd; padding: 8px;">飲食店のアルバイト経験のみだったため、未経験から営業職に挑戦することで、社会人としての基礎スキルを身につけたいと考え入社しました。</td>
              <td style="border: 1px solid #ddd; padding: 8px;">取り扱っていた通信サービス（ADSL等）の市場縮小に伴い、将来性への不安を感じました。より需要のある商材や技術に携わりたいと考え、転職を決意しました。</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">NTTマーケティングアクト</td>
              <td style="border: 1px solid #ddd; padding: 8px;">NTTグループという信頼性と、当時普及し始めていた光ファイバーという成長分野に携われる点に魅力を感じ入社しました。</td>
              <td style="border: 1px solid #ddd; padding: 8px;">営業活動を通じて社内の技術部門（開通・設定業務）と連携する中で、IT技術そのものへの関心が強くなりました。「ITスキルを磨き、技術で顧客を支える仕事がしたい」と方向性を定めました。</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">有限会社クレオネット</td>
              <td style="border: 1px solid #ddd; padding: 8px;">当時のスキルでも挑戦できる「キッティング」業務を通じて、ITインフラの基礎やPC等のハードウェア知識を現場で叩き上げたいと考え入社しました。</td>
              <td style="border: 1px solid #ddd; padding: 8px;">現場での作業に加え、リーダーとして工程管理も経験し、一通りの業務を習得しました。次のステップとして、よりユーザーに近い立場で問題解決を行う「ヘルプデスク・サポート業務」に挑戦したいと考えました。</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">SCSKサービスウェア株式会社</td>
              <td style="border: 1px solid #ddd; padding: 8px;">複合機サポートの立ち上げメンバー募集があり、これまでのPC・回線知識とリーダー経験が活かせると考え入社しました。その後、より責任ある立場でマネジメントに携わりたいと考え、正社員登用を受けました。</td>
              <td style="border: 1px solid #ddd; padding: 8px;">17年間でFAQ改善やRPA導入など多くの改善実績を残し、マネージャーとして安定した地位を得ましたが、BPOという立場上、クライアントの決定範囲内での改善に留まることに限界も感じていました。「自社の一員として、システムや業務の根幹から改善したい」という思いが強くなり、転職を決意しました。</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">キャリアリンク株式会社</td>
              <td style="border: 1px solid #ddd; padding: 8px;">官公庁BPOにおけるDX推進というテーマに社会的意義を感じ、また面接官（現在の上司）の掲げる変革ビジョンに共感し、その下で業務改善スキルを発揮したいと考え入社しました。</td>
              <td style="border: 1px solid #ddd; padding: 8px;">入社後、実際の業務が定型的な事務処理の管理中心であり、私が強みとする「RPAやCRMなどのITツールや、データを活用した改善」とは距離があることを認識しました。今回の求人情報の紹介を受け、貴社でこそこれまでの経験を最大限に活かせると確信し、早期の転職を決意しました。</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style="margin-top: 10px; font-size: 0.8rem; color: #666;">※スマートフォン等の場合は横にスクロールしてご覧ください。</p>
    `,
    
    q2: `【大切にしている価値観・必須条件】<br>
    大切にしているのは「実効性のある業務改善」です。<br><br>
    直近の経験から、次の会社では以下の点を重視しています。<br>
    ・「RPA」や「CRM」などのITツール活用が歓迎される環境であること。<br>
    ・泥臭い現場対応だけでなく、データに基づいた仕組み化や効率化が評価されること。<br>
    ・御社の「101点のサービス」のように、言われたこと以上の付加価値（改善提案）を出せる風土であること。`,
    
    q3: `【志望動機】<br>
    「ITスキルを活かして顧客体験と業務効率を同時に向上させたい」という私の軸が、御社の環境でこそ実現できると考えたからです。<br><br>
    前職ではスキルのミスマッチがありましたが、その分「自分が本当に貢献できるのはITを活用した改善フェーズだ」と再確認できました。<br><br>
    御社のCSリーダーとして、SCSK時代に培ったマネジメント力と、技術的な改善スキル（RPA/CRM）を掛け合わせ、顧客満足度を高める仕組みを作りたいと考えています。`
  };

  const handleAsk = (key: string, questionText: string) => {
    setMessages(prev => [...prev, { role: "user", text: questionText }]);
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
            <div 
              style={msg.role === "user" ? styles.userBubble : styles.botBubble}
              // ★ここが重要：HTMLタグ（tableなど）を有効にする設定
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <p style={styles.guide}>質問を選択してください：</p>
        <div style={styles.buttonContainer}>
          <button style={styles.optionBtn} onClick={() => handleAsk("q1", "これまでの経歴と転職理由は？")}>
            1. 経歴・転職理由（詳細テーブル）
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
  container: { maxWidth: "800px", margin: "0 auto", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "sans-serif", backgroundColor: "#f4f4f9" },
  header: { padding: "15px", backgroundColor: "#2c3e50", color: "#fff", textAlign: "center", position: "relative" },
  backLink: { position: "absolute", left: "15px", top: "15px", color: "#fff", textDecoration: "none", fontSize: "0.9rem" },
  chatArea: { flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" },
  messageRow: { display: "flex" },
  // 吹き出しの最大幅を広げて表を見やすくしました
  userBubble: { backgroundColor: "#0070f3", color: "#fff", padding: "12px 16px", borderRadius: "18px 18px 0 18px", maxWidth: "90%", lineHeight: "1.6", fontSize: "0.95rem" },
  botBubble: { backgroundColor: "#fff", color: "#333", padding: "12px 16px", borderRadius: "18px 18px 18px 0", maxWidth: "95%", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", lineHeight: "1.6", fontSize: "0.95rem" },
  inputArea: { padding: "20px", backgroundColor: "#fff", borderTop: "1px solid #ddd" },
  guide: { textAlign: "center", color: "#666", marginBottom: "10px", fontSize: "0.9rem" },
  buttonContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  optionBtn: { padding: "12px", backgroundColor: "#fff", color: "#0070f3", border: "1px solid #0070f3", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold", transition: "0.2s" },
};