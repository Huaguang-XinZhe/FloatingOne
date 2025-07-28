import { TrayIcon } from "@tauri-apps/api/tray";
import { Menu } from "@tauri-apps/api/menu";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { Window } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/plugin-process";
import { createSettingsWindow, resetMainWindowHeight } from "./window";


/**
 * 初始化系统托盘
 */
export async function initializeTray(): Promise<void> {
  
  try {
    // 尝试获取已存在的托盘（使用固定ID）
    const existingTray = await TrayIcon.getById("floatone-tray");
    if (existingTray) {
      console.log("🔄 发现已存在的托盘，重用现有实例");
      return;
    }

    // 获取应用图标
    const icon = await defaultWindowIcon();
    if (!icon) {
      console.warn("无法获取应用图标，跳过系统托盘初始化");
      return;
    }

    // 创建托盘菜单
    const menu = await Menu.new({
      items: [
        {
          id: "settings",
          text: "设置",
          action: handleSettingsClick,
        },
        {
          id: "quit",
          text: "退出",
          action: handleQuitClick,
        },
      ],
    });

    // 创建系统托盘（使用固定ID）
    await TrayIcon.new({
      id: "floatone-tray", // 使用固定ID便于后续查找和重用
      icon,
      menu,
      tooltip: "悬一句",
      menuOnLeftClick: false, // 右键显示菜单，左键不显示菜单
      action: handleTrayClick,
    });

    console.log("✅ 系统托盘初始化成功");
  } catch (error) {
    console.error("系统托盘初始化失败:", error);
  }
}

/**
 * 处理托盘图标点击事件
 */
function handleTrayClick(event: any): void {
    // 只处理左键点击，避免右键菜单时触发切换
    if (event.type === "Click" && event.button === "Left") {
      console.log("托盘图标左键被点击");
      // 左键单击显示/隐藏主窗口
      toggleMainWindow();
    }
}

/**
 * 处理设置按钮点击
 */
async function handleSettingsClick(): Promise<void> {
  try {
    const settingsWindow = await Window.getByLabel("settings");
    if (settingsWindow) {
      console.log("设置窗口已存在，显示并聚焦");
      await settingsWindow.show();
      await settingsWindow.setFocus();
    } else {
      console.log("创建新的设置窗口");
      await createSettingsWindow(true);
    }
  } catch (error) {
    console.error("打开设置窗口失败:", error);
  }
}

/**
 * 处理退出按钮点击
 */
async function handleQuitClick(): Promise<void> {
  try {
    await resetMainWindowHeight();
    await exit(0);
  } catch (error) {
    console.error("退出应用失败:", error);
  }
}


/**
 * 切换主窗口显示/隐藏状态
 */
async function toggleMainWindow(): Promise<void> {
  try {
    const mainWindow = await Window.getByLabel("main");
    if (mainWindow) {
      const isVisible = await mainWindow.isVisible();
      if (isVisible) {
        await mainWindow.hide();
      } else {
        await mainWindow.show();
        await mainWindow.setFocus();
      }
    }
  } catch (error) {
    console.error("切换主窗口状态失败:", error);
  }
}




