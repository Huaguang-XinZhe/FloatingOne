import { useState, useEffect } from "react";
import { ParsedTip } from "@/utils/parseTips";

interface UseAutoRotateProps {
  parsedTips: ParsedTip[];
  autoRotate: boolean;
  rotateInterval: number;
  isExpanded: boolean;
}

/**
 * 自动轮换提示的 hook
 * 负责管理提示的索引和定时轮换逻辑
 */
export function useAutoRotate({
  parsedTips,
  autoRotate,
  rotateInterval,
  isExpanded,
}: UseAutoRotateProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    // 确保索引在有效范围内
    if (parsedTips.length > 0 && currentTipIndex >= parsedTips.length) {
      setCurrentTipIndex(0);
    }

    // 如果不需要轮换，就直接返回
    if (!autoRotate || parsedTips.length <= 1 || isExpanded) {
      return;
    }

    // 设置轮换定时器
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % parsedTips.length;
        console.log(`tip rotation: ${prevIndex} -> ${nextIndex}`);
        return nextIndex;
      });
    }, rotateInterval * 1000);

    // 清理函数
    return () => {
      // console.log("clearing rotation timer");
      clearInterval(timer);
    };
  }, [autoRotate, rotateInterval, parsedTips.length, isExpanded]);

  return {
    currentTipIndex,
    setCurrentTipIndex,
  };
}
