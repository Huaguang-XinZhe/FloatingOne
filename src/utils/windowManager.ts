import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Event } from "@tauri-apps/api/event";

interface CreateWindowOptions {
  url?: string;
  width?: number;
  height?: number;
  title?: string;
  decorations?: boolean;
  resizable?: boolean;
  center?: boolean;
  fitContent?: boolean; // 是否自动调整窗口大小以适应内容
  [key: string]: any; // 允许其他 WebviewWindow 选项
}

/**
 * 创建一个新窗口
 * @param label 窗口标识
 * @param options 窗口选项
 * @returns 创建的窗口实例
 */
export const createWindow = (
  label: string,
  options: CreateWindowOptions
): WebviewWindow => {
  // 提取 fitContent 选项，不传递给 WebviewWindow 构造函数
  const { fitContent = true, ...windowOptions } = options;
//   console.log("windowOptions", windowOptions);

  // 如果启用了自动调整大小，添加查询参数
  if (fitContent && windowOptions.url) {
    // // 打印的是前端地址：http://localhost:5173
    // console.log("origin", window.location.origin);
    windowOptions.url = windowOptions.url + "?fitContent=true";
  }

  const webviewWindow = new WebviewWindow(label, windowOptions);

  webviewWindow.once("tauri://created", () => {
    console.log(`窗口 ${label} 已创建`);
  });

  webviewWindow.once("tauri://error", (error: Event<unknown>) => {
    console.error(`窗口 ${label} 创建失败`, error);
  });

  return webviewWindow;
};

/**
 * 创建设置窗口
 * @param fitContent 是否自动调整窗口大小以适应内容
 * @returns 创建的设置窗口实例
 */
export const createSettingsWindow = (fitContent: boolean = true): WebviewWindow => {
  return createWindow("settings", {
    url: "/settings",
    title: "设置",
    width: 400,
    height: 380,
    decorations: false,
    resizable: false,
    center: true,
    transparent: true,
    shadow: false,
    skipTaskbar: true,
    // alwaysOnTop: true,
    fitContent,
  });
}; 

