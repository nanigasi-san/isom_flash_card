import { isomItems, uniqueJapaneseNames } from "../data/isomDataset";
import { QUESTION_COUNT_OPTIONS, QUIZ_DIFFICULTY_OPTIONS } from "../lib/quiz";
import { MetaPill, SummaryCard, Surface } from "./ui";

function getQuestionLabel(question) {
  return question?.item?.japaneseName || question?.item?.englishName || "名称不明";
}

function findItemByJapaneseName(name) {
  if (!name) {
    return null;
  }

  const matchedItems = isomItems.filter((item) => item.japaneseName === name);

  if (matchedItems.length !== 1) {
    return null;
  }

  return matchedItems[0];
}

export function SetupScreen({
  questionCount,
  difficulty,
  sessionError,
  onSelectCount,
  onSelectDifficulty,
  onStart,
}) {
  const selectedDifficulty =
    QUIZ_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty) || QUIZ_DIFFICULTY_OPTIONS[0];

  return (
    <div className="screen screen-two-column">
      <Surface eyebrow="Setup" title="問題数を選ぶ" bodyClassName="stack">
        <p className="support-copy">開始後はスクロールなしで 1 問ずつ解けます。</p>
        {sessionError ? <p className="error-copy">{sessionError}</p> : null}
        <div className="count-grid">
          {QUESTION_COUNT_OPTIONS.map((count) => (
            <button
              key={count}
              type="button"
              className={`count-button ${questionCount === count ? "is-active" : ""}`.trim()}
              onClick={() => onSelectCount(count)}
            >
              <span className="count-value">{count}</span>
              <span className="count-label">問</span>
            </button>
          ))}
        </div>
        <div className="difficulty-grid">
          {QUIZ_DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`difficulty-button ${difficulty === option.value ? "is-active" : ""}`.trim()}
              onClick={() => onSelectDifficulty(option.value)}
            >
              <span className="difficulty-title">難易度: {option.label}</span>
              <span className="difficulty-note">
                {option.value === "normal"
                  ? "全記号から6択"
                  : "同じ100番台のみ（600番台は3択）"}
              </span>
            </button>
          ))}
        </div>
        <div className="selection-row">
          <div className="selection-pill">現在の問題数: {questionCount}問</div>
          <div className="selection-pill">難易度: {selectedDifficulty.label}</div>
        </div>
        <button type="button" className="primary-button" onClick={onStart}>
          はじめる
        </button>
      </Surface>

      <Surface eyebrow="Flow" title="進め方" bodyClassName="stack">
        <div className="rule-card-list">
          <div className="rule-card">
            <strong>1</strong>
            <span>ISOM 番号を見る</span>
          </div>
          <div className="rule-card">
            <strong>2</strong>
            <span>普通: 全体6択 / 難しい: 同100番台（600番台は3択）</span>
          </div>
          <div className="rule-card">
            <strong>3</strong>
            <span>選択した瞬間に答え合わせ</span>
          </div>
        </div>

        <div className="mini-summary">
          <SummaryCard label="登録記号" value={isomItems.length} />
          <SummaryCard label="名称候補" value={uniqueJapaneseNames.length} />
          <SummaryCard label="おすすめ" value="10問" />
        </div>
      </Surface>
    </div>
  );
}

export function QuestionScreen({ question, currentIndex, totalQuestions, score, onChooseChoice }) {
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const number = question?.item?.number || "-";
  const questionLabel = `\u7b2c${currentIndex + 1}\u554f`;

  return (
    <div className="screen screen-question">
      <Surface
        eyebrow="Question"
        title={
          <span className="question-header">
            <span className="question-header-label">{questionLabel}</span>
            <MetaPill>{"\u6b63\u89e3"} {score}</MetaPill>
          </span>
        }
        bodyClassName="stack"
      >
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </Surface>

      <div className="question-layout">
        <Surface eyebrow="ISOM Number" bodyClassName="number-body">
          <div className="number-panel">
            <span className="number-value">{number}</span>
          </div>
        </Surface>

        <Surface eyebrow="Choices" title="日本語名を選択" bodyClassName="choice-grid">
          {question?.options?.map((option, index) => (
            <button
              key={option}
              type="button"
              className="choice-button"
              onClick={() => onChooseChoice(option)}
            >
              <span className="choice-label">{option || "名称不明"}</span>
              <span className="choice-index">{index + 1}</span>
            </button>
          ))}
        </Surface>
      </div>
    </div>
  );
}

