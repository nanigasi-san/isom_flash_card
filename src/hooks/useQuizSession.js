import { useState } from "react";
import { createQuestions, DEFAULT_QUESTION_COUNT } from "../lib/quiz";

const SESSION_ERROR_MESSAGE =
  "問題の生成に失敗しました。ページを再読み込みして、もう一度試してください。";

export function useQuizSession() {
  const [phase, setPhase] = useState("setup");
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionError, setSessionError] = useState("");

  const currentQuestion = questions[currentIndex] ?? null;

  function startSession() {
    try {
      const nextQuestions = createQuestions(questionCount);

      if (nextQuestions.length === 0) {
        throw new Error("No quiz questions were generated.");
      }

      setQuestions(nextQuestions);
      setCurrentIndex(0);
      setScore(0);
      setSessionError("");
      setPhase("question");
    } catch {
      setQuestions([]);
      setCurrentIndex(0);
      setScore(0);
      setSessionError(SESSION_ERROR_MESSAGE);
      setPhase("setup");
    }
  }

  function answerChoice(choice) {
    const current = questions[currentIndex];

    if (!current) {
      return;
    }

    const isCorrect = choice === current.item.japaneseName;
    const nextQuestions = questions.slice();

    nextQuestions[currentIndex] = {
      ...current,
      selectedChoice: choice,
      isCorrect,
    };

    setQuestions(nextQuestions);

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
    setSessionError("");
    setPhase("setup");
  }

  return {
    phase,
    questionCount,
    questions,
    currentIndex,
    currentQuestion,
    score,
    sessionError,
    setQuestionCount,
    startSession,
    answerChoice,
    moveToNext,
    replaySession,
    resetSession,
  };
}
