import { useRef, useCallback } from "react";

/**
 * 通用防抖 hook
 *
 * 典型用例：搜索输入框、窗口 resize 事件等需要延迟执行的场景
 *
 * @param callback 要防抖的回调函数
 * @param delay 防抖延迟时间（毫秒）
 * @param immediate 是否立即执行第一次调用，默认 false（加了这个一定会执行两次，第一次是立即执行，第二次是防抖执行）
 * @returns [防抖后的函数, 取消防抖的函数]
 *
 * @example
 * ```tsx
 * // 搜索输入防抖
 * const [debouncedSearch] = useDebounce(
 *   (term) => console.log('搜索:', term),
 *   300
 * );
 *
 * // 使用
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  immediate = false
): [T, () => void] {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const immediateExecutedRef = useRef(false);

  const cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    immediateExecutedRef.current = false;
  };

  // 包装原函数（记住，依赖相同不重新创建），加点东西，原类型返回
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const executeCallback = () => {
        immediateExecutedRef.current = false;
        callback(...args);
      };

      // 如果启用 immediate 且还没有执行过，立即执行
      if (immediate && !immediateExecutedRef.current) {
        immediateExecutedRef.current = true;
        callback(...args);
      }

      // 清除之前的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // 设置新的定时器
      timerRef.current = setTimeout(executeCallback, delay);
    },
    [callback, delay, immediate]
  ) as T;

  return [debouncedCallback, cancel];
}

/**
 * 专门用于防止频繁触发的防抖 hook（冷却模式）
 *
 * 与 useDebounce 的区别：
 * - useDebounce: 延迟执行，频繁调用会重置计时器
 * - useCooldown: 立即执行，但在冷却期内阻止重复执行
 *
 * 典型用例：按钮点击防护、鼠标悬停展开等需要立即响应但防止频繁触发的场景
 *
 * @param callback 要执行的回调函数
 * @param cooldown 冷却时间（毫秒）
 * @returns [带冷却的函数, 重置冷却的函数, 是否在冷却中]
 *
 * @example
 * ```tsx
 * // 按钮点击防护
 * const [handleClick, resetCooldown, isInCooldown] = useCooldown(
 *   () => console.log('按钮被点击'),
 *   1000
 * );
 *
 * // 使用
 * <button onClick={handleClick} disabled={isInCooldown}>
 *   {isInCooldown ? '冷却中...' : '点击我'}
 * </button>
 * ```
 */
export function useCooldown<T extends (...args: any[]) => any>(
  callback: T,
  cooldown: number
): [T, () => void, boolean] {
  const lastExecutedRef = useRef<number>(0);
  const isInCooldownRef = useRef(false);

  const reset = () => {
    lastExecutedRef.current = 0;
    isInCooldownRef.current = false;
  };

  const cooldownCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutedRef.current;

      // 如果还在冷却期内，直接返回
      if (timeSinceLastExecution < cooldown) {
        console.log(
          `Still in cooldown, ${cooldown - timeSinceLastExecution}ms remaining`
        );
        return;
      }

      // 执行回调并记录执行时间
      lastExecutedRef.current = now;
      isInCooldownRef.current = true;
      callback(...args);

      // 冷却时间结束后重置状态
      setTimeout(() => {
        isInCooldownRef.current = false;
      }, cooldown);
    },
    [callback, cooldown]
  ) as T;

  return [cooldownCallback, reset, isInCooldownRef.current];
}
