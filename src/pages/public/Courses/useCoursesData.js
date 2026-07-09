import { fallbackData } from "./coursesContent";
import { deepMerge } from "../../../utils/deepMerge";
import { useMemo } from "react";

const useCoursesData = (apiData = null) => {
  const data = useMemo(() => {
    return deepMerge(fallbackData, apiData ?? {});
  }, [apiData]);

  return data;
};

export default useCoursesData;