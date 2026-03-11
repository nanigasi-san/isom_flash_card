import { isomItems, uniqueJapaneseNames } from "../data/isomDataset";

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];
export const DEFAULT_QUESTION_COUNT = QUESTION_COUNT_OPTIONS[1];
export const QUIZ_DIFFICULTY_OPTIONS = [
  { value: "normal", label: "普通" },
  { value: "hard", label: "難しい" },
];
export const DEFAULT_QUIZ_DIFFICULTY = QUIZ_DIFFICULTY_OPTIONS[0].value;

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

function getCategoryByHundreds(number) {
  const numeric = Number.parseFloat(number);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.floor(numeric / 100) * 100;
}

function buildNormalOptions(item) {
  return shuffle([
    item.japaneseName,
    ...sampleUnique(
      uniqueJapaneseNames.filter((name) => name !== item.japaneseName),
      5
    ),
  ]);
}

function buildHardOptions(item) {
  const category = getCategoryByHundreds(item.number);
  const categoryNames = Array.from(
    new Set(
      isomItems
        .filter((candidate) => getCategoryByHundreds(candidate.number) === category)
        .map((candidate) => candidate.japaneseName)
    )
  );

  if (!categoryNames.includes(item.japaneseName)) {
    categoryNames.push(item.japaneseName);
  }

  const optionCount = Math.min(6, categoryNames.length);
  const distractors = categoryNames.filter((name) => name !== item.japaneseName);

  return shuffle([item.japaneseName, ...sampleUnique(distractors, optionCount - 1)]);
}

export function createQuestions(questionCount, difficulty = DEFAULT_QUIZ_DIFFICULTY) {
  return sampleUnique(isomItems, questionCount).map((item) => {
    const options = difficulty === "hard" ? buildHardOptions(item) : buildNormalOptions(item);

    return {
      item,
      options,
      selectedChoice: null,
      isCorrect: false,
    };
  });
}
