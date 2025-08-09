import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    rollupOptions: {
      // 手动分割代码块，减少单个文件大小
      output: {
        manualChunks: {
          // 将 React 相关库分离
          react: ["react", "react-dom", "react-router-dom"],
          // 将 HeroUI 核心库分离
          "heroui-core": [
            "@heroui/system",
            "@heroui/theme",
            "@heroui/use-theme",
          ],
          // 将 HeroUI 组件分离
          "heroui-components": [
            "@heroui/button",
            "@heroui/card",
            "@heroui/input",
            "@heroui/switch",
            "@heroui/spinner",
            "@heroui/divider",
            "@heroui/dropdown",
            "@heroui/modal",
            "@heroui/toast",
            "@heroui/number-input",
          ],
          // 将动画库分离
          animation: ["framer-motion"],
          // 将图标库分离
          icons: ["lucide-react"],
          // 将 Tauri API 分离
          tauri: [
            "@tauri-apps/api",
            "@tauri-apps/plugin-global-shortcut",
            "@tauri-apps/plugin-process",
            "@tauri-apps/plugin-store",
            "@tauri-apps/plugin-window-state",
          ],
          // 将工具库分离（这里可以优化❗）
          utils: ["clsx", "tailwind-merge", "tailwind-variants"],
        },
      },
    },
  },
});
