import { useRef, useEffect, useCallback } from "react";
import { Window } from "@tauri-apps/api/window";

/**
 * 自动销毁窗口的 Hook
 *
 * @example
 * ```tsx
 * // 基本使用
 * const { handleUserActivity } = useAutoDestroy();
 *
 * // 自定义配置
 * const { handleUserActivity, resetTimer, clearTimer } = useAutoDestroy({
 *   timeout: 5 * 60 * 1000, // 5 分钟
 *   onDestroy: () => console.log('窗口即将关闭'),
 *   enabled: true
 * });
 *
 * // 在组件中使用
 * <div onMouseMove={handleUserActivity} onClick={handleUserActivity}>
 *   // 用户活动会重置计时器
 * </div>
 * ```
 */

interface UseAutoDestroyOptions {
  timeout?: number; // 超时时间，默认 10 分钟
  onDestroy?: () => void; // 销毁前的回调函数
  enabled?: boolean; // 是否启用自动销毁，默认 true
}

export const useAutoDestroy = (options: UseAutoDestroyOptions = {}) => {
  const {
    timeout = 10 * 60 * 1000, // 默认 10 分钟
    onDestroy,
    enabled = true,
  } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const appWindow = useRef<Window>(Window.getCurrent());

  // 清理计时器 - 不需要 useCallback，因为没有依赖
  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // 重置计时器 - 需要 useCallback，因为会传递给事件处理器
  const resetTimer = useCallback(() => {
    if (!enabled) return;

    clearTimer();
    timerRef.current = setTimeout(() => {
      console.log("Window auto-close due to inactivity");
      // 关闭之前执行销毁回调
      onDestroy?.();
      appWindow.current.close();
    }, timeout);
  }, [enabled, timeout, onDestroy]);

  // 用户活动处理器 - 需要 useCallback，因为会频繁传递给 DOM 事件
  const handleUserActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  // 初始化和清理
  useEffect(() => {
    if (enabled) {
      resetTimer();
    }

    return clearTimer; // 直接返回函数，不需要包装
  }, [enabled, resetTimer]);

  // 返回用户活动处理器和控制函数
  return {
    handleUserActivity,
    resetTimer,
    clearTimer,
  };
};
