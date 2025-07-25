import { useState } from "react";
import { motion } from "framer-motion";

type ShadowPreset = {
  name: string;
  boxShadow: string;
  description: string;
};

const shadowPresets: ShadowPreset[] = [
  {
    name: "基础阴影",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    description: "轻微的阴影效果，适合普通卡片和按钮",
  },
  {
    name: "中等阴影",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    description: "中等强度阴影，适合突出显示的元素",
  },
  {
    name: "强烈阴影",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
    description: "强烈的阴影效果，适合模态框和弹出层",
  },
  {
    name: "内阴影",
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.15)",
    description: "内部阴影效果，适合输入框和按钮按下状态",
  },
  {
    name: "发光效果",
    boxShadow: "0 0 15px 5px rgba(66, 153, 225, 0.5)",
    description: "发光效果，适合强调和高亮元素",
  },
];

export default function ShadowEffects() {
  const [selectedPreset, setSelectedPreset] = useState<ShadowPreset>(
    shadowPresets[0]
  );
  const [customShadow, setCustomShadow] = useState<string>(
    shadowPresets[0].boxShadow
  );
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>("#1a202c");

  const activeShadow = useCustom ? customShadow : selectedPreset.boxShadow;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">阴影与光效技巧</h2>

      {/* 控制面板 */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">预设阴影</label>
          <div className="flex flex-wrap gap-2">
            {shadowPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomShadow(preset.boxShadow);
                  setUseCustom(false);
                }}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedPreset.name === preset.name && !useCustom
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
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="useCustom"
              checked={useCustom}
              onChange={() => setUseCustom(!useCustom)}
              className="mr-2"
            />
            <label htmlFor="useCustom" className="text-sm font-medium">
              使用自定义阴影
            </label>
          </div>

          {useCustom && (
            <textarea
              value={customShadow}
              onChange={(e) => setCustomShadow(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
              rows={3}
              placeholder="输入 box-shadow 值..."
            />
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">背景颜色</label>
          <div className="flex items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded mr-2"
            />
            <span className="text-sm">{bgColor}</span>
          </div>
        </div>
      </div>

      {/* 效果预览 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">效果预览</h3>
        <div className="flex justify-center p-8 bg-gray-200 dark:bg-gray-800 rounded-lg">
          <motion.div
            className="w-64 h-40 rounded-lg flex items-center justify-center text-white"
            style={{
              backgroundColor: bgColor,
              boxShadow: activeShadow,
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-center">
              <p className="font-medium mb-2">阴影效果</p>
              <p className="text-xs opacity-70">悬浮查看动画效果</p>
            </div>
          </motion.div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
          {useCustom ? "自定义阴影" : selectedPreset.description}
        </p>
      </div>

      {/* 光晕效果示例 */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">光晕效果示例</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 内部光晕 */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-2">内部光晕</h4>
            <div className="h-40 bg-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <p className="text-sm">内部光晕效果</p>
              </div>
            </div>
            <pre className="text-xs mt-2 bg-gray-200 dark:bg-gray-700 p-2 rounded">
              {`<div className="relative overflow-hidden">
  <div className="absolute top-0 left-1/4 w-1/2 h-full 
    bg-gradient-to-r from-transparent via-white/20 
    to-transparent blur-sm">
  </div>
</div>`}
            </pre>
          </div>

          {/* 外部发光 */}
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-2">外部发光</h4>
            <div className="h-40 flex items-center justify-center">
              <div
                className="w-32 h-32 bg-blue-600 rounded-lg"
                style={{ boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.5)" }}
              >
                <div className="h-full flex items-center justify-center text-white">
                  <p className="text-sm">外部发光效果</p>
                </div>
              </div>
            </div>
            <pre className="text-xs mt-2 bg-gray-200 dark:bg-gray-700 p-2 rounded">
              {`<div 
  className="bg-blue-600"
  style={{ 
    boxShadow: "0 0 20px 10px rgba(59, 130, 246, 0.5)" 
  }}
></div>`}
            </pre>
          </div>
        </div>
      </div>

      {/* 设计技巧 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-medium mb-2">阴影设计技巧</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>
            <strong>多层阴影</strong>
            ：组合多个阴影值创造更自然的效果，模拟现实世界的光照
          </li>
          <li>
            <strong>色彩阴影</strong>
            ：不要只使用黑色阴影，可以使用与主题相符的颜色创建更有趣的效果
          </li>
          <li>
            <strong>阴影与高度</strong>
            ：阴影大小应与元素的"高度"相符，越高的元素阴影越大越模糊
          </li>
          <li>
            <strong>光晕与发光</strong>
            ：光晕效果可以通过半透明渐变和模糊滤镜实现，增加视觉深度
          </li>
          <li>
            <strong>动态阴影</strong>：在交互时改变阴影大小和强度，增强用户体验
          </li>
        </ul>
      </div>
    </div>
  );
}
