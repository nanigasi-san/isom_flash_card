import { isomItems } from "../data/isomDataset";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function Header({ phase, currentIndex, questionTotal }) {
  let status = "準備中";

  if (phase === "question") {
    status = `出題 ${currentIndex + 1}`;
  } else if (phase === "feedback") {
    status = "答え合わせ";
  } else if (phase === "result") {
    status = "結果";
  }

  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="hero-kicker">ISOM QUIZ</p>
        <h1>ISOM番号から記号名を覚える</h1>
        <p className="hero-text">
          問題数を選ぶと、ISOM番号に対応する日本語名を6択で答えていくクイズです。
          各問題のあとに番号、正解名、画像で答え合わせできます。
        </p>
      </div>
      <div className="hero-stats">
        <StatCard label="記号数" value={isomItems.length} />
        <StatCard label="選択肢" value="6" />
        <StatCard label="状態" value={status} />
        <StatCard label="進行" value={questionTotal ? `${currentIndex + 1} / ${questionTotal}` : "-"} />
      </div>
    </header>
  );
}
