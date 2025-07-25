export type Theme = "light" | "dark" | "system";

export interface FloatOneConfig {
  tips: string[];
  autoRotate: boolean;
  rotateInterval: number; // 轮换间隔，单位：秒
  theme: Theme;
}

export const DEFAULT_CONFIG: FloatOneConfig = {
  tips: [
    "先持续，后加量！",
    "必须挣钱！不只是生存！"
  ],
  autoRotate: true,
  rotateInterval: 60,
  theme: "dark"
};
