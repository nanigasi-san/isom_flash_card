export const QUIZ_PHASES = {
  SETUP: "setup",
  QUESTION: "question",
  FEEDBACK: "feedback",
  RESULT: "result",
};

export const QUESTION_COUNT_OPTIONS = [5, 10, 30, 50];

export const QUIZ_MODE_OPTIONS = [
  { value: "random", label: "ランダム" },
  { value: "challenge", label: "チャレンジ" },
];

export const QUIZ_DIFFICULTY_OPTIONS = [
  { value: "normal", label: "普通" },
  { value: "hard", label: "難しい" },
];

export const DEFAULT_QUESTION_COUNT = QUESTION_COUNT_OPTIONS[1];
export const DEFAULT_QUIZ_MODE = QUIZ_MODE_OPTIONS[0].value;
export const DEFAULT_QUIZ_DIFFICULTY = QUIZ_DIFFICULTY_OPTIONS[0].value;
