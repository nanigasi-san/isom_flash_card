import { isomItems, uniqueJapaneseNames } from "../data/isomDataset";
import {
  DEFAULT_QUESTION_COUNT,
  DEFAULT_QUIZ_DIFFICULTY,
  DEFAULT_QUIZ_MODE,
} from "./quizConfig";

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

export function getCategoryByHundreds(number) {
  const numeric = Number.parseFloat(number);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.floor(numeric / 100) * 100;
}

export const HUNDREDS_CATEGORY_LABELS = {
  100: "地形",
  200: "岩石と崖",
  300: "水系と湿地",
  400: "植生",
  500: "人工物",
  600: "技術記号",
  700: "コース設定記号",
};

export const HUNDREDS_SECTION_LABELS = {
  100: "3.1",
  200: "3.2",
  300: "3.3",
  400: "3.4",
  500: "3.5",
  600: "3.6",
  700: "3.7",
};

const itemsByHundreds = isomItems.reduce((groups, item) => {
  const category = getCategoryByHundreds(item.number);

  if (!groups.has(category)) {
    groups.set(category, []);
  }

  groups.get(category).push(item);
  return groups;
}, new Map());

export const HUNDREDS_OPTIONS = Array.from(itemsByHundreds.entries())
  .sort(([left], [right]) => left - right)
  .map(([value, items]) => ({
    value,
    label: `${value}番台`,
    section: HUNDREDS_SECTION_LABELS[value] ?? "",
    description: HUNDREDS_CATEGORY_LABELS[value] ?? "その他",
    count: items.length,
  }));

export const DEFAULT_CHALLENGE_HUNDREDS = HUNDREDS_OPTIONS[0]?.value ?? 100;

function getJapaneseNamesByHundreds(category) {
  return Array.from(
    new Set((itemsByHundreds.get(category) ?? []).map((item) => item.japaneseName))
  );
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
  const categoryNames = getJapaneseNamesByHundreds(category);

  if (!categoryNames.includes(item.japaneseName)) {
    categoryNames.push(item.japaneseName);
  }

  const optionCount = Math.min(6, categoryNames.length);
  const distractors = categoryNames.filter((name) => name !== item.japaneseName);

  return shuffle([item.japaneseName, ...sampleUnique(distractors, optionCount - 1)]);
}

function buildChallengeOptions(item) {
  return buildHardOptions(item);
}

export function createQuestions({
  questionCount = DEFAULT_QUESTION_COUNT,
  difficulty = DEFAULT_QUIZ_DIFFICULTY,
  mode = DEFAULT_QUIZ_MODE,
  selectedHundreds = DEFAULT_CHALLENGE_HUNDREDS,
} = {}) {
  const sourceItems =
    mode === "challenge"
      ? shuffle(itemsByHundreds.get(selectedHundreds) ?? [])
      : sampleUnique(isomItems, questionCount);

  if (sourceItems.length === 0) {
    throw new Error("No quiz questions were generated.");
  }

  return sourceItems.map((item) => {
    const options =
      mode === "challenge"
        ? buildChallengeOptions(item)
        : difficulty === "hard"
          ? buildHardOptions(item)
          : buildNormalOptions(item);

    return {
      item,
      options,
      selectedChoice: null,
      isCorrect: false,
    };
  });
}
