import { useQuery } from "@tanstack/react-query";
import { getMyProgress } from "../api/progressApi";

const useProgress = (registrations = []) => {
  const courseIds = registrations
    .map((registration) => registration.course?._id || registration.courseId)
    .filter(Boolean);

  const { data, isLoading, error } = useQuery({
    queryKey: ["progress", courseIds],
    queryFn: async () => {
      if (courseIds.length === 0) return [];

      const responses = await Promise.all(
        courseIds.map(async (courseId) => {
          const response = await getMyProgress(courseId);

         const registration = registrations.find(
    (r) => (r.course?._id || r.courseId) === courseId
);

return {
    _id: courseId,
    course: registration?.course,
    completedLessons:
        response?.data?.data?.completedLessons || [],
    progressPercentage:
        response?.data?.data?.progressPercentage || 0,
};
        })
      );

      return responses;
    },
    enabled: courseIds.length > 0,
  });

  return {
    progress: data || [],
    loading: isLoading,
    error,
  };
};

export default useProgress;