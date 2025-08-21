import { useState } from "react";
import { ParsedTip } from "@/utils/parseTips";

/**
 * 随机旋转角度的 hook
 * 让提示看起来更自然
 */
export function useRandomRotation() {
  const [rotation, setRotation] = useState(0);

  const updateRotation = (currentTip?: ParsedTip) => {
    let newRotation = Math.random() * 6 - 3; // -3 到 3 度之间的随机值

    // 如果文本过长，降低旋转角度
    if (currentTip && currentTip.main.length > 60) {
      newRotation = Math.random() * 2 - 1; // -1 到 1 度之间的随机值
      console.log("降低旋转角度❗", {
        textLength: currentTip.main.length,
        newRotation,
      });
    }

    setRotation(newRotation);
  };

  return {
    rotation,
    updateRotation,
  };
}
