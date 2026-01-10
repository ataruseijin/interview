// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Web選考課題 回答</h1>
        <p style={styles.subtitle}>応募者：あなたの名前</p>
        
        <div style={styles.menu}>
          {/* 静的版へのリンク */}
          <Link href="/static" style={{ textDecoration: 'none' }}>
            <div style={styles.primaryButton}>
              <h2 style={styles.btnTitle}>📄 静的回答モード</h2>
              <p style={styles.btnDesc}>
                事前に用意した回答をチャット形式で閲覧できます。<br/>
                <span style={{fontSize: '0.85em', opacity: 0.9}}>※回答内容を正確に確認したい方はこちら</span>
              </p>
            </div>
          </Link>

          {/* AI版へのリンク */}
          <Link href="/ai" style={{ textDecoration: 'none' }}>
            <div style={styles.secondaryButton}>
              <h2 style={styles.btnTitle}>🤖 生成AIモード (Beta)</h2>
              <p style={styles.btnDesc}>
                生成AIを用いた対話デモです。<br/>
                <span style={{fontSize: '0.85em', opacity: 0.9}}>※技術デモとしてご覧ください</span>
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f0f2f5", padding: "20px" },
  card: { backgroundColor: "white", padding: "40px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: "500px", width: "100%", textAlign: "center" },
  title: { margin: "0 0 10px 0", color: "#333", fontSize: "1.8rem" },
  subtitle: { margin: "0 0 30px 0", color: "#666" },
  menu: { display: "flex", flexDirection: "column", gap: "20px" },
  primaryButton: { backgroundColor: "#0070f3", color: "white", padding: "20px", borderRadius: "12px", cursor: "pointer", transition: "transform 0.2s", boxShadow: "0 4px 10px rgba(0,112,243,0.3)" },
  secondaryButton: { backgroundColor: "#333", color: "white", padding: "20px", borderRadius: "12px", cursor: "pointer", transition: "transform 0.2s", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" },
  btnTitle: { margin: "0 0 5px 0", fontSize: "1.2rem" },
  btnDesc: { margin: 0, lineHeight: "1.5", fontSize: "0.95rem" },
};