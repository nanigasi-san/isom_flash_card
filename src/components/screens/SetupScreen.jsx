import { isomItems, uniqueJapaneseNames } from "../../data/isomDataset";
import { HUNDREDS_OPTIONS } from "../../lib/quiz";
import {
  QUESTION_COUNT_OPTIONS,
  QUIZ_DIFFICULTY_OPTIONS,
  QUIZ_MODE_OPTIONS,
} from "../../lib/quizConfig";
import { SummaryCard, Surface } from "../ui";

const ISOM_REFERENCE_URL = "https://www.orienteering.or.jp/archive/rule/isom2017-2.pdf";

export function SetupScreen({
  questionCount,
  mode,
  difficulty,
  selectedHundreds,
  sessionError,
  onSelectCount,
  onSelectMode,
  onSelectDifficulty,
  onSelectHundreds,
  onStart,
}) {
  const selectedMode = QUIZ_MODE_OPTIONS.find((option) => option.value === mode) || QUIZ_MODE_OPTIONS[0];
  const selectedDifficulty =
    QUIZ_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty) || QUIZ_DIFFICULTY_OPTIONS[0];
  const selectedChallenge =
    HUNDREDS_OPTIONS.find((option) => option.value === selectedHundreds) || HUNDREDS_OPTIONS[0];
  const isChallengeMode = mode === "challenge";

  return (
    <div className="screen screen-two-column">
      <Surface eyebrow="Setup" title="出題条件を選ぶ" bodyClassName="stack">
        <p className="support-copy">開始後はスクロールなしで 1 問ずつ解けます。</p>
        <a
          className="reference-link-card"
          href={ISOM_REFERENCE_URL}
          target="_blank"
          rel="noreferrer"
        >
          <span className="reference-link-kicker">Reference</span>
          <span className="reference-link-title">ISOM2017-2(PDF/日本語)</span>
          <span className="reference-link-arrow" aria-hidden="true">↗</span>
        </a>
        {sessionError ? <p className="error-copy">{sessionError}</p> : null}
        <div className="mode-grid">
          {QUIZ_MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`difficulty-button ${mode === option.value ? "is-active" : ""}`.trim()}
              onClick={() => onSelectMode(option.value)}
            >
              <span className="difficulty-title">{option.label}</span>
              <span className="difficulty-note">
                {option.value === "random"
                  ? "問題数を選んでランダム出題"
                  : "指定した100番台を全問出題"}
              </span>
            </button>
          ))}
        </div>
        {isChallengeMode ? (
          <div className="stack">
            <p className="support-copy">覚えたい100番台を選ぶと、その番台の記号がすべて出題されます。</p>
            <div className="hundreds-grid">
              {HUNDREDS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`count-button ${selectedHundreds === option.value ? "is-active" : ""}`.trim()}
                  onClick={() => onSelectHundreds(option.value)}
                >
                  <span className="count-value">{option.value}</span>
                  <span className="count-label">番台 / 全{option.count}問</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
        <div className="selection-row">
          <div className="selection-pill">モード: {selectedMode.label}</div>
          {isChallengeMode ? (
            <>
              <div className="selection-pill">範囲: {selectedChallenge?.label}</div>
              <div className="selection-pill">全{selectedChallenge?.count ?? 0}問</div>
            </>
          ) : (
            <>
              <div className="selection-pill">現在の問題数: {questionCount}問</div>
              <div className="selection-pill">難易度: {selectedDifficulty.label}</div>
            </>
          )}
        </div>
        <button type="button" className="primary-button" onClick={onStart}>
          はじめる
        </button>
      </Surface>

      <Surface eyebrow="Flow" title="進め方" bodyClassName="stack">
        <div className="rule-card-list">
          <div className="rule-card">
            <strong>1</strong>
            <span>{isChallengeMode ? "100番台を決めて、出題範囲を固定する" : "ISOM 番号を見る"}</span>
          </div>
          <div className="rule-card">
            <strong>2</strong>
            <span>
              {isChallengeMode
                ? "選択肢もその100番台だけ。全記号を1回ずつ出題"
                : "普通: 全体6択 / 難しい: 同100番台（600番台は3択）"}
            </span>
          </div>
          <div className="rule-card">
            <strong>3</strong>
            <span>{isChallengeMode ? "最後に a/n問正解 を確認する" : "選択した瞬間に答え合わせ"}</span>
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
