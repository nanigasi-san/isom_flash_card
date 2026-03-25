import { isomItems } from "../data/isomDataset";
import {
  DEFAULT_QUIZ_MODE,
  HUNDREDS_OPTIONS,
  QUIZ_DIFFICULTY_OPTIONS,
  QUIZ_MODE_OPTIONS,
} from "../lib/quiz";

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function findLabel(options, value, fallback) {
  return options.find((option) => option.value === value)?.label || fallback;
}

export default function Header({
  phase,
  currentIndex,
  questionTotal,
  score,
  mode,
  difficulty,
  questionCount,
  selectedHundreds,
}) {
  let status = "Setup";
  let headline = "ISOM記号を、番号から即答できる状態まで持っていく";
  let supporting = "クイズ条件を決めると、そのまま1問ずつテンポよく進められます。";

  if (phase === "question") {
    status = `Question ${currentIndex + 1}`;
    headline = "番号を見て、日本語名を最短で判断する";
    supporting = "選んだ瞬間に答え合わせへ進みます。迷う記号ほど反復しやすい設計です。";
  } else if (phase === "feedback") {
    status = "Feedback";
    headline = "正解との差分を、番号と記号の形で固める";
    supporting = "不正解時は選択した回答と正解を並べて比較できます。";
  } else if (phase === "result") {
    status = "Result";
    headline = "今回の定着度を確認して、次の周回に繋げる";
    supporting = "同条件で再挑戦するか、設定を変えて弱い領域を詰められます。";
  }

  const modeLabel = findLabel(QUIZ_MODE_OPTIONS, mode, findLabel(QUIZ_MODE_OPTIONS, DEFAULT_QUIZ_MODE, "ランダム"));
  const difficultyLabel = findLabel(QUIZ_DIFFICULTY_OPTIONS, difficulty, "普通");
  const challengeLabel =
    HUNDREDS_OPTIONS.find((option) => option.value === selectedHundreds)?.label || `${selectedHundreds}番台`;
  const rangeValue = mode === "challenge" ? challengeLabel : `${questionCount}問`;
  const progressValue = questionTotal ? `${currentIndex + 1} / ${questionTotal}` : "-";

  return (
    <header className="hero">
      <div className="hero-copy">
        <p className="hero-kicker">ISOM QUIZ</p>
        <p className="hero-phase">{status}</p>
        <h1>{headline}</h1>
        <p className="hero-text">{supporting}</p>
        <div className="hero-tags">
          <span className="hero-tag">モード {modeLabel}</span>
          <span className="hero-tag">{mode === "challenge" ? `範囲 ${rangeValue}` : `出題 ${rangeValue}`}</span>
          {mode === "random" ? <span className="hero-tag">難易度 {difficultyLabel}</span> : null}
        </div>
      </div>
      <div className="hero-stats">
        <StatCard label="記号数" value={isomItems.length} />
        <StatCard label="正解数" value={score} />
        <StatCard label="状態" value={status} />
        <StatCard label="進行" value={progressValue} />
      </div>
    </header>
  );
}
