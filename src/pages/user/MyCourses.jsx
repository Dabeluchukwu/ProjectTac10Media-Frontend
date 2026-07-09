import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useRegistrations from "../../hooks/useRegistrations";
import useProgress from "../../hooks/useProgress";
import { useExamStatus } from "../../hooks/useExamStatus";
import { initializePayment } from "../../api/paymentApi";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/authStore";

const MyCourses = () => {
  const { registrations, loading, error } = useRegistrations();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // ✅ Ensure registrations is an array before passing to useProgress
  const registrationsArray = Array.isArray(registrations) ? registrations : [];
  const { progress: allProgress, loading: progressLoading } =
    useProgress(registrationsArray);

  // ✅ Get exam status for all courses
  const courseIds = registrationsArray.map((reg) => ({
    courseId: reg.course?._id || reg.courseId,
  }));
  const { results: examResults, isLoading: examLoading } = useExamStatus(courseIds);

  useEffect(() => {
    console.log("📊 MyCourses - Registrations Data:");
    console.log("  Registrations array:", registrationsArray);
    console.log("  Registrations count:", registrationsArray.length);
    console.log("  Exam Results:", examResults);
    
    registrationsArray.forEach((reg, index) => {
      console.log(`  Registration ${index + 1}:`);
      console.log(`    ID: ${reg._id}`);
      console.log(`    Course ID: ${reg.course?._id || reg.courseId}`);
      console.log(`    Course Title: ${reg.course?.title}`);
      console.log(`    Payment Status: ${reg.paymentStatus}`);
      console.log(`    Status: ${reg.status}`);
    });
  }, [registrationsArray, examResults]);

  if (loading || progressLoading || examLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-lg">
        <p className="font-semibold">Failed to load courses</p>
        <p className="text-sm mt-1">
          {error.message || "Please try again later"}
        </p>
      </div>
    );
  }

  const hasRegistrations = registrationsArray.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-400">My Courses</h1>

        <button
          onClick={() => navigate("/courses")}
          className="bg-amber-500 text-black px-5 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
        >
          Browse New Courses
        </button>
      </div>

      {!hasRegistrations ? (
        <div className="bg-white/5 p-12 rounded-xl shadow text-center border border-neutral-800">
          <p className="text-gray-400 text-lg">
            You haven't registered for any courses yet.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-4 bg-amber-500 px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {registrationsArray.map((registration) => {
            const course = registration?.course || {};
            const courseId = course?._id || registration?.courseId || null;

            const courseProgress = allProgress?.find(
              (p) => p.course?._id === courseId || p.course === courseId,
            );
            const progressPercentage = courseProgress?.progressPercentage || 0;
            const isCompleted = progressPercentage === 100;

            // ✅ Get exam status for this course
            const examStatus = examResults?.find(
              (e) => e.courseId === courseId || e.courseId === course?._id
            );

            // Determine button state
            let buttonText = "Continue Learning";
            let buttonAction = () => {
              if (courseId) {
                navigate(`/dashboard/learn/${courseId}`);
              }
            };
            let buttonColor = "bg-amber-500 hover:bg-amber-600 text-black";
            let isDisabled = !courseId;

            // ✅ Only show exam/certificate buttons if course is completed
            if (isCompleted) {
              // Check if certificate exists (passed exam)
              if (examStatus?.isPassed) {
                buttonText = "🎓 View Certificate";
                buttonAction = () => navigate("/dashboard/certificates");
                buttonColor = "bg-green-600 hover:bg-green-700 text-white";
                isDisabled = false;
              } 
              // Check if exam was attempted and failed
              else if (examStatus?.isFailed) {
                buttonText = "📝 Retake Exam";
                buttonAction = () => navigate(`/exam/${courseId}`);
                buttonColor = "bg-red-600 hover:bg-red-700 text-white";
                isDisabled = false;
              } 
              // Check if exam exists for this course
              else if (examStatus?.hasExam) {
                buttonText = "📝 Take Exam";
                buttonAction = () => navigate(`/exam/${courseId}`);
                buttonColor = "bg-purple-600 hover:bg-purple-700 text-white";
                isDisabled = false;
              }
            }

            return (
              <div
                key={registration._id}
                className="bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-800 hover:border-amber-500/50 transition-all duration-300"
              >
                {/* Course Image */}
                <img
                  src={
                    course?.image ||
                    course?.thumbnail ||
                    "/images/placeholder-course.jpg"
                  }
                  alt={course?.title || "Course"}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/placeholder-course.jpg";
                  }}
                />

                <div className="p-5">
                  {/* Course Title */}
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {course?.title || "Untitled Course"}
                  </h2>

                  {/* Course Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course?.description?.slice(0, 100) ||
                      "No description available"}
                  </p>

                  {/* ✅ PROGRESS BAR */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Progress</span>
                      <span
                        className={
                          isCompleted ? "text-green-400" : "text-gray-300"
                        }
                      >
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-700 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted ? "bg-green-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    {isCompleted && (
                      <p className="text-xs text-green-400 mt-1">
                        🎉 Course Completed!
                      </p>
                    )}
                  </div>
                  
                  {/* ✅ Status Badges */}
                  {isCompleted && examStatus?.isPassed && (
                    <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                      <span>🎓</span>
                      <span>Certificate Earned!</span>
                    </div>
                  )}

                  {isCompleted && examStatus?.isFailed && (
                    <div className="mt-2 flex items-center gap-2 text-red-400 text-sm">
                      <span>❌</span>
                      <span>Exam Failed - Retake Available</span>
                    </div>
                  )}

                  {isCompleted && !examStatus?.hasExam && (
                    <div className="mt-2 flex items-center gap-2 text-yellow-400 text-sm">
                      <span>📝</span>
                      <span>No Exam Available</span>
                    </div>
                  )}

                  {/* Payment Status */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Payment:</span>
                    <span
                      className={
                        registration?.paymentStatus === "paid"
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {registration?.paymentStatus || "pending"}
                    </span>
                  </div>

                  {/* Registration Status */}
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-gray-300">
                      {registration?.status === 'approved' ? 'Active' : registration?.status || "active"}
                    </span>
                  </div>

                  {/* ✅ Pay Now Button */}
                  {registration?.paymentStatus === "pending" && (
                    <button
                      onClick={async () => {
                        const regId = registration?._id || registration?.id;
                        if (!regId) {
                          toast.error("Registration not found. Please try again.");
                          return;
                        }
                        const price = course?.price || 0;
                        if (price <= 0) {
                          toast.error("Invalid course price. Please contact support.");
                          return;
                        }
                        try {
                          const response = await initializePayment({
                            purpose: "course",
                            registrationId: regId,
                            email: user?.email,
                            referenceId: regId,
                            amount: price,
                          });
                          if (response?.data?.data?.authorizationUrl) {
                            window.location.href = response.data.data.authorizationUrl;
                          } else {
                            toast.error("Failed to initialize payment. Please try again.");
                          }
                        } catch (error) {
                          toast.error(
                            error?.response?.data?.message ||
                              "Failed to initialize payment. Please try again."
                          );
                        }
                      }}
                      className="mt-3 w-full bg-amber-500 text-black py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
                    >
                      💳 Pay Now (₦{course?.price?.toLocaleString() || 0})
                    </button>
                  )}

                  {/* ✅ Dynamic Button */}
                  {registration?.paymentStatus === "paid" && (
                    <button
                      onClick={buttonAction}
                      disabled={isDisabled}
                      className={`mt-3 w-full py-2 rounded-lg font-semibold transition ${buttonColor} ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {buttonText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;