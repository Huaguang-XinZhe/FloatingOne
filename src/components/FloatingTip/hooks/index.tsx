import { useCooldown } from "@/hooks/useDebounce";
import { parseAllTips } from "@/utils/parseTips";
import { useAutoRotate } from "./useAutoRotate";
import { useRandomRotation } from "./useRandomRotation";
import { useState, useRef, useMemo } from "react";
import { DEFAULT_CONFIG } from "@/config/default";
import { FloatOneConfig } from "@/types";
import { useResizeWindow } from "@/components/AutoResizeWindow";

/**
 * FloatingTip 主要逻辑组合
 * 采用组合模式而非嵌套 hooks，提高可维护性
 */
export function useFloatingTip(config: FloatOneConfig | null) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const collapseTimeout = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasRotated = useRef(false);
  const resizeWindow = useResizeWindow();
  const { tips, autoRotate, rotateInterval } = config || DEFAULT_CONFIG;

  // 缓存解析结果，只有当 tips 改变时才重新解析
  const parsedTips = useMemo(() => parseAllTips(tips), [tips]);

  // 自动轮换功能
  const { currentTipIndex } = useAutoRotate({
    parsedTips,
    autoRotate,
    rotateInterval,
    isExpanded,
  });

  // 随机旋转功能
  const { rotation, updateRotation } = useRandomRotation();

  // 缓存当前提示，只有当 parsedTips 或 currentTipIndex 改变时才重新计算
  const currentTip = useMemo(
    () => parsedTips[currentTipIndex],
    [parsedTips, currentTipIndex]
  );

  const cleanupTimeouts = () => {
    if (collapseTimeout.current) {
      clearTimeout(collapseTimeout.current);
      collapseTimeout.current = null;
    }
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = null;
    }
  };

  // 鼠标进入处理函数
  const handleMouseEnterInternal = () => {
    console.log("FloatingTip handleMouseEnter");

    cleanupTimeouts();

    setIsExpanded(true);
    setIsContentVisible(true);

    // 只在第一次或收起后再次展开时更新旋转角度
    if (!hasRotated.current) {
      updateRotation(currentTip);
      hasRotated.current = true;
    }

    resizeWindow({ width: 1080, height: 250 }); // 采用限定的最大值
  };

  // 使用防抖，防止频繁触发展开（必须声明 handleMouseEnterInternal 才能使用❗）
  const [handleMouseEnter] = useCooldown(handleMouseEnterInternal, 1500);

  // 鼠标离开处理函数
  const handleMouseLeave = () => {
    console.log("FloatingTip handleMouseLeave");

    // 先隐藏内容
    setIsContentVisible(false);

    // 延迟收窄细条，等内容先隐藏
    collapseTimeout.current = setTimeout(() => {
      setIsExpanded(false);
      hasRotated.current = false;

      // resizeWindow(); // 不能在这里更新，此时测量，窗口大小没变化
    }, 200);

    resizeTimeout.current = setTimeout(() => {
      // 收缩时只调整高度
      resizeWindow({ onlyResizeHeight: true });
    }, 550); // 500ms 不行，这个时候还没有完全隐藏
  };

  return {
    isExpanded,
    isContentVisible,
    rotation,
    handleMouseEnter,
    handleMouseLeave,
    currentTip,
  };
}
