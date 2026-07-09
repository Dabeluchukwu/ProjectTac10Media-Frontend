// src/hooks/useAboutData.js

import { useMemo } from "react";
import aboutData from "./aboutContent";
import { deepMerge } from "../../../utils/deepMerge";


const useAboutData = (apiData = null) => {
  const data = useMemo(() => {
    return deepMerge(aboutData, apiData ?? {});
  }, [apiData]);

  return data;
};

export default useAboutData;