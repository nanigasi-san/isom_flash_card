import { isomItems, uniqueJapaneseNames } from "../data/isomDataset";

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];
export const DEFAULT_QUESTION_COUNT = QUESTION_COUNT_OPTIONS[1];

function shuffle(values) {
  const copy = values.slice();

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = current;
  }

  return copy;
}

function sampleUnique(values, count) {
  if (count > values.length) {
    throw new Error(`Not enough values to sample ${count} unique entries.`);
  }

  return shuffle(values).slice(0, count);
}

export function createQuestions(questionCount) {
  return sampleUnique(isomItems, questionCount).map((item) => ({
    item,
    options: shuffle([
      item.japaneseName,
      ...sampleUnique(
        uniqueJapaneseNames.filter((name) => name !== item.japaneseName),
        5
      ),
    ]),
    selectedChoice: null,
    isCorrect: false,
  }));
}
