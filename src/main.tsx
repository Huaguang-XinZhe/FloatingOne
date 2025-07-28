import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { initializeConfig } from "@/store";
import "@/styles/globals.css";
// Supports weights 100-800
import "@fontsource-variable/jetbrains-mono";
import { initializeTray } from "@/utils/trayManager";

// 应用启动时初始化配置
initializeConfig()
  .then(() => {
    console.log("Configuration initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize configuration:", error);
  });

// 初始化系统托盘
initializeTray()
  .then(() => {
    console.log("System tray initialized");
  })
  .catch((error) => {
    console.error("Failed to initialize system tray:", error);
  });

// 禁用右键菜单
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
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
