import { HUNDREDS_OPTIONS } from "../../lib/quiz";
import { QUIZ_DIFFICULTY_OPTIONS } from "../../lib/quizConfig";
import { formatElapsedTime } from "../../lib/quizDisplay";
import { SummaryCard, Surface } from "../ui";

export function ResultScreen({
  score,
  totalQuestions,
  mode,
  difficulty,
  questionCount,
  selectedHundreds,
  totalAnswerTimeMs,
  onReplay,
  onReset,
}) {
  const challengeLabel =
    HUNDREDS_OPTIONS.find((option) => option.value === selectedHundreds)?.label || `${selectedHundreds}番台`;
  const difficultyLabel =
    QUIZ_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label || difficulty;
  const replayLabel =
    mode === "challenge" ? `もう一度 ${challengeLabel}` : `もう一度 ${questionCount}問`;
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const formattedAnswerTime = formatElapsedTime(totalAnswerTimeMs);
  const formattedAverageAnswerTime = formatElapsedTime(
    totalQuestions > 0 ? Math.round(totalAnswerTimeMs / totalQuestions) : 0
  );
  const shareText = [
    `ISOM Flash Card で ${
      mode === "challenge"
        ? `チャレンジ / ${challengeLabel}`
        : `ランダム / ${questionCount}問 / ${difficultyLabel}`
    } をプレイ`,
    `結果: ${score}/${totalQuestions}問正解 (${accuracy}%)`,
    `解答時間: ${formattedAnswerTime} / 1問あたり${formattedAverageAnswerTime}`,
    window.location.origin,
  ].join("\n");

  function handleShareToX() {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="screen screen-two-column">
      <Surface eyebrow="Result" title="今回の結果" bodyClassName="stack result-body">
        <div className="result-summary-grid">
          <SummaryCard label="正解数/問題数" value={`${score}/${totalQuestions}問 (${accuracy}%)`} />
          <SummaryCard
            label="解答時間(全体/一問ごと)"
            value={`${formattedAnswerTime} / ${formattedAverageAnswerTime}`}
          />
        </div>
      </Surface>

      <Surface eyebrow="Next" title="続ける" bodyClassName="stack">
        <p className="support-copy">
          {mode === "challenge"
            ? "同じ100番台でもう一度解くか、設定画面で別の番台に切り替えられます。"
            : "同じ問題数でもう一度解くか、設定画面で問題数を変更できます。"}
        </p>
        <button type="button" className="primary-button" onClick={onReplay}>
          {replayLabel}
        </button>
        <button type="button" className="secondary-button" onClick={onReset}>
          設定に戻る
        </button>
        <button type="button" className="share-button" onClick={handleShareToX}>
          Xで共有
        </button>
      </Surface>
    </div>
  );
}
