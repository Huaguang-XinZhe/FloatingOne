import React, { useState, useEffect } from "react";
import { Textarea } from "@heroui/input";
import { darkTextareaStyles } from "@/styles/component-styles";
import { parseTipsFromText } from "@/config/config";

interface TipsInputSectionProps {
  initialTipsText: string;
}

export interface TipsInputSectionRef {
  validateTips: () => boolean;
  getTipsText: () => string;
  reset: () => void;
}

const defaultPlaceholderText = "在此输入提示语，每行一条...";

export const TipsInputSection = React.forwardRef<
  TipsInputSectionRef,
  TipsInputSectionProps
>(({ initialTipsText }, ref) => {
  const [tipsText, setTipsText] = useState(initialTipsText);
  const [placeholderText, setPlaceholderText] = useState(
    defaultPlaceholderText
  );
  const [isShaking, setIsShaking] = useState(false);

  // 计算提示条数（不使用useMemo，因为每次都重新计算❗）
  const tipCount = parseTipsFromText(tipsText).length;

  // 恢复震动状态
  useEffect(() => {
    if (isShaking) {
      const timer = setTimeout(() => {
        setIsShaking(false);
      }, 820);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  const handleClear = () => {
    setTipsText("");
    setPlaceholderText(defaultPlaceholderText);
  };

  // 验证提示语
  const validateTips = () => {
    const tips = parseTipsFromText(tipsText);
    if (tips.length === 0) {
      setIsShaking(true);
      setPlaceholderText("⚠️请至少输入一条提示语");
      return false;
    }
    return true;
  };

  // 暴露方法给父组件
  React.useImperativeHandle(
    ref,
    () => ({
      validateTips,
      getTipsText: () => tipsText,
      reset: () => {
        setTipsText(initialTipsText);
        setPlaceholderText(defaultPlaceholderText);
      },
    }),
    [tipsText]
  );

  return (
    <div className="relative space-y-2">
      {tipCount > 0 && (
        <p className="absolute top-1 right-0 text-xs text-gray-500">
          {tipCount} 条
        </p>
      )}
      <Textarea
        isClearable
        disableAutosize
        value={tipsText}
        label="提示语（每行一条）"
        labelPlacement="outside"
        rows={5}
        placeholder={placeholderText}
        onChange={(e) => setTipsText(e.target.value)}
        onClear={handleClear}
        classNames={{
          ...darkTextareaStyles,
          base: `${darkTextareaStyles.base || ""} ${isShaking ? "animate-shake" : ""}`,
        }}
      />
      {/* 使用说明 */}
      <p className="blockquote-500 ml-2">
        提示语以空行或 <code>--</code> 分隔，每条提示可以在下一行以{" "}
        <code>&gt;</code> 开头添加补充描述
      </p>
    </div>
  );
});
