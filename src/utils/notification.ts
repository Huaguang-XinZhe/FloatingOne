import {
  isPermissionGranted,
  requestPermission,
  sendNotification
} from '@tauri-apps/plugin-notification';

/**
 * 通知管理器
 * 
 * 注意：在 Windows 上，Tauri 通知可能会显示为 "Windows PowerShell" 发出，
 * 这是 Tauri 底层通知库的已知限制。解决方案：
 * 1. 确保应用已正确安装（而不是直接运行 .exe 文件）
 * 2. 在 tauri.conf.json 中配置正确的 identifier 和 productName
 * 3. 使用正确的图标路径（相对于 public 目录）
 */
export class NotificationManager {
  /**
   * 检查通知权限
   */
  private static async checkPermission(): Promise<boolean> {
    let permissionGranted = await isPermissionGranted();
    
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    
    return permissionGranted;
  }
  
  /**
   * 发送更新完成通知
   */
  static async sendUpdateNotification(version: string) {
    if (await this.checkPermission()) {
      sendNotification({
        title: '悬一句更新完成',
        body: `已成功更新到版本 ${version}`,
        icon: '/icons/icon.png'
      });
    }
  }
  
  /**
   * 发送自定义通知
   */
  static async sendCustomNotification(title: string, body: string, icon?: string) {
    if (await this.checkPermission()) {
      sendNotification({ 
        title, 
        body,
        icon: icon || '/icons/icon.png'
      });
    }
  }
  
  /**
   * 发送应用启动通知
   */
  static async sendStartupNotification() {
    if (await this.checkPermission()) {
      sendNotification({
        title: '悬一句',
        body: '应用已启动，开始为您提供桌面提示服务',
        icon: '/icons/icon.png'
      });
    }
  }
  
  /**
   * 发送错误通知
   */
  static async sendErrorNotification(error: string) {
    if (await this.checkPermission()) {
      sendNotification({
        title: '悬一句 - 错误',
        body: error,
        icon: 'icons/icon.png'
      });
    }
  }
}