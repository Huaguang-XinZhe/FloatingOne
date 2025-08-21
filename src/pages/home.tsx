import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useWindowDrag } from "@/hooks/useWindowDrag";
import { useFloatingTip } from "../components/FloatingTip/hooks";
import { glowEffectStyles } from "@/styles/component-styles";
import { FloatingTipButtons } from "@/components/FloatingTip/FloatingTipButtons";
import { gradient } from "@/components/primitives";
import { cn } from "@/utils/cn";
import { useConfig } from "@/store/appStore";

const HomePage: React.FC = () => {
  const { handleDragStart } = useWindowDrag();
  const config = useConfig();

  const {
    isExpanded,
    isContentVisible,
    rotation,
    currentTip,
    handleMouseEnter,
    handleMouseLeave,
  } = useFloatingTip(config);

  useEffect(() => {
    // 初始化时默认展开
    handleMouseEnter();
  }, []);

  return (
    <>
      {config && (
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
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            {/* 光晕效果 */}
            <div className={glowEffectStyles.bar} />

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{
                type: "tween",
                duration: 0.3,
                ease: "easeInOut",
              }}
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
                  type: "tween",
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className={cn(
                  "w-full text-white p-4 overflow-hidden relative",
                  gradient({ direction: "diagonal", rounded: "bottom" })
                )}
                style={{ transformOrigin: "top center" }}
              >
                {/* 光晕效果 */}
                <div className={glowEffectStyles.right} />

                <motion.div className="flex justify-between items-center z-10 relative gap-1">
                  <div className="flex-1 overflow-hidden select-none">
                    <p className="text-lg font-medium whitespace-pre-line">
                      {currentTip?.main}
                    </p>
                    {currentTip?.description && (
                      <p className="blockquote-400 mt-1">
                        {currentTip.description}
                      </p>
                    )}
                  </div>
                  <FloatingTipButtons />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default HomePage;
