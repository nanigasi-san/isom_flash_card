export function getQuestionLabel(question) {
  return question?.item?.japaneseName || question?.item?.englishName || "名称不明";
}

export function formatElapsedTime(totalMs) {
  const safeMs = Math.max(0, totalMs);
  const totalSeconds = safeMs / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  const secondsLabel = seconds.toFixed(1).padStart(minutes > 0 ? 4 : 0, "0");

  if (minutes === 0) {
    return `${secondsLabel}秒`;
  }

  return `${minutes}分${secondsLabel}秒`;
}
