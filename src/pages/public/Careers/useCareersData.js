// src/hooks/useAboutData.js

import { useMemo } from "react";
import { careersContent } from "./careersContent";
import { deepMerge } from "../../../utils/deepMerge";


const useCareersData = (apiData = null) => {
  const data = useMemo(() => {
    return deepMerge(careersContent, apiData ?? {});
  }, [apiData]);

  return data;
};

export default useCareersData;