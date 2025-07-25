import { FloatOneConfig, DEFAULT_CONFIG } from '@/types/floatone-config';
import { create } from 'zustand';
import { configStoreManager } from './configStoreManager';
import { listen, emit } from '@tauri-apps/api/event';

// 定义事件名称
const CONFIG_UPDATE_EVENT = 'config-update';

// Zustand store 类型定义
interface ConfigState {
  config: FloatOneConfig;
  isInitialized: boolean;
  error: string | null;
  
  // 操作方法
  initialize: () => Promise<void>;
  updateConfig: (newConfig: Partial<FloatOneConfig>) => Promise<void>;
//   resetConfig: () => Promise<void>;
}

// 创建 Zustand store
export const useConfigStore = create<ConfigState>((set, get) => ({
  config: DEFAULT_CONFIG,
  isInitialized: false,
  error: null,
  
  // 初始化，加载存储的配置
  initialize: async () => {
    // 如果已经初始化过，则不再重复初始化
    if (get().isInitialized) return;
    
    try {
      const storedConfig = await configStoreManager.getStoredConfig();
      if (storedConfig) {
        // // 调试延迟
        // await new Promise(resolve => setTimeout(resolve, 10000));
        set({ 
          config: storedConfig, 
          isInitialized: true
        });
        console.log('Config initialized from storage:', storedConfig);
      } else {
        set({ isInitialized: true });
        console.log('No stored config found, using defaults');
      }

      // 监听配置更新事件
      listen(CONFIG_UPDATE_EVENT, (event) => {
        const newConfig = event.payload as FloatOneConfig;
        console.log('Received config update event:', newConfig);
        set({ config: newConfig });
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '配置初始化失败', 
        isInitialized: true
      });
    }
  },
  
  // 更新配置
  updateConfig: async (newConfig: Partial<FloatOneConfig>) => {
    try {
      const updatedConfig = { ...get().config, ...newConfig };
      await configStoreManager.saveConfig(updatedConfig);
      set({ config: updatedConfig });
      console.log('Config updated:', updatedConfig);
      
      // 发送配置更新事件到其他窗口
      await emit(CONFIG_UPDATE_EVENT, updatedConfig);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '配置更新失败' });
    }
  },
  
//   // 重置配置
//   resetConfig: async () => {
//     try {
//       await configStoreManager.saveConfig(DEFAULT_CONFIG);
//       set({ config: DEFAULT_CONFIG });
//       console.log('Config reset to defaults');
//     } catch (error) {
//       set({ error: error instanceof Error ? error.message : '配置重置失败' });
//     }
//   }
}));

// 导出一个初始化函数，用于在应用启动时调用
export const initializeConfig = async () => {
  await useConfigStore.getState().initialize();
}; 