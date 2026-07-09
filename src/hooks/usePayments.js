import { useQuery } from "@tanstack/react-query";

import { getMyPayments } from "../api/paymentApi";

const usePayments = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["payments"],

    queryFn: getMyPayments,
  });

  return {
    payments: data?.data?.data || [],

    loading: isLoading,

    error,
  };
};

export default usePayments;
