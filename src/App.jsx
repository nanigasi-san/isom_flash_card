import { FeedbackScreen, QuestionScreen, ResultScreen, SetupScreen } from "./components/Screens";
import { useQuizSession } from "./hooks/useQuizSession";

export default function App() {
  const {
    phase,
    questionCount,
    questions,
    currentIndex,
    currentQuestion,
    selectedChoice,
    score,
    sessionError,
    setQuestionCount,
    setSelectedChoice,
    startSession,
    submitAnswer,
    moveToNext,
    replaySession,
    resetSession,
  } = useQuizSession();

  return (
    <div className="app-shell">
      <div className="app-grid">
        <main className="app-main">
          {phase === "setup" ? (
            <SetupScreen
              questionCount={questionCount}
              sessionError={sessionError}
              onSelectCount={setQuestionCount}
              onStart={startSession}
            />
          ) : null}

          {phase === "question" && currentQuestion ? (
            <QuestionScreen
              question={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              score={score}
              selectedChoice={selectedChoice}
              onSelectChoice={setSelectedChoice}
              onSubmit={submitAnswer}
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
