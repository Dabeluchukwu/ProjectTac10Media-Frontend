import { useQuery } from "@tanstack/react-query";

import { getCourses } from "../api/courseApi";

const useCourses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],

    queryFn: getCourses,
  });

  return {
    courses: data?.data?.data || [],

    loading: isLoading,

    error,
  };
};

export default useCourses;
