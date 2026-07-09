import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useEnrollCourse from "../../../hooks/useEnrollCourse";
import useCourseEnrollment from "../../../hooks/useCourseEnrollment";
import useAuthStore from "../../../store/authStore";

import { fetchCourse } from "../../../services/courseService";

// Skeleton loader

const CourseSkeleton = () => (
  <div className="min-h-screen bg-[#0b0b0b] text-white">
    <div className="w-full h-[500px] bg-neutral-800 animate-pulse" />

    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="h-16 w-3/4 bg-neutral-800 rounded animate-pulse" />

      <div className="mt-6 h-8 w-1/2 bg-neutral-800 rounded animate-pulse" />

      <div className="mt-8 flex gap-5">
        <div className="h-12 w-24 bg-neutral-800 rounded animate-pulse" />

        <div className="h-12 w-24 bg-neutral-800 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const CourseDetails = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // Current logged in user

  const user = useAuthStore((state) => state.user);

  // Check enrollment status from backend

  const { isEnrolled } = useCourseEnrollment(id);

  // Enrollment mutation

  const enrollCourse = useEnrollCourse({
    onSuccess: () => {
      alert("Course registration successful");

      navigate("/dashboard/courses");
    },

    onError: (error) => {
      alert(error.response?.data?.message || "Registration failed");
    },
  });

  // Fetch course

  const {
    data: course,

    isLoading,

    error,
  } = useQuery({
    queryKey: ["course", id],

    queryFn: () => fetchCourse(id),

    enabled: !!id,

    retry: 1,

    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return <CourseSkeleton />;
  }

  if (error) {
    return (
      <div
        className="
      min-h-screen
      bg-[#0b0b0b]
      text-white
      flex
      flex-col
      items-center
      justify-center
      px-4
      "
      >
        <h2
          className="
        text-2xl
        font-bold
        text-red-400
        mb-4
        "
        >
          Failed to load course
        </h2>

        <p
          className="
        text-neutral-400
        mb-6
        "
        >
          {error.response?.data?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="
      min-h-screen
      bg-[#0b0b0b]
      text-white
      flex
      items-center
      justify-center
      "
      >
        Course not found
      </div>
    );
  }

  return (
    <main
      className="
min-h-screen
bg-[#0b0b0b]
text-white
"
    >
      {/* Hero */}

      <section
        className="
relative
"
      >
        <img
          src={course.image || "/fallback-course-image.jpg"}
          alt={course.title}
          className="
w-full
h-[500px]
object-cover
"
          onError={(e) => {
            e.currentTarget.src = "/fallback-course-image.jpg";
          }}
        />

        <div
          className="
absolute
inset-0
bg-black/70
"
        />

        <div
          className="
absolute
inset-0
flex
items-center
"
        >
          <div
            className="
max-w-5xl
mx-auto
px-6
"
          >
            <h1
              className="
text-6xl
font-serif
font-bold
"
            >
              {course.title}
            </h1>

            <p
              className="
mt-6
text-xl
text-neutral-300
max-w-3xl
"
            >
              {course.description}
            </p>

            <div
              className="
mt-8
flex
flex-wrap
gap-5
"
            >
              {course.level && (
                <span
                  className="
border
border-neutral-600
px-4
py-2
rounded
"
                >
                  📚 {course.level}
                </span>
              )}

              {course.duration && (
                <span
                  className="
border
border-neutral-600
px-4
py-2
rounded
"
                >
                  ⏱️ {course.duration}
                </span>
              )}

              {course.instructor && (
                <span
                  className="
border
border-neutral-600
px-4
py-2
rounded
"
                >
                  👨‍🏫
                  {course.instructor.firstName} {course.instructor.lastName}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}

      <section
        className="
max-w-5xl
mx-auto
px-6
py-16
"
      >
        <div
          className="
flex
justify-between
items-start
mb-8
flex-wrap
gap-4
"
        >
          <h2
            className="
text-4xl
font-serif
"
          >
            Course Content
          </h2>

          {isEnrolled && (
            <span
              className="
bg-green-600
px-4
py-2
rounded-lg
"
            >
              ✅ Already Enrolled
            </span>
          )}
        </div>

        {!course.modules || course.modules.length === 0 ? (
          <div
            className="
text-neutral-400
text-center
py-12
"
          >
            No modules available yet.
          </div>
        ) : (
          course.modules.map((module) => (
            <div
              key={module._id}
              className="
mb-10
"
            >
              <h3
                className="
text-2xl
font-semibold
mb-4
"
              >
                {module.title}
              </h3>

              <div
                className="
space-y-3
"
              >
                {module.lessons?.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="
bg-neutral-900
p-4
rounded
"
                  >
                    <div
                      className="
flex
gap-3
"
                    >
                      <span
                        className="
text-neutral-500
"
                      >
                        {index + 1}
                      </span>

                      <span>{lesson.title}</span>

                      {lesson.duration && (
                        <span
                          className="
ml-auto
text-neutral-500
"
                        >
                          {lesson.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Enroll */}

        {!isEnrolled ? (
          <button
            onClick={() => {
              if (!user) {
                navigate(
                  "/login",

                  {
                    state: {
                      from: `/courses/${id}`,
                    },
                  },
                );

                return;
              }

              enrollCourse.mutate(course._id);
            }}
            disabled={enrollCourse.isPending}
            className="
mt-10
bg-amber-300
text-black
px-8
py-4
rounded-lg
font-semibold
hover:bg-amber-400
transition
"
          >
            {enrollCourse.isPending ? "Enrolling..." : "Enroll Now"}
          </button>
        ) : (
          <button
            onClick={() => navigate("/dashboard/courses")}
            className="
mt-10
bg-neutral-700
text-white
px-8
py-4
rounded-lg
font-semibold
"
          >
            Go to My Courses
          </button>
        )}
      </section>
    </main>
  );
};

export default CourseDetails;
