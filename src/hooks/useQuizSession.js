import { useRef, useState } from "react";
import {
  createQuestions,
  DEFAULT_CHALLENGE_HUNDREDS,
  DEFAULT_QUESTION_COUNT,
  DEFAULT_QUIZ_DIFFICULTY,
  DEFAULT_QUIZ_MODE,
} from "../lib/quiz";

const SESSION_ERROR_MESSAGE =
  "問題の生成に失敗しました。ページを再読み込みして、もう一度試してください。";

export function useQuizSession() {
  const [phase, setPhase] = useState("setup");
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [mode, setMode] = useState(DEFAULT_QUIZ_MODE);
  const [difficulty, setDifficulty] = useState(DEFAULT_QUIZ_DIFFICULTY);
  const [selectedHundreds, setSelectedHundreds] = useState(DEFAULT_CHALLENGE_HUNDREDS);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswerTimeMs, setTotalAnswerTimeMs] = useState(0);
  const [sessionError, setSessionError] = useState("");
  const questionStartedAtRef = useRef(0);

  const currentQuestion = questions[currentIndex] ?? null;

  function startSession() {
    try {
      const nextQuestions = createQuestions({
        questionCount,
        difficulty,
        mode,
        selectedHundreds,
      });

      if (nextQuestions.length === 0) {
        throw new Error("No quiz questions were generated.");
      }

      setQuestions(nextQuestions);
      setCurrentIndex(0);
      setScore(0);
      setTotalAnswerTimeMs(0);
      setSessionError("");
      questionStartedAtRef.current = performance.now();
      setPhase("question");
    } catch {
      setQuestions([]);
      setCurrentIndex(0);
      setScore(0);
      setTotalAnswerTimeMs(0);
      setSessionError(SESSION_ERROR_MESSAGE);
      questionStartedAtRef.current = 0;
      setPhase("setup");
    }
  }

  function answerChoice(choice) {
    const current = questions[currentIndex];

    if (!current) {
      return;
    }

    const answeredAt = performance.now();
    const elapsedMs =
      questionStartedAtRef.current > 0 ? Math.max(0, answeredAt - questionStartedAtRef.current) : 0;
    const isCorrect = choice === current.item.japaneseName;
    const nextQuestions = questions.slice();

    nextQuestions[currentIndex] = {
      ...current,
      selectedChoice: choice,
      isCorrect,
    };

    setQuestions(nextQuestions);
    setTotalAnswerTimeMs((currentTotal) => currentTotal + elapsedMs);

    if (isCorrect) {
      setScore((currentScore) => currentScore + 1);
    }

    setPhase("feedback");
  }

  function moveToNext() {
    if (currentIndex >= questions.length - 1) {
      setPhase("result");
      return;
    }

    questionStartedAtRef.current = performance.now();
    setCurrentIndex((index) => index + 1);
    setPhase("question");
  }

  function replaySession() {
    startSession();
  }

  function resetSession() {
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setTotalAnswerTimeMs(0);
    setSessionError("");
    questionStartedAtRef.current = 0;
    setPhase("setup");
  }

  return {
    phase,
    questionCount,
    mode,
    difficulty,
    selectedHundreds,
    questions,
    currentIndex,
    currentQuestion,
    score,
    totalAnswerTimeMs,
    sessionError,
    setQuestionCount,
    setMode,
    setDifficulty,
    setSelectedHundreds,
    startSession,
    answerChoice,
    moveToNext,
    replaySession,
    resetSession,
  };
}
