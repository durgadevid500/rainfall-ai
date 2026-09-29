import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";
import "./i18n";
import { registerSW } from "virtual:pwa-register";
registerSW({ immediate: true });

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);