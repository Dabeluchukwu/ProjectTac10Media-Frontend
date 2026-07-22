import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeLesson, getMyProgress } from "../../api/progressApi";
import { toast } from "react-hot-toast";
import useCourse from "../../hooks/useCourse";
import useRegistrations from "../../hooks/useRegistrations";
import useAuthStore from "../../store/authStore";
import VideoPlayer from "../../components/media/VideoPlayer";

const LearnCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletionCelebration, setShowCompletionCelebration] =
    useState(false);

  // Get registrations with enhanced functionality
  const {
    registrations,
    loading: registrationsLoading,
    getEnrollmentStatus,
    getPaymentStatus,
    isPendingPayment,
    isActiveEnrollment,
    getEnrollment,
    refetch: refetchRegistrations,
  } = useRegistrations();

  // ✅ Get course with refetch (ONLY ONCE)
  const {
    course,
    loading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
  } = useCourse(courseId);

  // ✅ Find registration for this course
  const registration = registrations?.find(
    (reg) => reg.course?._id === courseId || reg.courseId === courseId,
  );

  // ✅ Get registration ID
  const registrationId = registration?._id;

  // ✅ Force refetch course and registrations on mount to get fresh data
  useEffect(() => {
    if (courseId) {
      console.log("🔄 Refetching course and registration data...");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      refetchCourse();
      refetchRegistrations();
    }
  }, [courseId]);

  // ✅ Log lesson IDs to debug
  useEffect(() => {
    if (course) {
      console.log("📊 Course loaded:", course.title);
      console.log("📊 Course ID:", course._id);
      console.log("📊 Lessons in course:");
      course.modules?.forEach((module, mIdx) => {
        module.lessons?.forEach((lesson, lIdx) => {
          console.log(`  ${mIdx}-${lIdx}: ${lesson._id} - ${lesson.title}`);
        });
      });
    }
  }, [course]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { from: `/dashboard/learn/${courseId}` },
      });
    }
  }, [user, navigate, courseId]);

  // Auto-select first lesson
  useEffect(() => {
    if (course?.modules?.length > 0 && !selectedLesson) {
      const firstLesson = course.modules[0].lessons?.[0];
      if (firstLesson) {
        setSelectedLesson(firstLesson);
      }
    }
  }, [course, selectedLesson]);

  // Debug enrollment
  useEffect(() => {
    if (!registrationsLoading) {
      const status = getEnrollmentStatus(courseId);
      const paymentStatus = getPaymentStatus(courseId);
      const enrollment = getEnrollment(courseId);

      console.log("🔍 ENROLLMENT DEBUG:");
      console.log("Course ID:", courseId);
      console.log("User:", user);
      console.log("Registrations:", registrations);
      console.log("Registration ID:", registrationId);
      console.log("Enrollment Status:", status);
      console.log("Payment Status:", paymentStatus);
      console.log("Full Enrollment:", enrollment);
      console.log("Is Active:", isActiveEnrollment(courseId));
      console.log("Is Pending:", isPendingPayment(courseId));
    }
  }, [
    courseId,
    user,
    registrations,
    registrationsLoading,
    getEnrollmentStatus,
    getPaymentStatus,
    isActiveEnrollment,
    isPendingPayment,
    getEnrollment,
    registrationId,
  ]);

  // Fetch existing progress
  const { data: progressData, refetch: refetchProgress } = useQuery({
    queryKey: ["progress", courseId],
    queryFn: async () => {
      try {
        const response = await getMyProgress(courseId);
        if (response.status === 404 || !response.data?.data) {
          return {
            completedLessons: [],
            progressPercentage: 0,
          };
        }
        return response.data.data;
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        return {
          completedLessons: [],
          progressPercentage: 0,
        };
      }
    },
    enabled: !!courseId && isActiveEnrollment(courseId),
    retry: 1,
  });

  // Calculate progress
  const courseProgress = progressData?.progressPercentage || 0;
  const isCourseCompleted = courseProgress === 100;

  // Show celebration when course is completed
  useEffect(() => {
    if (isCourseCompleted && progressData) {
      setShowCompletionCelebration(true);
      const timer = setTimeout(() => setShowCompletionCelebration(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isCourseCompleted, progressData]);

  // Load progress into state
  useEffect(() => {
    if (progressData?.completedLessons) {
      const completedMap = {};
      progressData.completedLessons.forEach((lessonId) => {
        completedMap[lessonId] = { completed: true, completedAt: new Date() };
      });
      setLessonProgress(completedMap);
    }
  }, [progressData]);

  // Complete lesson mutation
  const completeLessonMutation = useMutation({
    mutationFn: async ({ courseId, lessonId }) => {
      console.log("🔄 Completing lesson:", { courseId, lessonId });

      try {
        const response = await completeLesson(courseId, lessonId);
        console.log("✅ Completion response:", response);
        return response;
      } catch (error) {
        console.error("❌ Completion error:", error);

        if (error.response?.status === 403) {
          toast.error(
            "You're not enrolled in this course or don't have permission.",
          );
        } else if (error.response?.status === 404) {
          toast.error("Course or lesson not found.");
        } else {
          toast.error(error.message || "Failed to complete lesson");
        }

        throw error;
      }
    },
    onSuccess: () => {
      console.log("✅ Mutation success, refetching progress...");
      refetchProgress();
      queryClient.invalidateQueries({ queryKey: ["progress", courseId] });
      toast.success("Lesson completed! 🎉");
    },
    onError: (error) => {
      console.error("❌ Mutation error:", error);
      setLessonProgress((prev) => {
        const newState = { ...prev };
        delete newState[selectedLesson?._id];
        return newState;
      });
    },
    onSettled: () => {
      setIsCompleting(false);
    },
  });

  const handleLessonComplete = (lessonId) => {
    if (lessonProgress[lessonId]?.completed || isCompleting) return;

    console.log("📤 handleLessonComplete called with lessonId:", lessonId);
    console.log("📤 lessonId type:", typeof lessonId);
    console.log("📤 Course ID:", courseId);

    // ✅ Ensure lessonId is a string
    const lessonIdString = String(lessonId);
    console.log("📤 lessonId as string:", lessonIdString);

    setIsCompleting(true);

    // Optimistic update
    setLessonProgress((prev) => ({
      ...prev,
      [lessonIdString]: { completed: true, completedAt: new Date() },
    }));

    completeLessonMutation.mutate({
      courseId,
      lessonId: lessonIdString,
    });
  };

  // Loading states
  if (registrationsLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your course...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-red-400 p-6">
        <h2 className="text-2xl font-bold mb-4">Failed to load course</h2>
        <p>{courseError?.message || "Course not found"}</p>
        <button
          onClick={() => navigate("/dashboard/courses")}
          className="mt-4 bg-amber-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  // ✅ Check enrollment status using the helper functions
  const enrollmentStatus = getEnrollmentStatus(courseId);
  const isActive = isActiveEnrollment(courseId);
  const isPending = isPendingPayment(courseId);
  const paymentStatus = getPaymentStatus(courseId);
  const enrollment = getEnrollment(courseId);

 // Case 1: Payment is pending
if (isPending) {
  // ✅ Auto-refresh registration data when payment is pending
  useEffect(() => {
    if (isPending) {
      console.log("🔄 Payment is pending - checking for updates...");
      const interval = setInterval(() => {
        console.log("🔄 Auto-refreshing registration data...");
        queryClient.invalidateQueries({ queryKey: ["registrations"] });
        refetchRegistrations();
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPending, queryClient, refetchRegistrations]);

  console.log("🔍 PENDING PAYMENT - Course price:", course?.price);
  console.log("🔍 PENDING PAYMENT - Registration:", registration);
  console.log("🔍 PENDING PAYMENT - Registration ID:", registrationId);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-neutral-900 rounded-xl p-8 max-w-md w-full border border-neutral-800">
        <div className="text-center">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-amber-400 mb-4">
            Payment Required
          </h2>
          <p className="text-gray-400 mb-2">
            You've started the enrollment process but haven't completed
            payment yet.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Complete your payment to access the course content.
          </p>

          <div className="bg-neutral-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-400">Course</p>
            <p className="text-white font-semibold">{course?.title}</p>
            <p className="text-sm text-gray-400 mt-2">Amount Due</p>
            <p className="text-2xl font-bold text-amber-400">
              ₦{course?.price?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Status: Pending</p>
            {paymentStatus && (
              <p className="text-xs text-gray-500">
                Payment: {paymentStatus}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                const coursePrice = course?.price || 0;

                let regId = registrationId || registration?._id || registration?.id;

                if (!regId && registrations) {
                  const found = registrations.find((reg) => {
                    const regCourseId = reg.course?._id || reg.courseId;
                    return regCourseId === courseId;
                  });
                  if (found) {
                    regId = found._id || found.id;
                  }
                }

                if (!regId) {
                  toast.error("Registration not found. Please try again.");
                  return;
                }

                if (coursePrice <= 0) {
                  toast.success("This course is free! Access granted.");
                  navigate(`/dashboard/learn/${courseId}`);
                  return;
                }

                navigate(
                  `/checkout/${courseId}?registrationId=${regId}&amount=${coursePrice}&purpose=course`,
                );
              }}
              className="w-full bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              Complete Payment Now (₦{course?.price?.toLocaleString() || 0})
            </button>
            
            {/* ✅ Check Payment Status Button */}
            <button
              onClick={() => {
                console.log("🔄 Manual refresh triggered...");
                queryClient.invalidateQueries({ queryKey: ["registrations"] });
                queryClient.invalidateQueries({ queryKey: ["progress", courseId] });
                refetchRegistrations();
                toast.success("Checking payment status...");
              }}
              className="w-full bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-600 transition"
            >
              🔄 Check Payment Status
            </button>
            
            <button
              onClick={() => navigate("/dashboard/courses")}
              className="w-full bg-neutral-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
            >
              ← Back to My Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Case 2: Cancelled or Expired
  if (enrollmentStatus === "cancelled" || enrollmentStatus === "expired") {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-neutral-900 rounded-xl p-8 max-w-md w-full border border-neutral-800">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Access{" "}
              {enrollmentStatus === "cancelled" ? "Cancelled" : "Expired"}
            </h2>
            <p className="text-gray-400 mb-6">
              Your enrollment has been {enrollmentStatus}. You no longer have
              access to this course.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="w-full bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Renew Enrollment
              </button>
              <button
                onClick={() => navigate("/dashboard/courses")}
                className="w-full bg-neutral-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
              >
                ← Back to My Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Not enrolled at all
  if (!isActive && !isPending) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-neutral-900 rounded-xl p-8 max-w-md w-full border border-neutral-800">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-amber-400 mb-4">
              Access Restricted
            </h2>
            <p className="text-gray-400 mb-6">
              You need to enroll in this course to access the content.
            </p>

            {course?.price && course.price > 0 && (
              <div className="bg-neutral-800 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-400">Course Price</p>
                <p className="text-2xl font-bold text-white">₦{course.price}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/checkout/${courseId}`)}
                className="w-full bg-amber-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                {course?.price && course.price > 0
                  ? `Enroll Now - ₦${course.price}`
                  : "Enroll Now"}
              </button>
              <button
                onClick={() => navigate(`/courses/${courseId}`)}
                className="w-full bg-neutral-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-neutral-700 transition"
              >
                View Course Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ If we get here, the user has active enrollment - show the course content
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="text-gray-400 hover:text-white transition flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to My Courses
          </button>
          <h1 className="text-lg font-semibold truncate max-w-md">
            {course.title}
          </h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Course Progress</span>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-semibold ${
                  isCourseCompleted ? "text-green-400" : "text-amber-400"
                }`}
              >
                {courseProgress}%
              </span>
              {isCourseCompleted && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  🎉 Complete!
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-neutral-700 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isCourseCompleted ? "bg-green-500" : "bg-amber-500"
              }`}
              style={{ width: `${courseProgress}%` }}
            />
          </div>
          {isCourseCompleted && (
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <span>🎉</span> Congratulations! You've completed this course!
            </p>
          )}
        </div>

       
{isCourseCompleted && (
  <div className="mt-4 flex justify-center gap-4">
    <button
      onClick={() => navigate(`/exam/${courseId}`)}
      className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg shadow-green-600/20"
    >
      📝 Take Final Exam
    </button>
    
    {/* Check if certificate exists */}
    {registration?.hasCertificate && (
      <button
        onClick={() => navigate("/dashboard/certificates")}
        className="bg-amber-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 transition shadow-lg shadow-amber-500/20"
      >
        🎓 View Certificate
      </button>
    )}
  </div>
)}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 bg-neutral-900 rounded-xl p-5 border border-neutral-800 h-[600px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-5 text-white flex items-center justify-between">
              <span>Course Content</span>
              {courseProgress > 0 && (
                <span className="text-xs bg-neutral-700 px-2 py-1 rounded-full text-gray-300">
                  {courseProgress}%
                </span>
              )}
            </h2>

            {course.modules?.map((module, moduleIndex) => (
              <div key={module._id || moduleIndex} className="mb-6">
                <h3 className="text-amber-400 font-semibold mb-3 text-sm uppercase tracking-wide">
                  {module.title}
                </h3>

                <div className="space-y-2">
                  {module.lessons?.map((lesson, lessonIndex) => {
                    const isCompleted = lessonProgress[lesson._id]?.completed;
                    const isSelected = selectedLesson?._id === lesson._id;

                    return (
                      <button
                        key={lesson._id || lessonIndex}
                        onClick={() => {
                          console.log("📤 Selected lesson:", lesson);
                          console.log("  Lesson ID:", lesson._id);
                          setSelectedLesson(lesson);
                        }}
                        className={`
                          w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between
                          ${
                            isSelected
                              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                              : "bg-neutral-800 hover:bg-neutral-700 text-white"
                          }
                          ${isCompleted ? "border-l-4 border-green-500" : ""}
                        `}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <span
                              className={`text-xs ${
                                isSelected ? "text-black/70" : "text-gray-400"
                              }`}
                            >
                              {lesson.duration}
                            </span>
                          )}
                        </div>
                        {isCompleted && (
                          <span
                            className={`text-xs ${
                              isSelected ? "text-black" : "text-green-500"
                            }`}
                          >
                            ✅
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {(!course.modules || course.modules.length === 0) && (
              <p className="text-gray-500 text-sm">No modules available yet.</p>
            )}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedLesson.title}
                </h2>

                {selectedLesson.duration && (
                  <p className="text-gray-400 text-sm mb-4">
                    ⏱️ Duration: {selectedLesson.duration}
                  </p>
                )}

                {selectedLesson.videoUrl ? (
                  <VideoPlayer
                    url={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                    onComplete={() => handleLessonComplete(selectedLesson._id)}
                    onError={(error) => {
                      toast.error("Failed to load video");
                      console.error("Video error:", error);
                    }}
                  />
                ) : (
                  <div className="h-[350px] bg-black rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">
                      No video available for this lesson
                    </p>
                  </div>
                )}

                {selectedLesson.description && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      📝 Lesson Notes
                    </h3>
                    <div className="bg-neutral-800 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {selectedLesson.description}
                      </p>
                    </div>
                  </div>
                )}

                {selectedLesson.resourceUrl && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold text-lg mb-2">
                      📎 Resources
                    </h3>
                    <a
                      href={selectedLesson.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-lg transition border border-neutral-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Resource
                    </a>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => handleLessonComplete(selectedLesson._id)}
                    disabled={
                      lessonProgress[selectedLesson._id]?.completed ||
                      isCompleting
                    }
                    className={`
                      px-6 py-3 rounded-lg font-semibold transition-all duration-200
                      ${
                        lessonProgress[selectedLesson._id]?.completed
                          ? "bg-green-600 text-white hover:bg-green-700 cursor-default"
                          : "bg-amber-500 text-black hover:bg-amber-600 hover:scale-105"
                      }
                      ${isCompleting ? "opacity-50 cursor-not-allowed" : ""}
                      ${!isCompleting && !lessonProgress[selectedLesson._id]?.completed ? "hover:shadow-lg hover:shadow-amber-500/30" : ""}
                    `}
                  >
                    {isCompleting ? (
                      <>
                        <span className="inline-block animate-spin mr-2">
                          ⏳
                        </span>
                        Processing...
                      </>
                    ) : lessonProgress[selectedLesson._id]?.completed ? (
                      "✅ Completed"
                    ) : (
                      "Mark as Complete"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 flex flex-col items-center justify-center h-[500px]">
                <div className="text-gray-500 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Select a Lesson
                  </h3>
                  <p className="text-gray-400">
                    Choose a lesson from the sidebar to start learning
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnCourse;