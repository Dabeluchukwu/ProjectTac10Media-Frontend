import { useQuery } from "@tanstack/react-query";
import { fetchCourse } from "../services/courseService";

const useCourse = (courseId) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetchCourse(courseId),
    enabled: !!courseId,
    staleTime: 0, // ✅ Always refetch
    gcTime: 0, // ✅ Don't cache (React Query v5)
  });

  return {
    course: data,
    loading: isLoading,
    error,
    refetch,
  };
};

export default useCourse;