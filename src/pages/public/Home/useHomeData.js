// import { fallbackHomeData } from "./homeContent";
// import { deepMerge } from "../../../utils/deepMerge";

// // Simulated API (replace later with real fetch)
// const apiData = null;

// export const useHomeData = () => {
//   const mergedData = deepMerge(fallbackHomeData, apiData);

//   return {
//     hero: mergedData.hero,
//     legacy: mergedData.legacy,
//     services: mergedData.services,
//     masterclasses: mergedData.masterclasses,
//      closingCTA: mergedData.closingCTA,
//   };
// };

// src/hooks/useAboutData.js

import { useMemo } from "react";
import { fallbackHomeData } from "./homeContent";
import { deepMerge } from "../../../utils/deepMerge";

const useHomeData = (apiData = null) => {
  const data = useMemo(() => {
    return deepMerge(fallbackHomeData, apiData ?? {});
  }, [apiData]);

  return data;
};

export default useHomeData;