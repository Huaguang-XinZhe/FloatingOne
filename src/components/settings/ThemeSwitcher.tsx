import { useTheme } from "@heroui/use-theme";
import { Button } from "@heroui/button";
import { Moon, Sun } from "lucide-react";
import { buttonStyles } from "@/styles/component-styles";
// import { addToast } from "@heroui/toast";
import { Theme } from "@/types";
import { useEffect } from "react";

interface ThemeSwitcherProps {
  className?: string;
  // 禁用亮色模式
  disableLight?: boolean;
  // 当前主题
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeSwitcher = ({
  className,
  disableLight = true,
  theme: externalTheme = "dark", // 外部控制主题
  onThemeChange,
}: ThemeSwitcherProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    // 切换前检查
    if (disableLight && theme === "dark") {
      // addToast({
      //   title: "亮色模式施工中🚧",
      //   description: "敬请期待……",
      // });
      return;
    }
    // 切换
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // 通知父组件主题已更改
    onThemeChange?.(newTheme as Theme);
  };

  useEffect(() => {
    // 只有当外部主题与内部主题不同时，才更新主题
    if (theme !== externalTheme) {
      setTheme(externalTheme);
    }
  }, [externalTheme]);

  // 移除监听 theme 变化的 useEffect，避免无限循环

  return (
    <Button
      isIconOnly
      size="sm"
      variant="light"
      radius="full"
      className={`${buttonStyles.hoverGray700} ${className || ""}`}
      onPress={toggleTheme}
      aria-label={`切换至${theme === "dark" ? "亮色" : "暗色"}主题`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
};
