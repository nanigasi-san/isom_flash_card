import { FeedbackScreen, QuestionScreen, ResultScreen, SetupScreen } from "./components/Screens";
import { useQuizSession } from "./hooks/useQuizSession";

export default function App() {
  const {
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
              mode={mode}
              difficulty={difficulty}
              selectedHundreds={selectedHundreds}
              sessionError={sessionError}
              onSelectCount={setQuestionCount}
              onSelectMode={setMode}
              onSelectDifficulty={setDifficulty}
              onSelectHundreds={setSelectedHundreds}
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
              mode={mode}
              questionCount={questionCount}
              selectedHundreds={selectedHundreds}
              totalAnswerTimeMs={totalAnswerTimeMs}
              onReplay={replaySession}
              onReset={resetSession}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
