// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { defineWindowEvents, window } from "tauri-mw-store";
import VersionUpdateUtils from "@/utils/version-update";
import { EventKey } from "./types";
import { initAppStore } from "./store/appStore";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";

import "@/styles/globals.css";
// Supports weights 100-800
import "@fontsource-variable/jetbrains-mono";

// 先初始化总 store，再执行其他初始化逻辑
await initAppStore();

await defineWindowEvents({
  // 🎯 使用 window() 函数获得完整类型提示
  main: window({
    onInit: () => {
      const updater = new VersionUpdateUtils();
      return { updater }; // 类型：{ updater: VersionUpdateUtils }
    },
    listeners: {
      // 💡 完整的类型提示：({ updater }: { updater: VersionUpdateUtils }) => void
      [EventKey.CHECK_UPDATE]: ({ updater }) => updater.checkForUpdates(),
      [EventKey.INSTALL_REQUEST]: ({ updater }) => updater.askAndInstall(),
      //                            ^^^^^^^ 这里有完整的类型提示和自动补全！
    },
  }),

  // 🎯 无返回值的窗口
  settings: window({
    onInit: () => {
      console.log("✅ 设置窗口初始化完成");
      // 无返回值，类型为 void
    },
    emitOnInit: [EventKey.CHECK_UPDATE],
  }),
});

// 禁用右键菜单
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider>
      <App />
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
