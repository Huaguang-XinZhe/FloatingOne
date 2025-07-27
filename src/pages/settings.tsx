import React, { useRef, useState, useEffect } from "react";
import { useConfigStore } from "@/store";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { NumberInput } from "@heroui/number-input";
import { Switch } from "@heroui/switch";
import { Spinner } from "@heroui/spinner";
import { Window } from "@tauri-apps/api/window";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Save, RotateCcw, ChevronLeft } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  darkTextareaStyles,
  darkNumberInputStyles,
  buttonStyles,
  glowEffectStyles,
} from "@/styles/component-styles";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import { useAutoDestroy } from "@/hooks/useAutoDestroy";
import { DEFAULT_CONFIG, FloatOneConfig, Theme } from "@/config/config";
import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";

const SettingsPage: React.FC = () => {
  // 使用 zustand store
  const config = useConfigStore((state) => state.config);
  const isInitialized = useConfigStore((state) => state.isInitialized);
  const updateConfig = useConfigStore((state) => state.updateConfig);

  const appWindow = useRef<Window>(Window.getCurrent());

  const { handleDragStart } = useWindowDrag();

  // 使用自动销毁 hook
  const { handleUserActivity } = useAutoDestroy();

  // 本地状态，用于表单
  const [tipsText, setTipsText] = useState<string>("");
  const [rotateInterval, setRotateInterval] = useState<number>(60);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [autoStart, setAutoStart] = useState<boolean>(true);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [placeholderText, setPlaceholderText] =
    useState<string>("在此输入提示语，每行一条...");

  // 传入配置对象，设置状态
  const setLocalState = (config: FloatOneConfig) => {
    console.log("setLocalState config", config);
    setTipsText(config.tips.join("\n"));
    setRotateInterval(config.rotateInterval);
    setAutoRotate(config.autoRotate);
    setTheme(config.theme);
    setAutoStart(config.autoStart);
  };

  // 当配置初始化完成时，同步本地状态
  useEffect(() => {
    if (isInitialized) {
      setLocalState(config);
    }
  }, [isInitialized]);

  // 恢复原来的状态
  useEffect(() => {
    if (isShaking) {
      setTimeout(() => {
        setIsShaking(false);
      }, 820);
    }
  }, [isShaking]);

  const handleSave = async () => {
    handleUserActivity(); // 重置计时器

    const tips = tipsText.split("\n").filter((tip) => tip.trim() !== "");
    console.log("handleSave tips", tips);

    if (tips.length === 0) {
      setIsShaking(true);
      setPlaceholderText("⚠️请至少输入一条提示语");
      return;
    }

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
      rotateInterval,
      autoRotate,
      theme,
      autoStart,
    });

    console.log("Settings saved successfully");

    appWindow.current.close();
  };

  const handleReset = async () => {
    handleUserActivity(); // 重置计时器
    setLocalState(DEFAULT_CONFIG); // 只导致状态变化，不存储到 store（存储必须点保存）
  };

  return (
    <Card
      shadow="lg"
      className="flex flex-col bg-gray-900 border border-gray-700/50 overflow-hidden relative"
    >
      {/* 光晕效果 */}
      <div className={glowEffectStyles.bottomGlow} />

      {/* 加载遮罩层 */}
      {!isInitialized && (
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <Spinner size="md" label="加载配置中..." variant="gradient" />
        </div>
      )}

      <CardHeader className="flex items-center px-6 py-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          radius="full"
          onPress={() => {
            handleUserActivity();
            appWindow.current.close();
          }}
          className={buttonStyles.hoverGray800}
        >
          <ChevronLeft size={20} />
        </Button>
        <h1
          className="text-xl font-semibold tracking-tight select-none flex-1 ml-2 cursor-grab"
          onMouseDown={handleDragStart}
        >
          悬浮提示设置
        </h1>
        <ThemeSwitcher
          theme={theme}
          onThemeChange={(newTheme) => {
            handleUserActivity();
            // 只在用户手动切换主题时更新
            setTheme(newTheme);
          }}
        />
      </CardHeader>

      <Divider className="bg-gray-700/30" />

      <CardBody className="space-y-6 p-6 bg-gray-900 w-fit">
        {/* 右侧：自动轮换设置 */}
        <div className="flex gap-2">
          <Switch
            color="primary"
            isSelected={autoRotate} // 不能用 checked❗（虽然不警告，但是也没用）
            onValueChange={(value) => {
              handleUserActivity();
              // 一定要用加这个，否则开关滑不过去❗
              setAutoRotate(value);
            }}
            classNames={{
              label: "text-white",
            }}
          >
            自动轮换提示
          </Switch>
          <NumberInput
            label="间隔"
            minValue={30}
            size="lg"
            isDisabled={!autoRotate}
            value={rotateInterval}
            onValueChange={(value) => {
              handleUserActivity();
              setRotateInterval(value || 60);
            }}
            placeholder="输入轮换间隔"
            labelPlacement="outside-left"
            formatOptions={{
              style: "unit",
              unit: "second",
              unitDisplay: "narrow",
            }}
            classNames={darkNumberInputStyles}
          />
        </div>

        <Switch
          color="primary"
          isSelected={autoStart}
          onValueChange={(value) => {
            handleUserActivity();
            setAutoStart(value);
          }}
        >
          开机自启动
        </Switch>

        {/* 下部分：提示语输入区 */}
        <Textarea
          // isRequired // 离焦的时候才会出现错误提示，或者消失
          isClearable
          disableAutosize
          label="提示语（每行一条）"
          value={tipsText}
          // size="lg"
          // minRows={1}
          // maxRows={4}
          rows={3} // 默认是 2，超出这里设置的行数就会出现滚动条
          placeholder={placeholderText}
          onChange={(e) => {
            handleUserActivity();
            setTipsText(e.target.value);
          }}
          onClear={() => {
            handleUserActivity();
            setTipsText("");
          }}
          classNames={{
            ...darkTextareaStyles,
            base: `${darkTextareaStyles.base || ""} ${isShaking ? "animate-shake" : ""}`,
          }}
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
  );
};

export default SettingsPage;
