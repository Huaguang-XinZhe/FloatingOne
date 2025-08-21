import { createMWStore, storeConfig } from "tauri-mw-store";
import { FloatOneConfig } from "@/types";

export const {
  initAppStore,
  getConfig,
  setConfig,
  useConfig,
  getNewVersionDownloaded,
  setNewVersionDownloaded,
  useNewVersionDownloaded,
} = createMWStore({
  config: storeConfig({
    default: null as FloatOneConfig | null,
    persist: true,
  }),
  newVersionDownloaded: false,
});
