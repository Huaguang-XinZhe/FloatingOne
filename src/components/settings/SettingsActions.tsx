import React from "react";
import { Button } from "@heroui/button";
import { Save, RotateCcw } from "lucide-react";
import { Window } from "@tauri-apps/api/window";
import { getConfig, setConfig } from "@/store/appStore";
import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import { parseTipsFromText } from "@/utils/parseTips";
import { buttonStyles } from "@/styles/component-styles";
import { FloatOneConfig, Theme } from "@/types";
import { DEFAULT_CONFIG } from "@/config/default";
import type {
  AutoRotateSectionRef,
  TipsInputSectionRef,
} from "@/components/settings";

interface SettingsActionsProps {
  theme: Theme;
  autoStart: boolean;
  autoRotateRef: React.RefObject<AutoRotateSectionRef | null>;
  tipsInputRef: React.RefObject<TipsInputSectionRef | null>;
  onReset: (config: FloatOneConfig) => void;
}

// 普通函数式组件，无需ref
const SettingsActions: React.FC<SettingsActionsProps> = ({
  theme,
  autoStart,
  autoRotateRef,
  tipsInputRef,
  onReset,
}) => {
  // 更新配置的方法
  const updateConfig = async (newConfig: Partial<FloatOneConfig>) => {
    try {
      const currentConfig = getConfig() || DEFAULT_CONFIG;
      const updatedConfig = { ...currentConfig, ...newConfig };

      // 更新配置并自动同步到其他窗口
      await setConfig(updatedConfig);

      console.log("Config updated:", updatedConfig);
    } catch (error) {
      // 如果出错，使用默认配置
      console.error("Config update failed, error:", error);
    }
  };

  const handleSave = async () => {
    // 验证提示语
    if (!tipsInputRef.current?.validateTips()) {
      return;
    }

    // 从子组件获取最新的值
    const autoRotateValues = autoRotateRef.current?.getValues();
    const tipsText = tipsInputRef.current?.getTipsText() || "";

    const tips = parseTipsFromText(tipsText);
    console.log("handleSave tips", tips);

    const actualAutoStart = await isEnabled();
    console.log("actualAutoStart", actualAutoStart);
    if (autoStart !== actualAutoStart) {
      console.log("autoStart !== actualAutoStart");
      // 向配置看齐
      if (autoStart) {
        // 如果配置是开启，但是实际是关闭，则开启
        await enable();
      } else {
        // 如果配置是关闭，但是实际是开启，则关闭
        await disable();
      }
    }

    await updateConfig({
      tips,
      rotateInterval: autoRotateValues?.rotateInterval,
      autoRotate: autoRotateValues?.autoRotate,
      theme,
      autoStart,
    });

    console.log("Settings saved successfully");

    Window.getCurrent().close();
  };

  const handleReset = () => {
    const currentConfig = getConfig() || DEFAULT_CONFIG;
    // 重置到当前存储的配置
    onReset(currentConfig);

    // 重置子组件状态到初始值
    autoRotateRef.current?.reset();
    tipsInputRef.current?.reset();
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="light"
        onPress={handleReset}
        startContent={<RotateCcw size={16} />}
        className={buttonStyles.hoverGray800}
      >
        重置
      </Button>
      <Button
        color="primary"
        onPress={handleSave}
        startContent={<Save size={16} />}
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
      >
        保存
      </Button>
    </div>
  );
};

export default SettingsActions;
