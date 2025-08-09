import { listen, type UnlistenFn } from "@tauri-apps/api/event";

/**
 * 为 useEffect 优化的事件监听器
 * 自动处理异步 Promise 和清理函数的类型问题
 */
export const useEffectListen = <T = any>(
  event: string,
  handler: (payload: T) => void | Promise<void>
): (() => void) => {
  let unsubscribe: UnlistenFn | undefined;

  // 异步设置监听器
  listen(event, async (event) => {
    await handler(event.payload as T);
  }).then((unsub) => {
    unsubscribe = unsub;
  });

  // 返回同步清理函数
  return () => {
    unsubscribe?.();
  };
};
