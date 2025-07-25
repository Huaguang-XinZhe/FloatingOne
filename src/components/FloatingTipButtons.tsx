import { useState, useRef } from "react";
import { Settings, X } from "lucide-react";
import { Button } from "@heroui/button";
import { buttonStyles } from "@/styles/component-styles";
import { exit } from "@tauri-apps/plugin-process";
import { Window } from "@tauri-apps/api/window";
import { createSettingsWindow } from "@/utils/windowManager";

export const FloatingTipButtons = () => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 处理鼠标悬停事件
  const handleMouseEnter = () => {
    // 设置定时器，1.5秒后显示关闭按钮
    hoverTimerRef.current = setTimeout(() => {
      setShowCloseButton(true);
    }, 1500);
  };

  // 处理鼠标离开事件
  const handleMouseLeave = () => {
    // 清除定时器
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    setShowCloseButton(false);
  };

  // 处理退出应用程序
  const handleExit = async () => {
    try {
      await exit(0);
    } catch (error) {
      console.error("退出应用程序失败:", error);
    }
  };

  // 处理设置按钮点击
  const handleSettingsClick = async () => {
    const settingsWindow = await Window.getByLabel("settings");
    if (settingsWindow) {
      console.log("setFocus");
      await settingsWindow.setFocus();
    } else {
      console.log("createSettingsWindow");
      await createSettingsWindow(true);
    }
    // await createSettingsWindow(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showCloseButton ? (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          color="danger"
          onPress={handleExit}
          className={buttonStyles.hoverGray700}
        >
          <X size={16} />
        </Button>
      ) : (
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          onPress={handleSettingsClick}
          className={buttonStyles.hoverGray700}
        >
          <Settings size={16} />
        </Button>
      )}
    </div>
  );
};
