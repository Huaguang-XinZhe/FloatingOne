import { Store } from '@tauri-apps/plugin-store';
import { FloatOneConfig } from '@/config/config';

/**
 * Tauri 存储管理类
 * 负责与 Tauri 的 Store API 交互，处理配置的持久化存储
 */
class ConfigStoreManager {
  private store: Store | null = null;
  
  /**
   * 初始化存储
   * 如果存储已初始化，直接返回
   */
  async initStore() {
    if (!this.store) {
      try {
        this.store = await Store.load('store.bin');
        return this.store;
      } catch (error) {
        console.error('Failed to initialize config store:', error);
        throw error;
      }
    }
    return this.store;
  }
  
  /**
   * 获取存储的配置
   * 如果没有存储配置，返回 null
   */
  async getStoredConfig(): Promise<FloatOneConfig | null> {
    try {
      const store = await this.initStore();
      const savedConfig = await store.get<FloatOneConfig>('config');
      return savedConfig || null;
    } catch (error) {
      console.error('Failed to get stored config:', error);
      return null;
    }
  }
  
  /**
   * 保存配置
   * @param config 要保存的配置
   * @returns 是否保存成功
   */
  async saveConfig(config: FloatOneConfig): Promise<boolean> {
    try {
      const store = await this.initStore();
      await store.set('config', config);
      await store.save();
      return true;
    } catch (error) {
      console.error('Failed to save config:', error);
      return false;
    }
  }
}

// 创建单例并导出
export const configStoreManager = new ConfigStoreManager(); 