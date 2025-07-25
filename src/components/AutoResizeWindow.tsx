import { useEffect, useRef, createContext, useContext } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";

// 创建一个上下文用于触发窗口大小更新
export const ResizeContext = createContext<
  (options?: {
    width?: number;
    height?: number;
    onlyResizeWidth?: boolean;
    onlyResizeHeight?: boolean;
  }) => void
>(() => {});

interface AutoResizeWindowProps {
  children: React.ReactNode;
  // 初始时调整窗口大小
  initialResize?: boolean;
}

export default function AutoResizeWindow({
  children,
  initialResize = true,
}: AutoResizeWindowProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastWindowSize = useRef<{ width: number; height: number } | null>(null);

  // 检查 URL 参数，确定是否应该自动调整大小
  const checkFitContent = () => {
    const searchString = window.location.search;
    if (searchString == "") {
      return true;
    }
    const urlParams = new URLSearchParams(searchString);
    // 如果查询参数中包括 fitContent=true，则自动调整窗口大小
    return urlParams.get("fitContent") === "true";
  };

  // 检查窗口大小是否发生变化
  const checkWindowSizeChanged = (width: number, height: number) => {
    if (
      lastWindowSize.current &&
      lastWindowSize.current.width === width &&
      lastWindowSize.current.height === height
    ) {
      return false;
    }
    return true;
  };

  const resizeToFitContent = async (options?: {
    width?: number;
    height?: number;
    onlyResizeWidth?: boolean;
    onlyResizeHeight?: boolean;
  }) => {
    // 如果不应该自动调整大小，则不执行任何操作
    if (checkFitContent() !== true) {
      return;
    }

    // 如果同时指定了宽度和高度，直接使用这些值
    if (options?.width !== undefined && options?.height !== undefined) {
      if (!checkWindowSizeChanged(options.width, options.height)) {
        console.log("窗口大小未变化，不调整窗口大小");
        return;
      }
      console.log("使用指定的宽高:", options.width, options.height);
      await getCurrentWindow().setSize(
        new LogicalSize(options.width, options.height)
      );
      // 更新最后的矩形记录
      lastWindowSize.current = { width: options.width, height: options.height };
      return;
    }

    const el = contentRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      let width = rect.width;
      let height = rect.height;

      // 如果单独指定了宽度或高度，使用指定的值
      if (options?.width !== undefined) {
        width = options.width;
      }
      if (options?.height !== undefined) {
        height = options.height;
      }

      if (options?.onlyResizeWidth === true) {
        // 只调整宽度，高度使用上次记录的
        height = lastWindowSize.current?.height ?? height;
      }
      if (options?.onlyResizeHeight === true) {
        // 只调整高度，宽度使用上次记录的
        width = lastWindowSize.current?.width ?? width;
      }

      // 检查尺寸是否有变化
      if (!checkWindowSizeChanged(width, height)) {
        console.log("窗口大小未变化，不调整窗口大小");
        return;
      }

      lastWindowSize.current = { width, height };
      console.log("调整窗口大小:", width, height);
      await getCurrentWindow().setSize(new LogicalSize(width, height));
    }
  };

  // 初始加载时尝试调整大小
  useEffect(() => {
    if (initialResize) {
      resizeToFitContent();
    }
  }, []);

  return (
    <ResizeContext.Provider value={resizeToFitContent}>
      {/* 可能得让 body 或次层容器的宽高为全屏，不然没啥效果❗ */}
      <div ref={contentRef} className="w-fit h-fit">
        {children}
      </div>
    </ResizeContext.Provider>
  );
}

// 导出一个钩子，让子组件可以触发窗口大小更新
export function useResizeWindow() {
  return useContext(ResizeContext);
}
