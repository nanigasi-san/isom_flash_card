import { FeedbackScreen, QuestionScreen, ResultScreen, SetupScreen } from "./components/Screens";
import { useQuizSession } from "./hooks/useQuizSession";

export default function App() {
  const {
    phase,
    questionCount,
    difficulty,
    questions,
    currentIndex,
    currentQuestion,
    score,
    sessionError,
    setQuestionCount,
    setDifficulty,
    startSession,
    answerChoice,
    moveToNext,
    replaySession,
    resetSession,
  } = useQuizSession();

  return (
    <div className="app-shell">
      {phase !== "setup" ? (
        <button type="button" className="home-button" onClick={resetSession}>
          HOME
        </button>
      ) : null}
      <div className="app-grid">
        <main className="app-main">
          {phase === "setup" ? (
            <SetupScreen
              questionCount={questionCount}
              difficulty={difficulty}
              sessionError={sessionError}
              onSelectCount={setQuestionCount}
              onSelectDifficulty={setDifficulty}
              onStart={startSession}
            />
          ) : null}

          {phase === "question" && currentQuestion ? (
            <QuestionScreen
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              score={score}
              onChooseChoice={answerChoice}
            />
          ) : null}

          {phase === "feedback" && currentQuestion ? (
            <FeedbackScreen
              question={currentQuestion}
              isLastQuestion={currentIndex === questions.length - 1}
              onNext={moveToNext}
            />
          ) : null}

          {phase === "result" ? (
            <ResultScreen
              score={score}
              totalQuestions={questions.length}
              questionCount={questionCount}
              onReplay={replaySession}
              onReset={resetSession}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
