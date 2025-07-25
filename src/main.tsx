import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { initializeConfig } from "@/store";
import "@/styles/globals.css";
// Supports weights 100-800
import "@fontsource-variable/jetbrains-mono";

// 应用启动时初始化配置
initializeConfig()
  .then(() => {
    console.log("Configuration initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize configuration:", error);
  });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
