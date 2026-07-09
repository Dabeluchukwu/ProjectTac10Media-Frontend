import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExamByCourse,
  getAttemptStatus,
  startExam,
  retakeExam, // ✅ ADD THIS
  submitExam,
  getExamResults,
} from "../api/examApi";

export const useExam = (courseId) => {
  return useQuery({
    queryKey: ["exam", courseId],
    queryFn: () => getExamByCourse(courseId).then((res) => res.data.data),
    enabled: !!courseId,
    retry: 1,
  });
};

export const useAttemptStatus = (examId) => {
  return useQuery({
    queryKey: ["exam-attempt", examId],
    queryFn: () => getAttemptStatus(examId).then((res) => res.data.data),
    enabled: !!examId,
  });
};

export const useStartExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-attempt", variables.examId] });
    },
  });
};

// ✅ Add retake mutation
export const useRetakeExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: retakeExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-attempt", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["exam-results", variables.examId] });
    },
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-attempt", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["exam-results", variables.examId] });
    },
  });
};

export const useExamResults = (examId) => {
  return useQuery({
    queryKey: ["exam-results", examId],
    queryFn: () => getExamResults(examId).then((res) => res.data.data),
    enabled: !!examId,
  });
};