import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.3rem] lg:text-5xl",
      lg: "text-4xl lg:text-6xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
      ],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

// 可复用的渐变背景样式
export const gradient = tv({
  base: "from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800",
  variants: {
    direction: {
      // 水平渐变（用于顶部条）
      horizontal: "bg-gradient-to-r",
      // 对角线渐变（用于内容区）
      diagonal: "bg-gradient-to-br",
      // 垂直渐变
      vertical: "bg-gradient-to-b",
    },
    rounded: {
      // 上方圆角
      top: "rounded-t-lg",
      // 下方圆角
      bottom: "rounded-b-lg",
      // 全部圆角
      all: "rounded-lg",
      // 无圆角
      none: "",
    },
  },
  defaultVariants: {
    direction: "horizontal",
    rounded: "all",
  },
});
