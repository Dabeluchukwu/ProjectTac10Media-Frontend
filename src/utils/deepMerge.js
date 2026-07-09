export const deepMerge = (fallback, api) => {
  // If no API data, return fallback entirely
  if (!api) return fallback;

  // If not objects, API wins if defined
  if (typeof fallback !== "object" || fallback === null) {
    return api ?? fallback;
  }

  const result = Array.isArray(fallback) ? [...fallback] : { ...fallback };

  Object.keys(fallback).forEach((key) => {
    const fallbackValue = fallback[key];
    const apiValue = api?.[key];

    if (Array.isArray(fallbackValue)) {
      // arrays: API replaces if exists, else fallback
      result[key] = apiValue ?? fallbackValue;
    } else if (
      typeof fallbackValue === "object" &&
      fallbackValue !== null
    ) {
      // recursive merge for nested objects
      result[key] = deepMerge(fallbackValue, apiValue);
    } else {
      // primitive values
      result[key] = apiValue ?? fallbackValue;
    }
  });

  return result;
};