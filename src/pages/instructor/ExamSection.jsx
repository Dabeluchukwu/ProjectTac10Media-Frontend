import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const ExamSection = ({ examData, onChange }) => {
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [exam, setExam] = useState({
    title: "",
    description: "",
    passingScore: 70,
    timeLimit: 45,
    questions: [],
    isPublished: false,
  });
  
  // ✅ Use refs to track previous values
  const isFirstRender = useRef(true);
  const isUpdatingFromParent = useRef(false);
  const prevExamDataRef = useRef(examData);

  // Load exam data when provided (only when it actually changes)
  useEffect(() => {
    const examDataStr = JSON.stringify(examData);
    const prevExamDataStr = JSON.stringify(prevExamDataRef.current);
    
    if (examDataStr !== prevExamDataStr) {
      prevExamDataRef.current = examData;
      isUpdatingFromParent.current = true;
      
      if (examData) {
        setExam({
          title: examData.title || "",
          description: examData.description || "",
          passingScore: examData.passingScore || 70,
          timeLimit: examData.timeLimit || 45,
          questions: examData.questions || [],
          isPublished: examData.isPublished || false,
        });
      }
      isUpdatingFromParent.current = false;
    }
  }, [examData]);

  // Update parent when exam changes (but not on first render and not when updating from parent)
  useEffect(() => {
    // Skip the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Skip if we're updating from parent
    if (isUpdatingFromParent.current) {
      return;
    }
    
    if (onChange) {
      onChange(exam);
    }
  }, [exam, onChange]);

  const handleChange = (field, value) => {
    setExam((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      question: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    };
    setExam((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
    // Auto-expand the new question
    setExpandedQuestions((prev) => [...prev, prev.length]);
  };

  const removeQuestion = (index) => {
    setExam((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
    setExpandedQuestions((prev) => prev.filter((i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    setExam((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const updateOption = (qIndex, oIndex, value) => {
    setExam((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIndex].options];
      options[oIndex] = value;
      questions[qIndex].options = options;
      return { ...prev, questions };
    });
  };

  const toggleQuestionExpand = (index) => {
    setExpandedQuestions((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const togglePublish = () => {
    setExam((prev) => ({ ...prev, isPublished: !prev.isPublished }));
  };

  const isQuestionExpanded = (index) => expandedQuestions.includes(index);

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">📝 Exam Settings</h2>
          <p className="text-sm text-gray-400 mt-1">
            Create an exam for students to take after completing the course
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-400">Published</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={exam.isPublished}
                onChange={togglePublish}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-700 peer-focus:ring-2 peer-focus:ring-amber-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </div>
          </label>
          <span className={`text-xs px-2 py-1 rounded ${exam.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
            {exam.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Exam Details */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Exam Title *
            </label>
            <input
              type="text"
              value={exam.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Final Exam - Cinematography Basics"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={exam.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of the exam"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Passing Score (%) *
            </label>
            <input
              type="number"
              value={exam.passingScore}
              onChange={(e) => handleChange("passingScore", parseInt(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Time Limit (minutes) *
            </label>
            <input
              type="number"
              value={exam.timeLimit}
              onChange={(e) => handleChange("timeLimit", parseInt(e.target.value) || 0)}
              min="1"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="border-t border-neutral-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Questions</h3>
            <p className="text-sm text-gray-400">
              {exam.questions?.length || 0} questions added
            </p>
          </div>
          <button
            type="button"
            onClick={addQuestion}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add Question
          </button>
        </div>

        {!exam.questions || exam.questions.length === 0 ? (
          <div className="text-center py-8 bg-neutral-800 rounded-lg border border-dashed border-neutral-700">
            <p className="text-gray-400">No questions added yet.</p>
            <button
              type="button"
              onClick={addQuestion}
              className="mt-2 text-amber-400 hover:text-amber-300 transition"
            >
              Add your first question →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {exam.questions.map((q, qIndex) => {
              const isExpanded = isQuestionExpanded(qIndex);

              return (
                <div
                  key={qIndex}
                  className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden"
                >
                  {/* Question Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-700/50 transition"
                    onClick={() => toggleQuestionExpand(qIndex)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-400">
                        #{qIndex + 1}
                      </span>
                      <span className="text-sm text-white truncate">
                        {q.question || "Untitled Question"}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {q.type === "multiple-choice" ? "Multiple Choice" : "True/False"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(qIndex);
                        }}
                        className="text-red-400 hover:text-red-300 transition p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Question Body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-neutral-700 space-y-4">
                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Question Text *
                        </label>
                        <input
                          type="text"
                          value={q.question || ""}
                          onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                          placeholder="Enter your question"
                          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Question Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Question Type
                        </label>
                        <select
                          value={q.type || "multiple-choice"}
                          onChange={(e) => {
                            const newType = e.target.value;
                            updateQuestion(qIndex, "type", newType);
                            if (newType === "true-false") {
                              updateQuestion(qIndex, "options", ["True", "False"]);
                            } else {
                              updateQuestion(qIndex, "options", ["", "", "", ""]);
                            }
                            updateQuestion(qIndex, "correctAnswer", "");
                          }}
                          className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True / False</option>
                        </select>
                      </div>

                      {/* Options */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Options
                        </label>
                        {q.type === "true-false" ? (
                          <div className="grid grid-cols-2 gap-3">
                            {q.options && q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={q.correctAnswer === opt}
                                  onChange={() => updateQuestion(qIndex, "correctAnswer", opt)}
                                  className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                                />
                                <span className="text-sm text-white">{opt}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {q.options && q.options.map((opt, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-3">
                                <span className="text-sm text-gray-400 w-6">
                                  {String.fromCharCode(65 + oIndex)}.
                                </span>
                                <input
                                  type="text"
                                  value={opt || ""}
                                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  className="flex-1 bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            ))}
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-400 mb-1">
                                Correct Answer *
                              </label>
                              <select
                                value={q.correctAnswer || ""}
                                onChange={(e) => updateQuestion(qIndex, "correctAnswer", e.target.value)}
                                className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                              >
                                <option value="">Select correct answer</option>
                                {q.options && q.options.map((opt, oIndex) => (
                                  opt && (
                                    <option key={oIndex} value={opt}>
                                      {String.fromCharCode(65 + oIndex)}. {opt}
                                    </option>
                                  )
                                ))}
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Points */}
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Points
                        </label>
                        <input
                          type="number"
                          value={q.points || 1}
                          onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value) || 1)}
                          min="1"
                          className="w-24 bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {exam.questions && exam.questions.length > 0 && (
        <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Total Questions</p>
              <p className="text-white font-semibold">{exam.questions.length}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Points</p>
              <p className="text-white font-semibold">
                {exam.questions.reduce((sum, q) => sum + (q.points || 1), 0)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Passing Score</p>
              <p className="text-white font-semibold">{exam.passingScore}%</p>
            </div>
            <div>
              <p className="text-gray-400">Time Limit</p>
              <p className="text-white font-semibold">{exam.timeLimit} mins</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSection;