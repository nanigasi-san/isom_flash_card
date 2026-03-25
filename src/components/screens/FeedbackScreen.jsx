import { findUniqueItemByJapaneseName } from "../../data/isomDataset";
import { getQuestionLabel } from "../../lib/quizDisplay";
import { Surface } from "../ui";

export function FeedbackScreen({ question, isLastQuestion, onNext }) {
  const correctItem = question?.item || null;
  const correctLabel = getQuestionLabel(question);
  const selectedLabel = question?.selectedChoice || "未選択";
  const selectedItem = findUniqueItemByJapaneseName(question?.selectedChoice);
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
                  <div className="feedback-image-frame">
                    <img src={correctItem.svgPath} alt={`${correctItem.number} ${correctLabel}`} />
                  </div>
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
                  <div className="feedback-image-frame">
                    <img src={selectedItem.svgPath} alt={`${selectedNumber} ${selectedLabel}`} />
                  </div>
                ) : (
                  <span>画像なし</span>
                )}
              </div>
              <div className="feedback-image-box">
                {correctItem?.svgPath ? (
                  <div className="feedback-image-frame">
                    <img src={correctItem.svgPath} alt={`${correctItem.number} ${correctLabel}`} />
                  </div>
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
