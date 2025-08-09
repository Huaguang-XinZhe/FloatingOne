import { createSchemaStore } from "tauri-mw-store";
import type { FloatOneConfig } from "@/types";

export const appStore = createSchemaStore({
  config: {
    default: null as FloatOneConfig | null,
    persist: true,
  },
  newVersionDownloaded: {
    default: false,
  },
});

export const initAppStore = () => appStore.init();

// 基于 key 自动生成的 API：getConfig/setConfig/useConfig/onConfigChange 等
export const {
  getConfig,
  setConfig,
  useConfig,
  onConfigChange,
  getNewVersionDownloaded,
  setNewVersionDownloaded,
  useNewVersionDownloaded,
  onNewVersionDownloadedChange,
} = appStore.api;
// 这里不要写成 as any，否则编译器会放弃类型检查❗
