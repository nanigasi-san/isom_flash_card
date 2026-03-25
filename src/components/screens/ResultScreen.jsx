import { HUNDREDS_OPTIONS } from "../../lib/quiz";
import { formatElapsedTime } from "../../lib/quizDisplay";
import { SummaryCard, Surface } from "../ui";

export function ResultScreen({
  score,
  totalQuestions,
  mode,
  questionCount,
  selectedHundreds,
  totalAnswerTimeMs,
  onReplay,
  onReset,
}) {
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const challengeLabel =
    HUNDREDS_OPTIONS.find((option) => option.value === selectedHundreds)?.label || `${selectedHundreds}番台`;
  const replayLabel =
    mode === "challenge" ? `もう一度 ${challengeLabel}` : `もう一度 ${questionCount}問`;
  const formattedAnswerTime = formatElapsedTime(totalAnswerTimeMs);

  return (
    <div className="screen screen-two-column">
      <Surface eyebrow="Result" title="今回の結果" bodyClassName="stack result-body">
        <div className="result-score">{score}/{totalQuestions}問正解</div>
        <p className="result-accuracy">正答率 {accuracy}%</p>
        <p className="result-accuracy">解答時間 {formattedAnswerTime}</p>
        <div className="mini-summary">
          <SummaryCard label="正解" value={score} />
          <SummaryCard label="不正解" value={totalQuestions - score} />
          <SummaryCard label="解答時間" value={formattedAnswerTime} />
          <SummaryCard
            label={mode === "challenge" ? "出題範囲" : "問題数"}
            value={mode === "challenge" ? challengeLabel : `${questionCount}問`}
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
      </Surface>
    </div>
  );
}
