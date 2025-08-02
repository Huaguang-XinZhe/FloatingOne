import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ask, message } from "@tauri-apps/plugin-dialog";

/**
 * 检查应用更新
 * @param showNoUpdateDialog 当没有更新时是否显示对话框
 */
export async function checkForUpdates(showNoUpdateDialog = false) {
  try {
    const update = await check();

    if (update === null) {
      // 没有可用更新
      if (showNoUpdateDialog) {
        await message("当前已是最新版本", {
          title: "检查更新",
          kind: "info",
        });
      }
      return;
    }

    console.log(
      `found update ${update.version} from ${update.date} with notes ${update.body}`
    );

    const shouldUpdate = await ask(
      `发现新版本 ${update.version}！\n\n发布日期：${update.date}\n\n更新内容：\n${update.body}`,
      {
        title: "发现更新",
        kind: "info",
        okLabel: "立即更新",
        cancelLabel: "稍后更新",
      }
    );

    if (shouldUpdate) {
      try {
        let downloaded = 0;
        let contentLength = 0;

        // 下载并安装更新
        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              contentLength = event.data.contentLength || 0;
              console.log(
                `started downloading ${event.data.contentLength} bytes`
              );
              break;
            case "Progress":
              downloaded += event.data.chunkLength;
              console.log(`downloaded ${downloaded} from ${contentLength}`);
              break;
            case "Finished":
              console.log("download finished");
              break;
          }
        });

        console.log("update installed");
        await relaunch();
      } catch (error) {
        console.error("更新安装失败:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        await message(`更新安装失败：${errorMessage}\n\n请稍后重试或联系开发者`, {
          title: "更新失败",
          kind: "error",
        });
      }
    }
  } catch (error) {
    console.error("更新检查失败:", error);
    if (showNoUpdateDialog) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      await message(`检查更新失败：${errorMessage}\n\n请稍后重试或联系开发者`, {
        title: "错误",
        kind: "error",
      });
    }
  }
}

/**
 * 静默检查更新（应用启动时调用）
 */
export async function checkForUpdatesOnStartup() {
  try {
    const update = await check();

    if (update) {
      console.log(`发现新版本: ${update.version}`);
      console.log(`发布日期: ${update.date}`);
      console.log(`更新内容: ${update.body}`);
      // 静默检查，不显示对话框，只记录日志
      // 可以在这里添加通知逻辑
    }
  } catch (error) {
    console.error("启动时检查更新失败:", error);
  }
}
