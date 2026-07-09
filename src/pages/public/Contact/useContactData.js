// src/hooks/useAboutData.js

import { useMemo } from "react";
import contactData from "./contactContent";
import { deepMerge } from "../../../utils/deepMerge";


const useContactData = (apiData = null) => {
  const data = useMemo(() => {
    return deepMerge(contactData, apiData ?? {});
  }, [apiData]);

  return data;
};

export default useContactData;