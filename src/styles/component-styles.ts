/**
 * 组件样式封装文件
 * 提供统一的样式定义，便于跨组件复用
 */

// 输入框通用暗色主题样式
export const darkInputStyles = {
  base: "max-w-60",
  inputWrapper: "dark:bg-gray-800/50 dark:border-gray-700 border-1 dark:hover:border-gray-700/80 dark:hover:bg-gray-700/80  hover:border-gray-300 transition-colors border-gray-700/70  bg-gray-800/40",
  input: "dark:text-white text-gray-900 dark:placeholder:text-gray-400 placeholder:text-gray-500 custom-scrollbar-dark font-jetbrains",
  label: "dark:text-white text-gray-900 font-medium",
  clearButton: "dark:text-gray-400 dark:hover:text-white"
};

// 文本域通用暗色主题样式
export const darkTextareaStyles = {
  ...darkInputStyles,
  base: "w-md"
};

// 数字输入框通用暗色主题样式
export const darkNumberInputStyles = {
  ...darkInputStyles,
  base: "max-w-38",
  inputWrapper: `${darkInputStyles.inputWrapper} dark:focus-within:border-primary focus-within:border-primary`,
  stepperButton: "dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
};

// 按钮通用样式
export const buttonStyles = {
  hoverGray800: "text-white/80 hover:text-white data-[hover=true]:bg-gray-800",
  hoverGray700: "text-white/80 hover:text-white data-[hover=true]:bg-gray-700",
};

// 光晕效果通用样式
export const glowEffectStyles = {
  // 水平条状光晕
  bar: "absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm",
  // 顶部向下渐变光晕
  top: "absolute -top-10 left-1/4 w-1/2 h-20 bg-gradient-to-b from-white/10 via-white/5 to-transparent blur-md",
  // 右侧圆形光晕
  right: "absolute top-1/2 right-0 w-12 h-12 bg-white/5 rounded-full blur-xl",
  // 通用顶部光晕
  topBar: "absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm",
  // 底部光晕
  bottomGlow: "absolute bottom-0 left-1/4 w-1/2 h-16 bg-gradient-to-t from-blue-500/10 to-transparent blur-xl"
}; 