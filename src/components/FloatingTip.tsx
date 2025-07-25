import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import { useFloatingExpand } from "@/hooks/useFloatingTip";
import { glowEffectStyles } from "@/styles/component-styles";
import { FloatingTipButtons } from "@/components/FloatingTipButtons";
import { gradient } from "@/components/primitives";
import { cn } from "@/utils/cn";

const FloatingTip: React.FC = () => {
  const { handleDragStart } = useWindowDrag();

  const {
    isExpanded,
    isContentVisible,
    rotation,
    handleMouseEnter,
    handleMouseLeave,
    currentTip,
  } = useFloatingExpand();

  return (
    <div
      className="w-fit h-fit flex flex-col items-center group max-w-[1000px] max-h-[220px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 收起状态显示的细条 */}
      <motion.div
        className={cn(
          "w-32 h-3 flex justify-center items-center shadow-lg z-10 relative overflow-hidden cursor-grab",
          gradient({
            direction: "horizontal",
            rounded: isExpanded ? "top" : "bottom",
          })
        )}
        onMouseDown={handleDragStart}
        animate={{
          width: isExpanded ? "100%" : "8rem",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* 光晕效果 */}
        <div className={glowEffectStyles.bar} />

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <ChevronDown className="h-3 w-3 text-white" />
        </motion.div>
      </motion.div>

      {/* 展开状态显示的提示内容 */}
      <AnimatePresence>
        {isContentVisible && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: 1,
              scaleY: 1,
              rotate: rotation,
            }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.15 },
            }}
            className={cn(
              "w-full text-white p-4 overflow-hidden relative",
              gradient({ direction: "diagonal", rounded: "bottom" })
            )}
            style={{ transformOrigin: "top center" }}
          >
            {/* 光晕效果 */}
            <div className={glowEffectStyles.right} />

            <div className="flex justify-between items-center z-10 relative gap-1">
              <p className="text-lg font-medium flex-1 overflow-hidden select-none line-clamp-6 whitespace-pre-line">
                {currentTip}
              </p>
              <FloatingTipButtons />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingTip;
