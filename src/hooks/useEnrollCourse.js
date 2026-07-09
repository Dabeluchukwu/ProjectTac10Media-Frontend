import { useMutation, useQueryClient } from "@tanstack/react-query";

import { enrollCourseService } from "../services/courseRegistrationService";

const useEnrollCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (courseId) => enrollCourseService(courseId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["registrations"],
      });
    },
  });

  return mutation;
};

export default useEnrollCourse;
