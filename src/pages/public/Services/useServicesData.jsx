// src/pages/courses/useCoursesData.js

import { useMemo } from "react";
import pageData from "./servicesContent";
import { deepMerge } from "../../../utils/deepMerge";

const useServicesData = (apiData = null) => {
  const data = useMemo(() => {
    return deepMerge(pageData, apiData ?? {});
  }, [apiData]);

  return data;
};

export default useServicesData;