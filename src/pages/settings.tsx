import React, { useRef, useState, useEffect } from "react";
import { useConfigStore } from "@/store";
import { Button } from "@heroui/button";
import { Switch } from "@heroui/switch";
import { Spinner } from "@heroui/spinner";
import { Window } from "@tauri-apps/api/window";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Save, RotateCcw } from "lucide-react";
import { buttonStyles, glowEffectStyles } from "@/styles/component-styles";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import {
  DEFAULT_CONFIG,
  FloatOneConfig,
  Theme,
  parseTipsFromText,
} from "@/config/config";
import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import {
  SettingsHeader,
  AutoRotateSection,
  TipsInputSection,
} from "@/components/settings";
import type {
  AutoRotateSectionRef,
  TipsInputSectionRef,
} from "@/components/settings";

const SettingsPage: React.FC = () => {
  // 使用 zustand store
  const config = useConfigStore((state) => state.config);
  const isInitialized = useConfigStore((state) => state.isInitialized);
  const updateConfig = useConfigStore((state) => state.updateConfig);

  const appWindow = useRef<Window>(Window.getCurrent());
  const autoRotateRef = useRef<AutoRotateSectionRef>(null);
  const tipsInputRef = useRef<TipsInputSectionRef>(null);

  const { handleDragStart } = useWindowDrag();

  // 本地状态，用于表单
  const [theme, setTheme] = useState<Theme>("dark");
  const [autoStart, setAutoStart] = useState<boolean>(true);

  // 传入配置对象，设置状态
  const setLocalState = (config: FloatOneConfig) => {
    console.log("setLocalState config", config);
    setTheme(config.theme);
    setAutoStart(config.autoStart);
  };

  // 当配置初始化完成时，同步本地状态
  useEffect(() => {
    if (isInitialized) {
      setLocalState(config);
    }
  }, [isInitialized]);

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
      // 像配置看齐
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

    appWindow.current.close();
  };

  const handleReset = async () => {
    setLocalState(DEFAULT_CONFIG); // 只导致状态变化，不存储到 store（存储必须点保存）
  };

  return isInitialized ? (
    <Card
      shadow="lg"
      className="flex flex-col bg-gray-900 border border-gray-700/50 overflow-hidden relative"
    >
      {/* 光晕效果 */}
      <div className={glowEffectStyles.bottomGlow} />

      <CardHeader className="flex items-center px-6 py-5 gap-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative">
        <SettingsHeader
          theme={theme}
          onThemeChange={setTheme}
          onDragStart={handleDragStart}
        />
      </CardHeader>

      <Divider className="bg-gray-700/30" />

      <CardBody className="space-y-6 p-6 bg-gray-900 w-fit">
        <AutoRotateSection
          ref={autoRotateRef}
          initialAutoRotate={config.autoRotate}
          initialRotateInterval={config.rotateInterval}
        />

        <Switch
          color="primary"
          isSelected={autoStart}
          onValueChange={(value) => {
            setAutoStart(value);
          }}
        >
          开机自启动
        </Switch>

        <TipsInputSection
          ref={tipsInputRef}
          initialTipsText={config.tips.join("\n\n")}
        />
      </CardBody>

      <Divider className="bg-gray-700/30" />

      <CardFooter className="flex justify-end gap-3 p-4">
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
      </CardFooter>
    </Card>
  ) : (
    <div className="w-[500px] h-[500px] flex items-center justify-center">
      <Spinner
        size="md"
        label="加载配置中..."
        variant="gradient"
        classNames={{
          label: "text-gray-400",
        }}
      />
    </div>
  );
};

export default SettingsPage;
