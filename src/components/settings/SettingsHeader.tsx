import React, { useState } from "react";
import { Button } from "@heroui/button";
import { ChevronLeft, Pin } from "lucide-react";
import { Window } from "@tauri-apps/api/window";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { buttonStyles } from "@/styles/component-styles";
import { Theme } from "@/config/config";

interface SettingsHeaderProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onDragStart: (e: React.MouseEvent) => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  theme,
  onThemeChange,
  onDragStart,
}) => {
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState<boolean>(false);
  const appWindow = Window.getCurrent();

  const handleAlwaysOnTopToggle = () => {
    appWindow.isAlwaysOnTop().then((currentState) => {
      const target = !currentState;
      setIsAlwaysOnTop(target);
      appWindow.setAlwaysOnTop(target);
    });
  };

  return (
    <>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        radius="full"
        onPress={() => appWindow.close()}
        className={buttonStyles.hoverGray800}
      >
        <ChevronLeft size={20} />
      </Button>
      <h1
        className="text-xl font-semibold tracking-tight select-none flex-1 cursor-grab"
        onMouseDown={onDragStart}
      >
        悬浮提示设置
      </h1>
      {/* 钉住窗口 */}
      <Button
        isIconOnly
        size="sm"
        variant="light"
        radius="full"
        onPress={handleAlwaysOnTopToggle}
        className={buttonStyles.hoverGray800}
      >
        <Pin size={20} className={isAlwaysOnTop ? "text-blue-500" : ""} />
      </Button>
      {/* 主题切换 */}
      <ThemeSwitcher theme={theme} onThemeChange={onThemeChange} />
    </>
  );
};
