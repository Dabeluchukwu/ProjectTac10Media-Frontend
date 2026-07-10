import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import router from "./app/router";
import Providers from "./app/providers";

// Optional: Loading component for better UX
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      <p className="text-amber-400 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Providers>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  );
}

export default App;