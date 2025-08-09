export interface FloatOneConfig {
  tips: string[];
  autoRotate: boolean;
  rotateInterval: number; // 轮换间隔，单位：秒
  theme: Theme;
  autoStart: boolean; // 开机自启动
}

export type Theme = "light" | "dark" | "system";

// 事件声明
export enum EventKey {
  CHECK_UPDATE = "check-update",
  INSTALL_REQUEST = "install-request",
}
