import { useQueries } from "@tanstack/react-query";
import { getExamByCourse, getAttemptStatus } from "../api/examApi";

export const useExamStatus = (courses) => {
  // Get exam for each course
  const examQueries = useQueries({
    queries: (courses || []).map((course) => ({
      queryKey: ["exam", course.courseId],
      queryFn: () => getExamByCourse(course.courseId).then((res) => res.data.data),
      enabled: !!course.courseId,
      retry: false,
    })),
  });

  // Get attempt status for each exam
  const attemptQueries = useQueries({
    queries: examQueries.map((examQuery, index) => ({
      queryKey: ["exam-attempt", examQuery.data?._id],
      queryFn: () => getAttemptStatus(examQuery.data?._id).then((res) => res.data.data),
      enabled: !!examQuery.data?._id,
      retry: false,
    })),
  });

  // Build results
  const results = (courses || []).map((course, index) => {
    const exam = examQueries[index]?.data;
    const attempt = attemptQueries[index]?.data;
    const isLoading = examQueries[index]?.isLoading || attemptQueries[index]?.isLoading;

    return {
      courseId: course.courseId,
      exam,
      attempt,
      isLoading,
      hasExam: !!exam,
      hasAttempt: !!attempt,
      isPassed: attempt?.passed || false,
      isFailed: attempt && !attempt.passed && attempt.status === "submitted",
      isInProgress: attempt?.status === "in-progress",
      certificate: attempt?.certificate || null,
    };
  });

  return {
    results,
    isLoading: examQueries.some((q) => q.isLoading) || attemptQueries.some((q) => q.isLoading),
  };
};