import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import router from "./app/router";
import Providers from "./app/providers";

function App() {
  return (
    <Providers>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  );
}

export default App;