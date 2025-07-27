import { useState, useRef, useEffect } from "react";
import { useResizeWindow } from "@/components/AutoResizeWindow";
import { useConfigStore } from "@/store";
import { useCooldown } from "./useDebounce";

export function useFloatingExpand() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const collapseTimeout = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasRotated = useRef(false);
  const resizeWindow = useResizeWindow(); // 使用上下文中的 resizeWindow 函数

  // 从配置中获取提示相关设置
  const config = useConfigStore((state) => state.config);
  // console.log("useFloatingExpand config", config);
  const { tips, autoRotate, rotateInterval } = config;

  // 使用索引而不是直接存储提示文本
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // 处理提示轮换和索引边界检查
  useEffect(() => {
    console.log(
      "tips/rotation effect",
      tips,
      autoRotate,
      rotateInterval,
      isExpanded
    );

    // 确保索引在有效范围内（立即执行，没有定时器的延迟，避免出现空值❗）
    if (tips.length > 0 && currentTipIndex >= tips.length) {
      setCurrentTipIndex(0);
      // return; // 放行，继续设置轮换定时器
    }

    // 如果不需要轮换，就直接返回
    if (!autoRotate || tips.length <= 1 || isExpanded) return;

    // 设置轮换定时器
    const timer = setInterval(() => {
      const fn = (prevIndex: number) => {
        console.log("prevIndex", prevIndex);
        console.log("tips.length", tips.length);
        const nextIndex = (prevIndex + 1) % tips.length;
        console.log("nextIndex", nextIndex);
        return nextIndex;
      };
      setCurrentTipIndex((prevIndex) => fn(prevIndex));
      // 刚刚设置这里就直接访问，拿到的还是旧的值❗
      // console.log("currentTipIndex", currentTipIndex);
    }, rotateInterval * 1000);

    // 清理函数
    return () => clearInterval(timer);
  }, [autoRotate, rotateInterval, tips, isExpanded]);

  // 从 tips 数组中获取当前提示
  const currentTip = tips[currentTipIndex];

  // 随机旋转角度，让提示看起来更自然
  const updateRotation = () => {
    const newRotation = Math.random() * 6 - 3; // -3 到 3 度之间的随机值
    setRotation(newRotation);
    hasRotated.current = true;
  };

  // 原始的鼠标悬停展开处理函数
  const handleMouseEnterInternal = () => {
    // 为什么鼠标从关闭按钮上离开，到浮动提示上，会再次触发鼠标进入事件❓
    console.log("useFloatingExpand handleMouseEnter");
    if (collapseTimeout.current) {
      clearTimeout(collapseTimeout.current);
      collapseTimeout.current = null;
    }

    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = null;
    }

    setIsExpanded(true);
    setIsContentVisible(true);

    // 只在第一次或收起后再次展开时更新旋转角度
    if (!hasRotated.current) {
      updateRotation();
    }

    // 更新窗口大小，宽度和高度都调整
    resizeWindow({ width: 1080, height: 250 }); // 采用限定的最大值❗
  };

  // 使用防抖 hook，防止频繁触发展开，间隔 1.5 秒
  const [handleMouseEnter] = useCooldown(
    handleMouseEnterInternal,
    1500 // 1.5 秒冷却时间
  );

  // 处理鼠标离开收起
  const handleMouseLeave = () => {
    console.log("useFloatingExpand handleMouseLeave");
    // 先隐藏内容
    setIsContentVisible(false);

    // 延迟收窄细条，等内容先隐藏
    collapseTimeout.current = setTimeout(() => {
      setIsExpanded(false);
      // 重置旋转状态，下次展开时重新计算
      hasRotated.current = false;
      // // 更新窗口大小
      // resizeWindow(); // 不能在这里更新，此时测量，窗口大小没变化❗
    }, 100);

    // 延迟更新窗口大小，只调整高度，保持宽度不变
    resizeTimeout.current = setTimeout(() => {
      // 收缩时只调整高度
      resizeWindow({ onlyResizeHeight: true });
    }, 600); // 500ms 不行，这个时候还没有完全隐藏❗
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
