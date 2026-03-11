import { isomItems, uniqueJapaneseNames } from "../data/isomDataset";
import { QUESTION_COUNT_OPTIONS } from "../lib/quiz";
import { AnswerCard, MetaPill, SummaryCard, Surface } from "./ui";

function getQuestionLabel(question) {
  return question?.item?.japaneseName || question?.item?.englishName || "名称不明";
}

export function SetupScreen({ questionCount, sessionError, onSelectCount, onStart }) {
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
        <div className="selection-pill">現在の問題数: {questionCount}問</div>
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
            <span>日本語名を 6 択から選ぶ</span>
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

  return (
    <div className="screen screen-question">
      <Surface eyebrow="Question" title="番号に対応する日本語名を選ぶ" bodyClassName="stack">
        <div className="progress-meta">
          <MetaPill>
            第{currentIndex + 1}問 / {totalQuestions}
          </MetaPill>
          <MetaPill>正解 {score}</MetaPill>
        </div>
        <div className="progress-track">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </Surface>

      <div className="question-layout">
        <Surface eyebrow="ISOM Number" title={number} bodyClassName="stack number-body">
          <div className="number-panel">
            <span className="number-value">{number}</span>
            <p className="number-copy">この番号に対応する日本語名を選んでください。</p>
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
  const label = getQuestionLabel(question);
  const selected = question?.selectedChoice || "未回答";
  const judgeClassName = question.isCorrect ? "is-correct" : "is-incorrect";

  return (
    <div className="screen screen-two-column">
      <Surface eyebrow="Feedback" title="答え合わせ" bodyClassName="stack feedback-body">
        <div className={`judge-banner ${judgeClassName}`}>
          <p className={`judge-main ${judgeClassName}`}>{question.isCorrect ? "正解！" : "不正解！"}</p>
          <p className="judge-sub">
            {question.isCorrect
              ? "その調子です。次の問題へ進みましょう。"
              : "正解名を確認して次に進みましょう。"}
          </p>
        </div>
        <div className={`answer-matrix ${judgeClassName}`}>
          <AnswerCard label="番号" value={question.item.number} />
          <AnswerCard label="あなたの解答" value={selected} />
          <AnswerCard label="正解" value={label} className="answer-card-wide" />
        </div>
        <button type="button" className="primary-button" onClick={onNext}>
          {isLastQuestion ? "結果を見る" : "次の問題へ"}
        </button>
      </Surface>

      <Surface eyebrow="Symbol" title={question.item.number} bodyClassName="symbol-card">
        <img src={question.item.svgPath} alt={`${question.item.number} ${label}`} />
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
