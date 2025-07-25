import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Event } from "@tauri-apps/api/event";
import { Button } from "@heroui/button";

export default function CreateWindowButton() {
  const openNewWindow = () => {
    const label = `window-${Date.now()}`; // 动态唯一标签
    const win = new WebviewWindow(label, {
      url: "index.html", // 也可以是其他 HTML 页面
      width: 500,
      height: 300,
      title: "新窗口",
    });

    win.once("tauri://created", () => {
      console.log(`窗口 ${label} 已创建`);
    });

    win.once("tauri://focus", () => {
      console.log(`窗口 ${label} 已获得焦点`);
    });

    win.once("tauri://error", (event: Event<unknown>) => {
      console.error("窗口创建失败", event);
    });
  };

  return (
    <Button color="primary" onPress={openNewWindow}>
      打开新窗口
    </Button>
  );
}
