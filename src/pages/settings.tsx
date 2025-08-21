import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useConfig } from "@/store/appStore";
import { Switch } from "@heroui/switch";
import { Spinner } from "@heroui/spinner";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { glowEffectStyles } from "@/styles/component-styles";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import {
  SettingsHeader,
  AutoRotateSection,
  TipsInputSection,
  SettingsActions,
} from "@/components/settings";
import { useResizeWindow } from "@/components/AutoResizeWindow";
import type {
  AutoRotateSectionRef,
  TipsInputSectionRef,
} from "@/components/settings";
import VersionButton from "@/components/settings/VersionButton";
import { FloatOneConfig, Theme } from "@/types";

const SettingsPage: React.FC = () => {
  const config = useConfig();
  const autoRotateRef = useRef<AutoRotateSectionRef>(null);
  const tipsInputRef = useRef<TipsInputSectionRef>(null);

  const { handleDragStart } = useWindowDrag();
  const resizeWindow = useResizeWindow();

  // 本地状态，用于表单
  const [theme, setTheme] = useState<Theme>("dark");
  const [autoStart, setAutoStart] = useState<boolean>(true);

  // 传入配置对象，设置状态
  const setLocalState = (config: FloatOneConfig) => {
    console.log("setLocalState config", config);
    setTheme(config.theme);
    setAutoStart(config.autoStart);
  };

  // 当配置加载完成时，同步本地状态
  useEffect(() => {
    if (config) {
      setLocalState(config);
    }
  }, [config]);

  // 在 DOM 更新后（绘制前）调用 resizeWindow（会阻塞❗）
  useLayoutEffect(() => {
    if (config) {
      console.log("useLayoutEffect");
      resizeWindow();
    }
  }, [config]);

  const handleReset = (resetConfig: FloatOneConfig) => {
    // 重置本地状态
    setLocalState(resetConfig);
  };

  return config ? (
    <Card
      // shadow="lg"
      shadow="none" // 默认有一个
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

      <CardFooter className="flex justify-between gap-3 p-4">
        <VersionButton />
        <SettingsActions
          theme={theme}
          autoStart={autoStart}
          autoRotateRef={autoRotateRef}
          tipsInputRef={tipsInputRef}
          onReset={handleReset}
        />
      </CardFooter>
    </Card>
  ) : (
    <div className="w-[500px] h-[500px] flex items-center justify-center">
      <Spinner
        size="md"
        label="加载配置中..."
        variant="gradient"
        classNames={{
          label: "text-white",
        }}
      />
    </div>
  );
};

export default SettingsPage;
