import { useState } from "react";
import { motion } from "framer-motion";

type GradientPreset = {
  name: string;
  from: string;
  to: string;
  glowColor: string;
};

const presets: GradientPreset[] = [
  {
    name: "黑灰",
    from: "from-gray-900",
    to: "to-gray-700",
    glowColor: "white",
  },
  {
    name: "深蓝",
    from: "from-blue-900",
    to: "to-blue-700",
    glowColor: "blue",
  },
  {
    name: "紫色",
    from: "from-purple-900",
    to: "to-purple-600",
    glowColor: "purple",
  },
  {
    name: "暗红",
    from: "from-red-900",
    to: "to-red-700",
    glowColor: "red",
  },
  {
    name: "森林",
    from: "from-green-900",
    to: "to-green-700",
    glowColor: "green",
  },
];

export default function GradientGlowDemo() {
  const [selectedPreset, setSelectedPreset] = useState<GradientPreset>(
    presets[0]
  );
  const [glowIntensity, setGlowIntensity] = useState<number>(20);
  const [glowSize, setGlowSize] = useState<number>(50);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // 根据光晕颜色获取对应的 tailwind 类名
  const getGlowClass = (color: string, opacity: number) => {
    const opacityValue = opacity / 100;

    switch (color) {
      case "white":
        return `via-white/${opacityValue}`;
      case "blue":
        return `via-blue-400/${opacityValue}`;
      case "purple":
        return `via-purple-400/${opacityValue}`;
      case "red":
        return `via-red-400/${opacityValue}`;
      case "green":
        return `via-green-400/${opacityValue}`;
      default:
        return `via-white/${opacityValue}`;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">渐变与光晕效果演示</h2>

      {/* 控制面板 */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">预设样式</label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setSelectedPreset(preset)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedPreset.name === preset.name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            光晕强度: {glowIntensity}%
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={glowIntensity}
            onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            光晕大小: {glowSize}%
          </label>
          <input
            type="range"
            min="20"
            max="80"
            value={glowSize}
            onChange={(e) => setGlowSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center">
          <label className="block text-sm font-medium mr-4">展开状态</label>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1 rounded-md text-sm ${
              isExpanded
                ? "bg-blue-500 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {isExpanded ? "已展开" : "已收起"}
          </button>
        </div>
      </div>

      {/* 效果预览 */}
      <div className="w-fit mx-auto">
        <div
          className="w-fit flex flex-col items-center cursor-grab relative"
          style={{ perspective: "1000px" }}
        >
          {/* 顶部条 */}
          <motion.div
            className={`w-32 h-3 flex justify-center items-center bg-gradient-to-r ${selectedPreset.from} ${selectedPreset.to} rounded-t-lg shadow-lg z-10 relative overflow-hidden`}
            animate={{
              width: isExpanded ? "100%" : "8rem",
              boxShadow: isExpanded
                ? "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* 光晕效果 */}
            <div
              className={`absolute top-0 left-1/4 h-full bg-gradient-to-r from-transparent ${getGlowClass(selectedPreset.glowColor, glowIntensity)} to-transparent blur-sm`}
              style={{ width: `${glowSize}%` }}
            />

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </motion.div>

          {/* 内容区域 */}
          <AnimatedContent
            isExpanded={isExpanded}
            selectedPreset={selectedPreset}
            glowIntensity={glowIntensity}
            glowSize={glowSize}
            getGlowClass={getGlowClass}
          />
        </div>
      </div>

      {/* 代码示例 */}
      <div className="mt-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
        <h3 className="text-lg font-medium mb-2">实现代码</h3>
        <pre className="text-xs">
          {`// 渐变背景
<div className="bg-gradient-to-br ${selectedPreset.from} ${selectedPreset.to}">
  {/* 内容 */}
</div>

// 光晕效果
<div className="relative overflow-hidden">
  {/* 背景 */}
  <div className="bg-gradient-to-br ${selectedPreset.from} ${selectedPreset.to}">
    {/* 内容 */}
  </div>
  
  {/* 顶部光晕 */}
  <div 
    className="absolute -top-10 left-1/4 w-1/2 h-20 
    bg-gradient-to-b from-${selectedPreset.glowColor.toLowerCase()}-400/${glowIntensity / 100} 
    via-${selectedPreset.glowColor.toLowerCase()}-400/${glowIntensity / 2 / 100} 
    to-transparent blur-md"
  />
</div>`}
        </pre>
      </div>
    </div>
  );
}

// 提取内容组件，便于管理
function AnimatedContent({
  isExpanded,
  selectedPreset,
  glowIntensity,
  glowSize,
}: {
  isExpanded: boolean;
  selectedPreset: GradientPreset;
  glowIntensity: number;
  glowSize: number;
  getGlowClass: (color: string, opacity: number) => string;
}) {
  return (
    <>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: 1,
            scaleY: 1,
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
          className={`w-full bg-gradient-to-br ${selectedPreset.from} ${selectedPreset.to} text-white p-4 rounded-b-lg overflow-hidden origin-top relative`}
          style={{ transformOrigin: "top center" }}
        >
          {/* 光晕效果 - 顶部 */}
          <div
            className={`absolute -top-10 left-1/4 h-20 bg-gradient-to-b from-${selectedPreset.glowColor.toLowerCase()}-400/${glowIntensity / 100} via-${selectedPreset.glowColor.toLowerCase()}-400/${glowIntensity / 2 / 100} to-transparent blur-md`}
            style={{ width: `${glowSize}%` }}
          />

          {/* 光晕效果 - 右侧 */}
          <div
            className={`absolute top-1/2 right-0 w-12 h-12 bg-${selectedPreset.glowColor.toLowerCase()}-400/${glowIntensity / 2 / 100} rounded-full blur-xl`}
          />

          <motion.p
            className="text-center text-lg font-medium relative z-10"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            先持续，后加量！
          </motion.p>
        </motion.div>
      )}
    </>
  );
}
