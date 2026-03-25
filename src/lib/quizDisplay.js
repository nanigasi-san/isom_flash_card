export function getQuestionLabel(question) {
  return question?.item?.japaneseName || question?.item?.englishName || "名称不明";
}

export function formatElapsedTime(totalMs) {
  const safeMs = Math.max(0, totalMs);
  const totalSeconds = Math.floor(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}秒`;
  }

  return `${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}
