import { useMemo } from "react";
import Hero from "../../../components/course/Hero";
import CourseCard from "../../../components/course/CourseGrid";
import CTA from "../../../components/course/CTA";
import usePageData from "./useCoursesData";
import useCourses from "../../../hooks/useCourses";

const Courses = () => {
  const page = usePageData();

  const {
    courses,           // ← From your hook
    loading: isLoading,
    error
  } = useCourses();

  // Featured course is the first one in the list
  const featuredCourse = useMemo(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      return courses[0];
    }
    return null;
  }, [courses]);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      <Hero
        data={page?.hero}
        featuredCourse={featuredCourse}
        onStartWatching={(course) => {
          console.log(course);
        }}
      />

      {/* Course Library */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <h2 className="font-serif text-4xl text-white">
              {page?.library?.title}
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {page?.library?.filters?.map((filter) => (
                <button
                  key={filter}
                  className="rounded-full border border-neutral-700 px-5 py-2 text-sm text-neutral-300 transition hover:border-amber-300 hover:text-amber-300"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-xl bg-neutral-900"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center text-red-300">
              Failed to load courses.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && courses.length === 0 && (
            <div className="rounded-lg border border-neutral-800 py-16 text-center text-neutral-400">
              {page?.library?.emptyMessage}
            </div>
          )}

          {/* Grid */}
          {!isLoading && !error && courses.length > 0 && (
            <>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    key={course?._id}
                    course={course}
                    onViewDetails={(selectedCourse) => {
                      console.log(selectedCourse);
                    }}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <button className="rounded-md border border-amber-300 px-8 py-3 font-medium text-amber-300 transition hover:bg-amber-300 hover:text-black">
                  {page?.library?.loadMore}
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <CTA
        data={page?.cta}
         onPrimaryClick="/register"
  onSecondaryClick="/plans-and-pricing"
      />
    </main>
  );
};

export default Courses;