export function FeedbackScreen({ question, isLastQuestion, onNext }) {
  const correctItem = question?.item || null;
  const correctLabel = getQuestionLabel(question);
  const selectedLabel = question?.selectedChoice || "未選択";
  const selectedItem = findItemByJapaneseName(question?.selectedChoice);
  const selectedNumber = selectedItem?.number || "-";
  const isCorrect = Boolean(question?.isCorrect);
  const toneClassName = isCorrect ? "is-correct" : "is-incorrect";

  return (
    <div className="screen screen-feedback">
      <Surface className={`feedback-surface ${toneClassName}`.trim()} bodyClassName="feedback-layout">
        <h2 className={`feedback-status ${toneClassName}`.trim()}>{isCorrect ? "正解！" : "不正解"}</h2>

        {isCorrect ? (
          <>
            <div className="feedback-meta-single">
              <p className="feedback-number">{correctItem?.number || "-"}</p>
              <p className="feedback-label">{correctLabel}</p>
            </div>
            <div className="feedback-image-row feedback-image-row-single">
              <div className="feedback-image-box">
                {correctItem?.svgPath ? (
                  <img src={correctItem.svgPath} alt={`${correctItem.number} ${correctLabel}`} />
                ) : (
                  <span>画像なし</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="feedback-compare-meta">
              <div className="feedback-compare-col">
                <p className="feedback-col-title">あなたの回答</p>
                <p className="feedback-number">{selectedNumber}</p>
                <p className="feedback-label">{selectedLabel}</p>
              </div>
              <div className="feedback-compare-col">
                <p className="feedback-col-title">問題の正解</p>
                <p className="feedback-number">{correctItem?.number || "-"}</p>
                <p className="feedback-label">{correctLabel}</p>
              </div>
            </div>
            <div className="feedback-image-row">
              <div className="feedback-image-box">
                {selectedItem?.svgPath ? (
                  <img src={selectedItem.svgPath} alt={`${selectedNumber} ${selectedLabel}`} />
                ) : (
                  <span>画像なし</span>
                )}
              </div>
              <div className="feedback-image-box">
                {correctItem?.svgPath ? (
                  <img src={correctItem.svgPath} alt={`${correctItem.number} ${correctLabel}`} />
                ) : (
                  <span>画像なし</span>
                )}
              </div>
            </div>
          </>
        )}

        <button type="button" className="primary-button feedback-next-button" onClick={onNext}>
          {isLastQuestion ? "結果を見る" : "次の問題へ"}
        </button>
      </Surface>
    </div>
  );
}

export function ResultScreen({ score, totalQuestions, questionCount, onReplay, onReset }) {
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="screen screen-two-column">
      <Surface eyebrow="Result" title="今回の結果" bodyClassName="stack result-body">
        <div className="result-score">
          {score} / {totalQuestions}
        </div>
        <p className="result-accuracy">正答率 {accuracy}%</p>
        <div className="mini-summary">
          <SummaryCard label="正解" value={score} />
          <SummaryCard label="不正解" value={totalQuestions - score} />
          <SummaryCard label="問題数" value={questionCount} />
        </div>
      </Surface>

      <Surface eyebrow="Next" title="続ける" bodyClassName="stack">
        <p className="support-copy">同じ問題数でもう一度解くか、設定画面で問題数を変更できます。</p>
        <button type="button" className="primary-button" onClick={onReplay}>
          もう一度 {questionCount}問
        </button>
        <button type="button" className="secondary-button" onClick={onReset}>
          設定に戻る
        </button>
      </Surface>
    </div>
  );
}
