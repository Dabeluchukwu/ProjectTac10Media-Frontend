import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  useExam,
  useStartExam,
  useSubmitExam,
  useAttemptStatus,
  useExamResults,
} from "../../hooks/useExam";
import { retakeExam } from "../../api/examApi";

const Exam = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  const { data: exam, isLoading: examLoading } = useExam(courseId);
  const { data: attempt, refetch: refetchAttempt } = useAttemptStatus(exam?._id);
  const startExamMutation = useStartExam();
  const submitExamMutation = useSubmitExam();

  // Check if exam is already started/completed
  useEffect(() => {
    if (attempt) {
      if (attempt.status === "submitted" || attempt.status === "graded") {
        // If passed, go to results
        if (attempt.passed) {
          navigate(`/exam/results/${exam?._id}`);
        } else {
          // Failed - stay on exam page, show retake option
          setExamStarted(false);
        }
      } else if (attempt.status === "in-progress") {
        setExamStarted(true);
        // Load existing answers
        if (attempt.answers) {
          const loadedAnswers = {};
          attempt.answers.forEach((ans, index) => {
            loadedAnswers[index] = ans.answer;
          });
          setAnswers(loadedAnswers);
        }
      }
    }
  }, [attempt, exam, navigate]);

  // Timer
  useEffect(() => {
    if (examStarted && exam?.timeLimit && !submitted) {
      setTimeLeft(exam.timeLimit * 60);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [examStarted, exam]);

  const handleStartExam = async () => {
    try {
      await startExamMutation.mutateAsync({
        examId: exam._id,
        courseId: courseId,
      });
      setExamStarted(true);
      toast.success("Exam started! Good luck!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to start exam");
    }
  };

  const handleRetakeExam = async () => {
    setIsRetaking(true);
    try {
      await retakeExam({
        examId: exam._id,
        courseId: courseId,
      });
      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["exam-attempt", exam._id] });
      // Reset state
      setAnswers({});
      setCurrentQuestion(0);
      setExamStarted(true);
      setSubmitted(false);
      refetchAttempt();
      toast.success("Retake started! Good luck!");
    } catch (error) {
      console.error("Retake error:", error);
      toast.error(error?.response?.data?.message || "Failed to retake exam");
    } finally {
      setIsRetaking(false);
    }
  };

  const handleAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (submitted) return;

    const totalQuestions = exam?.questions?.length || 0;
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitted(true);
    try {
      const answerArray = exam.questions.map((_, index) => ({
        questionId: exam.questions[index]._id,
        answer: answers[index] || "",
      }));

      const response = await submitExamMutation.mutateAsync({
        examId: exam._id,
        answers: answerArray,
      });

      toast.success("Exam submitted successfully!");
      navigate(`/exam/results/${exam._id}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit exam");
      setSubmitted(false);
    }
  };

  if (examLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-amber-400 mb-4">No Exam Available</h2>
        <p className="text-gray-400 mb-6">
          There is no exam for this course yet. Please check back later.
        </p>
        <button
          onClick={() => navigate("/dashboard/courses")}
          className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  // Not started yet - show start screen
  if (!examStarted) {
    const hasFailedAttempt = attempt && attempt.status === "submitted" && !attempt.passed;

    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-amber-400 mb-2">{exam.title}</h1>
            <p className="text-gray-400 mb-6">{exam.description || "Test your knowledge on this course."}</p>
          </div>

          {hasFailedAttempt && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm text-center">
                ⚠️ You previously failed this exam. You can retake it now.
              </p>
            </div>
          )}

          <div className="bg-neutral-800 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Questions</p>
                <p className="text-xl font-semibold text-white">{exam.questions?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Passing Score</p>
                <p className="text-xl font-semibold text-amber-400">{exam.passingScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Time Limit</p>
                <p className="text-xl font-semibold text-white">{exam.timeLimit || 60} mins</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Points</p>
                <p className="text-xl font-semibold text-white">{exam.totalPoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <p className="text-yellow-400 text-sm text-center">
              ⚠️ Once you start the exam, you must complete it within the time limit.
              Make sure you have a stable internet connection.
            </p>
          </div>

          <button
            onClick={hasFailedAttempt ? handleRetakeExam : handleStartExam}
            disabled={startExamMutation.isPending || isRetaking}
            className="w-full bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition disabled:opacity-50"
          >
            {startExamMutation.isPending || isRetaking
              ? "Starting..."
              : hasFailedAttempt
              ? "Retake Exam"
              : "Start Exam"}
          </button>
        </div>
      </div>
    );
  }

  // Exam in progress
  const question = exam.questions?.[currentQuestion];
  const totalQuestions = exam.questions?.length || 0;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  if (!question) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <p className="text-gray-400">No questions found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">{exam.title}</h1>
            <p className="text-sm text-gray-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Time Left</p>
            <p className={`text-xl font-bold ${timeLeft < 60 ? "text-red-500" : "text-white"}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-700 rounded-full h-2 mb-6">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-sm font-semibold min-w-[30px] text-center">
              {currentQuestion + 1}
            </span>
            <p className="text-lg font-medium text-white">{question.question}</p>
          </div>

          <div className="space-y-3 mt-4">
            {question.type === "multiple-choice" && question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(currentQuestion, option)}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  answers[currentQuestion] === option
                    ? "bg-amber-500/20 border-amber-500 text-white"
                    : "bg-neutral-800 border-neutral-700 hover:border-neutral-600 text-gray-300"
                }`}
              >
                <span className="mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}

            {question.type === "true-false" && (
              <div className="grid grid-cols-2 gap-4">
                {["True", "False"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(currentQuestion, option)}
                    className={`p-4 rounded-lg border transition ${
                      answers[currentQuestion] === option
                        ? "bg-amber-500/20 border-amber-500 text-white"
                        : "bg-neutral-800 border-neutral-700 hover:border-neutral-600 text-gray-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === "essay" && (
              <textarea
                value={answers[currentQuestion] || ""}
                onChange={(e) => handleAnswer(currentQuestion, e.target.value)}
                placeholder="Write your answer here..."
                rows={6}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-4 text-white focus:outline-none focus:border-amber-500"
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition disabled:opacity-50"
          >
            ← Previous
          </button>

          <div className="flex gap-3">
            {!isLastQuestion && (
              <button
                onClick={() => setCurrentQuestion((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold hover:bg-neutral-700 transition"
              >
                Next →
              </button>
            )}
            {isLastQuestion && (
              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitted ? "Submitting..." : "Submit Exam"}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {exam.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                idx === currentQuestion
                  ? "bg-amber-500 text-black"
                  : answers[idx]
                  ? "bg-green-500/30 text-green-400 border border-green-500/50"
                  : "bg-neutral-800 text-gray-400 hover:bg-neutral-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exam;