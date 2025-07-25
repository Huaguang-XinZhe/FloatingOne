import { useRef } from "react";
import { Window } from "@tauri-apps/api/window";
// 只需引入，无需手动保存和恢复❗
// import {
//   // saveWindowState,
//   restoreStateCurrent,
//   StateFlags,
// } from "@tauri-apps/plugin-window-state";

export function useWindowDrag() {
  const appWindow = useRef<Window>(Window.getCurrent());
  // const [isDragging, setIsDragging] = useState(false);

  // useEffect(() => {
  //   restoreStateCurrent(StateFlags.ALL);
  // }, []);

  // 这个事件可能是文件拖入相关的❗
  // useEffect(() => {
  //   appWindow.onDragDropEvent((e) => {
  //     console.log("onDragDropEvent", e);
  //     handleDragEnd();
  //   });
  // }, []);

  // 处理拖动开始
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // 只响应左键
    console.log("handleDragStart");
    // setIsDragging(true);
    if (appWindow.current) {
      appWindow.current.startDragging();
    }
  };

  // 在 onDropEnd 中也不会触发❗
  // 不能直接在 onMouseUp 中调用，因为这个事件会被 Tauri 的  startDragging 截获❗
  // 处理拖动结束
  // const handleDragEnd = () => {
  //   console.log("handleDragEnd");
  //   // setIsDragging(false);
  //   // 无需手动保存，窗口关闭时会自动记住❗
  //   // saveWindowState(StateFlags.ALL);
  // };

  return {
    // isDragging,
    handleDragStart,
    // handleDragEnd,
  };
}
