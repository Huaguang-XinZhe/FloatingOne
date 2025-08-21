import { ask } from "@tauri-apps/plugin-dialog";
import { Update, check } from "@tauri-apps/plugin-updater";
import { setNewVersionDownloaded } from "@/store/appStore";

/**
 * 版本更新工具类
 */
export default class VersionUpdateUtils {
  private update: Update | null = null;

  /**
   * 检查更新
   */
  async checkForUpdates(): Promise<void> {
    console.log("🔍 开始检查版本更新");

    try {
      const update = await check();

      if (!update) {
        console.log("✅ 没有可用更新，当前已是最新版本");
        return;
      }

      if (update.version === this.update?.version) {
        console.log("✅ 当前已缓存了最新版本");
        return;
      }

      console.log(`🆕 发现未缓存的新版本: ${update.version}`);
      this.update = update;

      // 自动开始下载
      console.log("🚀 自动开始下载新版本");
      await update.download();
      console.log(`✅ 版本 ${update.version} 下载完成`);

      await setNewVersionDownloaded(true);
    } catch (error) {
      console.error("检查更新失败:", error);
      this.update = null;
    }
  }

  /**
   * 询问并安装更新
   */
  async askAndInstall(): Promise<void> {
    if (!this.update) return;

    const shouldUpdate = await ask(
      `发现新版本 ${this.update.version}！\n\n发布日期：${this.update.date || "未知"}\n\n更新内容：\n${this.update.body || "无更新说明"}\n\n注意：安装过程中可能会弹出Windows安全提示，请点击"是"以继续安装。`,
      {
        title: "发现更新",
        kind: "info",
        okLabel: "立即安装",
        cancelLabel: "稍后安装",
      }
    );

    if (shouldUpdate) {
      console.log(`🚀 开始安装版本 ${this.update.version}`);
      await this.update.install();
      console.log("📦 安装程序已启动，应用即将重启");
    }
  }
}
