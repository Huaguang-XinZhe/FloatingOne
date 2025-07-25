import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SimpleTipPreview: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const handleMouseEnter = () => {
    setIsExpanded(true);
    setIsContentVisible(true);
  };

  const handleMouseLeave = () => {
    setIsContentVisible(false);
    // 延迟收窄细条，等内容先隐藏
    setTimeout(() => {
      setIsExpanded(false);
    }, 200);
  };

  // 随机旋转角度，让提示看起来更自然
  const updateRotation = () => {
    const newRotation = Math.random() * 6 - 3; // -3 到 3 度之间的随机值
    setRotation(newRotation);
  };

  useEffect(() => {
    if (isExpanded) {
      updateRotation();
    }
  }, [isExpanded]);

  return (
    <div
      className="w-fit h-fit flex flex-col items-center cursor-grab group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // style={{ perspective: "1000px" }}
    >
      {/* 收起状态显示的细条 */}
      <motion.div
        className="w-32 h-3 flex justify-center items-center bg-gradient-to-r from-gray-900 to-gray-700 rounded-t-lg shadow-lg z-10 relative overflow-hidden"
        animate={{
          width: isExpanded ? "100%" : "8rem",
          boxShadow: isExpanded
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* 光晕效果 */}
        <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />

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
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
            }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.15 },
            }}
            className="w-full bg-gradient-to-br from-gray-900 to-gray-700 text-white p-4 rounded-b-lg overflow-hidden relative"
            style={{ transformOrigin: "top center" }}
          >
            {/* 光晕效果 */}
            <div className="absolute -top-10 left-1/4 w-1/2 h-20 bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-md" />
            <div className="absolute top-1/2 right-0 w-12 h-12 bg-white/5 rounded-full blur-xl" />

            <p className="text-lg font-medium z-10">先持续，后加量！</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SimpleTipPreview;
