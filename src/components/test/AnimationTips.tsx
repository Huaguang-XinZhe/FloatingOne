import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AnimationExample = {
  title: string;
  description: string;
  animationType: "height" | "scale" | "opacity" | "spring" | "combined";
};

const examples: AnimationExample[] = [
  {
    title: "高度动画问题",
    description: "使用 height: 0 到 height: auto 的动画可能导致卡顿",
    animationType: "height",
  },
  {
    title: "缩放动画优化",
    description: "使用 scaleY 代替高度动画，更加流畅",
    animationType: "scale",
  },
  {
    title: "弹簧动画",
    description: "使用 spring 类型动画增加自然感",
    animationType: "spring",
  },
  {
    title: "组合动画",
    description: "同时控制多个属性创造复杂效果",
    animationType: "combined",
  },
];

export default function AnimationTips() {
  const [activeExample, setActiveExample] = useState<AnimationExample>(
    examples[0]
  );
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">动画优化技巧</h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">常见动画问题与解决方案</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>高度动画卡顿</strong>：从 height: 0 到 height: auto
            的动画通常会有卡顿，因为浏览器难以平滑插值计算
          </li>
          <li>
            <strong>解决方案</strong>：使用 scaleY 代替高度动画，同时设置
            transformOrigin 属性
          </li>
          <li>
            <strong>动画类型</strong>：使用 spring 类型动画代替
            tween，让动画更自然
          </li>
          <li>
            <strong>性能优化</strong>：使用 will-change、GPU
            加速和组件拆分提高性能
          </li>
        </ul>
      </div>

      {/* 选择动画示例 */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example.title}
              onClick={() => setActiveExample(example)}
              className={`px-3 py-1 rounded-md text-sm ${
                activeExample.title === example.title
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>

      {/* 动画演示 */}
      <div className="mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-medium">{activeExample.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {activeExample.description}
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {isExpanded ? "收起" : "展开"}
          </button>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-center">
          <AnimationDemo
            type={activeExample.animationType}
            isExpanded={isExpanded}
          />
        </div>
      </div>

      {/* 代码示例 */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto">
        <h3 className="text-lg font-medium mb-2">实现代码</h3>
        <CodeExample type={activeExample.animationType} />
      </div>
    </div>
  );
}

// 动画演示组件
function AnimationDemo({
  type,
  isExpanded,
}: {
  type: AnimationExample["animationType"];
  isExpanded: boolean;
}) {
  // 根据类型返回不同的动画组件
  switch (type) {
    case "height":
      return <HeightAnimation isExpanded={isExpanded} />;
    case "scale":
      return <ScaleAnimation isExpanded={isExpanded} />;
    case "spring":
      return <SpringAnimation isExpanded={isExpanded} />;
    case "combined":
      return <CombinedAnimation isExpanded={isExpanded} />;
    default:
      return <HeightAnimation isExpanded={isExpanded} />;
  }
}

// 高度动画 - 展示问题
function HeightAnimation({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="w-64">
      <div className="h-8 bg-gray-800 rounded-t-lg flex items-center justify-center">
        <span className="text-white text-xs">高度动画</span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700 text-white p-4 rounded-b-lg overflow-hidden"
          >
            <p className="text-sm">
              这种动画从 height: 0 到 height:
              auto，可能会有卡顿现象，特别是在内容高度不确定时。
            </p>
            <div className="h-20 bg-gray-600 mt-2 rounded flex items-center justify-center">
              <span className="text-xs">内容区域</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 缩放动画 - 展示解决方案
function ScaleAnimation({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="w-64">
      <div className="h-8 bg-gray-800 rounded-t-lg flex items-center justify-center">
        <span className="text-white text-xs">缩放动画</span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-700 text-white p-4 rounded-b-lg overflow-hidden origin-top"
            style={{ transformOrigin: "top center" }}
          >
            <p className="text-sm">
              使用 scaleY 代替高度动画，配合 transformOrigin: top
              center，动画更加流畅。
            </p>
            <div className="h-20 bg-gray-600 mt-2 rounded flex items-center justify-center">
              <span className="text-xs">内容区域</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 弹簧动画
function SpringAnimation({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="w-64">
      <div className="h-8 bg-gray-800 rounded-t-lg flex items-center justify-center">
        <span className="text-white text-xs">弹簧动画</span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.2 },
            }}
            className="bg-gray-700 text-white p-4 rounded-b-lg overflow-hidden origin-top"
            style={{ transformOrigin: "top center" }}
          >
            <p className="text-sm">
              使用 spring 类型动画，通过调整 stiffness 和 damping
              参数获得自然的弹性效果。
            </p>
            <div className="h-20 bg-gray-600 mt-2 rounded flex items-center justify-center">
              <span className="text-xs">内容区域</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 组合动画
function CombinedAnimation({ isExpanded }: { isExpanded: boolean }) {
  return (
    <div className="w-64">
      <div className="h-8 bg-gray-800 rounded-t-lg flex items-center justify-center">
        <span className="text-white text-xs">组合动画</span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0, rotateX: -20 }}
            animate={{
              opacity: 1,
              scaleY: 1,
              rotateX: 0,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
            }}
            exit={{ opacity: 0, scaleY: 0, rotateX: -20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              opacity: { duration: 0.2 },
              staggerChildren: 0.1,
            }}
            className="bg-gray-700 text-white p-4 rounded-b-lg overflow-hidden origin-top"
            style={{ transformOrigin: "top center", perspective: "1000px" }}
          >
            <motion.p
              className="text-sm"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              组合多种动画属性，如 scaleY、rotateX
              和阴影，创造更丰富的视觉效果。
            </motion.p>
            <motion.div
              className="h-20 bg-gray-600 mt-2 rounded flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xs">内容区域</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 代码示例组件
function CodeExample({ type }: { type: AnimationExample["animationType"] }) {
  switch (type) {
    case "height":
      return (
        <pre className="text-xs">
          {`// 高度动画 - 可能导致卡顿
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {/* 内容 */}
    </motion.div>
  )}
