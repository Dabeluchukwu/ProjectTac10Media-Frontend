import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import Providers from "./app/providers";
import useAuthStore from "./store/authStore";

// hydrate Zustand from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (user && token) {
  useAuthStore.setState({
    user,
    token,
  });
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);