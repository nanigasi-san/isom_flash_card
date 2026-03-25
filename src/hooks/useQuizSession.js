import { useEffect, useReducer, useRef } from "react";
import { findUniqueItemByJapaneseName } from "../data/isomDataset";
import {
  createQuestions,
  DEFAULT_CHALLENGE_HUNDREDS,
} from "../lib/quiz";
import {
  DEFAULT_QUESTION_COUNT,
  DEFAULT_QUIZ_DIFFICULTY,
  DEFAULT_QUIZ_MODE,
  QUIZ_PHASES,
} from "../lib/quizConfig";

const SESSION_ERROR_MESSAGE =
  "問題の生成に失敗しました。ページを再読み込みして、もう一度試してください。";

const SESSION_ACTIONS = {
  UPDATE_SETTINGS: "update_settings",
  START_SESSION_SUCCESS: "start_session_success",
  START_SESSION_FAILURE: "start_session_failure",
  ANSWER_QUESTION: "answer_question",
  ADVANCE_QUESTION: "advance_question",
  RESET_SESSION: "reset_session",
};

const imagePreloadCache = new Set();

function preloadImage(src) {
  if (!src || imagePreloadCache.has(src)) {
    return;
  }

  imagePreloadCache.add(src);

  const image = new Image();
  image.decoding = "async";
  image.src = src;
}

function preloadQuestionAssets(question) {
  if (!question) {
    return;
  }

  preloadImage(question.item?.svgPath);

  question.options?.forEach((option) => {
    const matchedItem = findUniqueItemByJapaneseName(option);
    preloadImage(matchedItem?.svgPath);
  });
}

function createInitialState() {
  return {
    phase: QUIZ_PHASES.SETUP,
    settings: {
      questionCount: DEFAULT_QUESTION_COUNT,
      mode: DEFAULT_QUIZ_MODE,
      difficulty: DEFAULT_QUIZ_DIFFICULTY,
      selectedHundreds: DEFAULT_CHALLENGE_HUNDREDS,
    },
    questions: [],
    currentIndex: 0,
    score: 0,
    totalAnswerTimeMs: 0,
    sessionError: "",
  };
}

function resetProgress(state, overrides = {}) {
  return {
    ...state,
    questions: [],
    currentIndex: 0,
    score: 0,
    totalAnswerTimeMs: 0,
    sessionError: "",
    ...overrides,
  };
}

function sessionReducer(state, action) {
  switch (action.type) {
    case SESSION_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case SESSION_ACTIONS.START_SESSION_SUCCESS:
      return {
        ...resetProgress(state),
        questions: action.payload.questions,
        phase: QUIZ_PHASES.QUESTION,
      };
    case SESSION_ACTIONS.START_SESSION_FAILURE:
      return resetProgress(state, {
        phase: QUIZ_PHASES.SETUP,
        sessionError: SESSION_ERROR_MESSAGE,
      });
    case SESSION_ACTIONS.ANSWER_QUESTION: {
      const currentQuestion = state.questions[state.currentIndex];

      if (!currentQuestion) {
        return state;
      }

      const isCorrect = action.payload.choice === currentQuestion.item.japaneseName;
      const nextQuestions = state.questions.slice();

      nextQuestions[state.currentIndex] = {
        ...currentQuestion,
        selectedChoice: action.payload.choice,
        isCorrect,
      };

      return {
        ...state,
        questions: nextQuestions,
        score: isCorrect ? state.score + 1 : state.score,
        totalAnswerTimeMs: state.totalAnswerTimeMs + action.payload.elapsedMs,
        phase: QUIZ_PHASES.FEEDBACK,
      };
    }
    case SESSION_ACTIONS.ADVANCE_QUESTION:
      if (state.currentIndex >= state.questions.length - 1) {
        return {
          ...state,
          phase: QUIZ_PHASES.RESULT,
        };
      }

      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        phase: QUIZ_PHASES.QUESTION,
      };
    case SESSION_ACTIONS.RESET_SESSION:
      return resetProgress(state, {
        phase: QUIZ_PHASES.SETUP,
      });
    default:
      return state;
  }
}

export function useQuizSession() {
  const [state, dispatch] = useReducer(sessionReducer, undefined, createInitialState);
  const questionStartedAtRef = useRef(0);
  const currentQuestion = state.questions[state.currentIndex] ?? null;

  useEffect(() => {
    if (state.phase !== QUIZ_PHASES.QUESTION) {
      return;
    }

    preloadQuestionAssets(state.questions[state.currentIndex]);
    preloadQuestionAssets(state.questions[state.currentIndex + 1]);
  }, [state.currentIndex, state.phase, state.questions]);

  function updateSettings(patch) {
    dispatch({
      type: SESSION_ACTIONS.UPDATE_SETTINGS,
      payload: patch,
    });
  }

  function startSession() {
    try {
      const nextQuestions = createQuestions(state.settings);

      if (nextQuestions.length === 0) {
        throw new Error("No quiz questions were generated.");
      }

      questionStartedAtRef.current = performance.now();
      dispatch({
        type: SESSION_ACTIONS.START_SESSION_SUCCESS,
        payload: { questions: nextQuestions },
      });
    } catch {
      questionStartedAtRef.current = 0;
      dispatch({ type: SESSION_ACTIONS.START_SESSION_FAILURE });
    }
  }

  function answerChoice(choice) {
    if (!currentQuestion) {
      return;
    }

    const answeredAt = performance.now();
    const elapsedMs =
      questionStartedAtRef.current > 0 ? Math.max(0, answeredAt - questionStartedAtRef.current) : 0;

    dispatch({
      type: SESSION_ACTIONS.ANSWER_QUESTION,
      payload: {
        choice,
        elapsedMs,
      },
    });
  }

  function moveToNext() {
    questionStartedAtRef.current =
      state.currentIndex >= state.questions.length - 1 ? 0 : performance.now();
    dispatch({ type: SESSION_ACTIONS.ADVANCE_QUESTION });
  }

  function replaySession() {
    startSession();
  }

  function resetSession() {
    questionStartedAtRef.current = 0;
    dispatch({ type: SESSION_ACTIONS.RESET_SESSION });
  }

  return {
    phase: state.phase,
    questionCount: state.settings.questionCount,
    mode: state.settings.mode,
    difficulty: state.settings.difficulty,
    selectedHundreds: state.settings.selectedHundreds,
    questions: state.questions,
    currentIndex: state.currentIndex,
    currentQuestion,
    score: state.score,
    totalAnswerTimeMs: state.totalAnswerTimeMs,
    sessionError: state.sessionError,
    setQuestionCount: (questionCount) => updateSettings({ questionCount }),
    setMode: (mode) => updateSettings({ mode }),
    setDifficulty: (difficulty) => updateSettings({ difficulty }),
    setSelectedHundreds: (selectedHundreds) => updateSettings({ selectedHundreds }),
    startSession,
    answerChoice,
    moveToNext,
    replaySession,
    resetSession,
  };
}
