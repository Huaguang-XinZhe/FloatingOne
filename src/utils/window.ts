import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Event } from "@tauri-apps/api/event";
import { LogicalPosition, Window } from "@tauri-apps/api/window";
import { primaryMonitor } from "@tauri-apps/api/window";
import { moveWindow, Position } from "@tauri-apps/plugin-positioner";

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
export const createSettingsWindow = (
  fitContent: boolean = true
): WebviewWindow => {
  return createWindow("settings", {
    url: "/settings",
    title: "设置",
    width: 500,
    height: 500,
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

/**
 * 初始化主窗口的位置（使用 positioner 插件）
 */
export const initializeMainWindowPosition = async () => {
  const mainWindow = await Window.getByLabel("main");
  if (mainWindow) {
    try {
      // 使用 positioner 插件将窗口定位到屏幕顶部中央
      await moveWindow(Position.TopCenter);
      console.log("窗口已使用 positioner 插件设置到顶部中央位置");
    } catch (error) {
      console.error("使用 positioner 插件设置窗口位置失败，回退到手动计算:", error);
      
      // 回退到原有的手动计算方式
      const windowWidth = 1080;
      try {
        const monitor = await primaryMonitor();
        if (monitor) {
          const screenLogicalWidth = monitor.size.width / monitor.scaleFactor;
          const x = Math.floor((screenLogicalWidth - windowWidth) / 2);
          const y = 0; // 贴顶部
          
          await mainWindow.setPosition(new LogicalPosition(x, y));
          console.log(`窗口已手动设置到居中位置: (${x}, ${y})`);
        } else {
          await mainWindow.setPosition(new LogicalPosition(228, 0));
        }
      } catch (fallbackError) {
        console.error("手动设置窗口位置也失败:", fallbackError);
        await mainWindow.setPosition(new LogicalPosition(228, 0));
      }
    }
  }
};

/**
 * 把主窗口高度恢复到初始值
 */
// export const resetMainWindowHeight = async (
// ) => {
//   const mainWindow = await Window.getByLabel("main");
//   if (mainWindow) {
//     await mainWindow.setSize(new LogicalSize(1080, 12));
//   }
// };
