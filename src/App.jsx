import { FeedbackScreen, QuestionScreen, ResultScreen, SetupScreen } from "./components/screens";
import { useQuizSession } from "./hooks/useQuizSession";
import { QUIZ_PHASES } from "./lib/quizConfig";

export default function App() {
  const session = useQuizSession();
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
  } = session;

  function renderActiveScreen() {
    switch (phase) {
      case QUIZ_PHASES.SETUP:
        return (
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
        );
      case QUIZ_PHASES.QUESTION:
        return currentQuestion ? (
          <QuestionScreen
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            score={score}
            onChooseChoice={answerChoice}
          />
        ) : null;
      case QUIZ_PHASES.FEEDBACK:
        return currentQuestion ? (
          <FeedbackScreen
            question={currentQuestion}
            isLastQuestion={currentIndex === questions.length - 1}
            onNext={moveToNext}
          />
        ) : null;
      case QUIZ_PHASES.RESULT:
        return (
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
        );
      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      {phase !== QUIZ_PHASES.SETUP ? (
        <button type="button" className="home-button" onClick={resetSession}>
          HOME
        </button>
      ) : null}
      <div className="app-grid">
        <main className="app-main">{renderActiveScreen()}</main>
      </div>
    </div>
  );
}
