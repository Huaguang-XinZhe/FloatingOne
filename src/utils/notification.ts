import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

/**
 * 通知管理器
 */
export class NotificationManager {
  /**
   * 检查通知权限
   */
  private static async checkPermission(): Promise<boolean> {
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === "granted";
    }

    return permissionGranted;
  }

  /**
   * 发送更新完成通知
   */
  static async sendUpdateNotification(version: string) {
    if (await this.checkPermission()) {
      sendNotification({
        title: "悬一句更新完成",
        body: `已成功更新到版本 ${version}`,
        icon: "/icons/icon.png",
      });
    }
  }

  /**
   * 发送自定义通知
   */
  static async sendCustomNotification(
    title: string,
    body: string,
    icon?: string
  ) {
    if (await this.checkPermission()) {
      sendNotification({
        title,
        body,
        icon: icon || "/icons/icon.png",
      });
    }
  }

  /**
   * 发送应用启动通知
   */
  static async sendStartupNotification() {
    if (await this.checkPermission()) {
      sendNotification({
        title: "悬一句",
        body: "应用已启动，开始为您提供桌面提示服务",
        icon: "/icons/icon.png",
      });
    }
  }

  /**
   * 发送错误通知
   */
  static async sendErrorNotification(error: string) {
    if (await this.checkPermission()) {
      sendNotification({
        title: "悬一句 - 错误",
        body: error,
        icon: "icons/icon.png",
      });
    }
  }
}
