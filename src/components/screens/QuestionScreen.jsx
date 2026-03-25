import { MetaPill, Surface } from "../ui";

export function QuestionScreen({ question, currentIndex, totalQuestions, score, onChooseChoice }) {
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const number = question?.item?.number || "-";
  const questionLabel = `第${currentIndex + 1}問`;

  return (
    <div className="screen screen-question">
      <Surface
        eyebrow="Question"
        title={
          <span className="question-header">
            <span className="question-header-label">{questionLabel}</span>
            <MetaPill>正解 {score}</MetaPill>
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