</AnimatePresence>`}
        </pre>
      );
    case "scale":
      return (
        <pre className="text-xs">
          {`// 缩放动画 - 更流畅的替代方案
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden origin-top"
      style={{ transformOrigin: "top center" }}
    >
      {/* 内容 */}
    </motion.div>
  )}
</AnimatePresence>`}
        </pre>
      );
    case "spring":
      return (
        <pre className="text-xs">
          {`// 弹簧动画 - 更自然的动画效果
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, // 控制弹性强度
        damping: 30,    // 控制阻尼（回弹减少）
        opacity: { duration: 0.2 } // 单独控制透明度
      }}
      className="overflow-hidden origin-top"
      style={{ transformOrigin: "top center" }}
    >
      {/* 内容 */}
    </motion.div>
  )}
</AnimatePresence>`}
        </pre>
      );
    case "combined":
      return (
        <pre className="text-xs">
          {`// 组合动画 - 丰富的视觉效果
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ opacity: 0, scaleY: 0, rotateX: -20 }}
      animate={{ 
        opacity: 1, 
        scaleY: 1, 
        rotateX: 0,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
      }}
      exit={{ opacity: 0, scaleY: 0, rotateX: -20 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        opacity: { duration: 0.2 },
        staggerChildren: 0.1 // 子元素动画错开时间
      }}
      className="overflow-hidden origin-top"
      style={{ 
        transformOrigin: "top center",
        perspective: "1000px" // 3D效果
      }}
    >
      {/* 内容区域带有独立的动画 */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        内容文本
      </motion.p>
    </motion.div>
  )}
</AnimatePresence>`}
        </pre>
      );
    default:
      return null;
  }
}
