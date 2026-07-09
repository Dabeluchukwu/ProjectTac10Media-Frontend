import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExamResults } from "../../hooks/useExam";
import { X, CheckCircle, XCircle, Clock, Calendar, Award } from "lucide-react";

const ExamResults = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { data: result, isLoading } = useExamResults(examId);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-amber-400 mb-4">
          No Results Found
        </h2>
        <p className="text-gray-400 mb-6">You haven't taken this exam yet.</p>
        <button
          onClick={() => navigate("/dashboard/courses")}
          className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const passed = result.passed;
  const score = result.score || 0;
  const totalPoints = result.exam?.totalPoints || 0;
  const percentage =
    totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  const examTitle = result.exam?.title || "Exam";
  const courseTitle = result.exam?.course?.title || "Course";

  // Calculate time taken
  const startedAt = result.startedAt ? new Date(result.startedAt) : null;
  const submittedAt = result.submittedAt ? new Date(result.submittedAt) : null;
  let timeTaken = null;
  if (startedAt && submittedAt) {
    const diffMs = submittedAt - startedAt;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    timeTaken = `${diffMins}m ${diffSecs}s`;
  }

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleQuestionClick = (index) => {
    setSelectedQuestion(index);
  };

  const closeModal = () => {
    setSelectedQuestion(null);
  };

  // Get the actual answer value
  const getUserAnswer = (answer) => {
    if (!answer) return "Not answered";
    return String(answer);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="text-gray-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Courses
          </button>
        </div>

        {/* Results Summary */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 mb-8">
          <div className="text-center mb-6">
            <div
              className={`text-6xl mb-4 ${passed ? "text-green-500" : "text-red-500"}`}
            >
              {passed ? "🎉" : "😅"}
            </div>
            <h1
              className={`text-3xl font-bold mb-2 ${passed ? "text-green-400" : "text-red-400"}`}
            >
              {passed
                ? "Congratulations! You Passed!"
                : "Sorry, You Didn't Pass"}
            </h1>
            <p className="text-gray-400">
              {passed
                ? "You've successfully passed the exam and earned your certificate!"
                : "Don't give up! Review the material and try again."}
            </p>
          </div>

          {/* Score Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Score</p>
              <p className="text-2xl font-bold text-amber-400">
                {score}/{totalPoints}
              </p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Percentage</p>
              <p
                className={`text-2xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}
              >
                {percentage}%
              </p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Status</p>
              <p
                className={`text-2xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}
              >
                {passed ? "✅ Passed" : "❌ Failed"}
              </p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-400">Passing Score</p>
              <p className="text-2xl font-bold text-amber-400">
                {result.exam?.passingScore || 70}%
              </p>
            </div>
          </div>

          {/* Course & Exam Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400 border-t border-neutral-800 pt-4">
            <div className="flex items-center gap-2">
              <span>📚 {courseTitle}</span>
              <span className="text-neutral-700">|</span>
              <span>📝 {examTitle}</span>
            </div>
            <div className="flex items-center gap-4">
              {timeTaken && (
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {timeTaken}
                </span>
              )}
              {submittedAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {formatDate(submittedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Certificate Button (if passed) */}
          {passed && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => navigate("/dashboard/certificates")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              >
                🎓 View Certificate
              </button>
            </div>
          )}
        </div>

        {/* Question Review */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Question Review
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Click on any question to see your answer
          </p>

          <div className="space-y-2">
            {result.answers?.map((answer, index) => {
              const question = result.exam?.questions?.[index];
              if (!question) return null;

              const isCorrect = answer.isCorrect || false;
              const questionText = question.question || "Question";
              const truncatedText =
                questionText.length > 60
                  ? questionText.substring(0, 60) + "..."
                  : questionText;

              return (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(index)}
                  className="w-full text-left flex items-center gap-3 p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition"
                >
                  <span className="text-lg">
                    {isCorrect ? (
                      <CheckCircle
                        size={20}
                        className="text-green-400 flex-shrink-0"
                      />
                    ) : (
                      <XCircle
                        size={20}
                        className="text-red-400 flex-shrink-0"
                      />
                    )}
                  </span>
                  <span className="text-sm text-gray-300">
                    {index + 1}. {truncatedText}
                  </span>
                </button>
              );
            })}
          </div>

          {(!result.answers || result.answers.length === 0) && (
            <p className="text-gray-400 text-center py-4">No questions found</p>
          )}
        </div>

        {/* Retake / Done Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Back to Courses
          </button>
          {!passed && (
            <button
              onClick={() => navigate(`/exam/${result.course}`)}
              className="bg-neutral-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
            >
              Retake Exam
            </button>
          )}
        </div>
      </div>

      {/* Question Modal */}
      {selectedQuestion !== null && result.answers?.[selectedQuestion] && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Question {selectedQuestion + 1}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Question</p>
                <p className="text-white font-medium">
                  {result.exam?.questions?.[selectedQuestion]?.question ||
                    "Question not found"}
                </p>
              </div>

              {/* Your Answer */}
              <div>
                <p className="text-sm text-gray-400 mb-1">Your Answer</p>
                <p className="text-white">
                  {getUserAnswer(result.answers[selectedQuestion].answer)}
                </p>
              </div>

              {/* Result */}
              <div className="bg-neutral-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Result</p>
                <p
                  className={`text-lg font-semibold ${result.answers[selectedQuestion].isCorrect ? "text-green-400" : "text-red-400"}`}
                >
                  {result.answers[selectedQuestion].isCorrect
                    ? "✅ Correct"
                    : "❌ Incorrect"}
                </p>
              </div>

              {/* ✅ NO correct answer shown here! */}
            </div>

            <button
              onClick={closeModal}
              className="mt-6 w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;
