import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { defineWindowEvents } from "tauri-mw-store";
import VersionUpdateUtils from "@/utils/version-update";
import { Window } from "@tauri-apps/api/window";
import { EventKey } from "./types";
import { initAppStore } from "./store/appStore";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";

import "@/styles/globals.css";
// Supports weights 100-800
import "@fontsource-variable/jetbrains-mono";

// 先初始化总 store，再执行其他初始化逻辑
await initAppStore();

// 简化的应用初始化
async function initializeApp() {
  const windowLabel = Window.getCurrent().label;

  try {
    const updater = new VersionUpdateUtils();
    // 使用声明式事件注册
    await defineWindowEvents({
      main: {
        listeners: {
          [EventKey.CHECK_UPDATE]: () => updater.checkForUpdates(),
          [EventKey.INSTALL_REQUEST]: () => updater.askAndInstall(),
        },
        onInit: () => {
          console.log("✅ 主窗口初始化完成");
        },
      },
      settings: {
        emitOnInit: [EventKey.CHECK_UPDATE],
        onInit: () => {
          console.log("✅ 设置窗口初始化完成");
        },
      },
    });

    console.log(`✅ 窗口 ${windowLabel} 初始化完成`);
  } catch (error) {
    console.error(`❌ 窗口 ${windowLabel} 初始化失败:`, error);
  }
}

// 执行初始化
await initializeApp();

// 禁用右键菜单
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("contextmenu", (e) => {
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
