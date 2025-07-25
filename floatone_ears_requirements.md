# 📝 Project: 悬一句（FloatOne）需求文档

悬一句（FloatOne） 是一个以 Tauri + React 实现的跨平台桌面应用。其核心目标是在用户桌面顶部，非打扰式地显示阶段性引导语句或提示内容，以提升用户专注力、强化习惯养成、支持个人成长。

---

## ✅ 桌面窗口行为（Floating Window Behavior）

- **The system shall** 启动一个始终置顶的无边框、透明背景的悬浮窗口，默认显示在屏幕顶部中央。
- **The system shall** 默认只展示一个高度为 6px~12px 的细条，显示下拉图标。
- **While 鼠标悬停在悬浮区域时**, **the system shall** 平滑展开提示区域，显示完整语句。
- **When 鼠标离开展开区域时**, **the system shall** 在 1~2 秒后自动收起恢复为默认状态。

## ✅ 提示内容控制（Tip Content Control）

- **The system shall** 支持显示静态提示语句（例如：“先持续，后加量！”）。
- **Where 配置了多条提示语时**, **the system shall** 每隔一定时间自动轮换提示内容。
- **Where 启用用户个性化配置时**, **the system shall** 允许用户配置自定义提示语内容、顺序和轮换频率。

## ✅ 用户交互（User Interaction）

- **Where 启用拖动功能时**, **the system shall** 允许用户通过拖动改变浮动窗口位置，并记录位置。
- **The system shall** 悬浮窗口在点击时不可穿透，确保用户操作时不会点击到后台应用。
- **Where 用户按下快捷键（如 Alt+Space）时**, **the system shall** 切换浮窗的显示与隐藏状态。

## ✅ UI 与动画效果（UI and Animations）

- **The system shall** 提供平滑的展开和收起动画（持续约 300ms）。
- **The system shall** 显示为深色半透明背景，白色字体，带圆角和阴影。
- **Where 检测到暗色或亮色模式时**, **the system shall** 自动适配当前系统主题进行样式调整。

## ✅ 配置与数据持久化（Configuration & Data）

- **The system shall** 将用户的提示语配置、显示状态、窗口位置等数据持久保存至本地。
- **Where 启用云同步时**, **the system shall** 支持将设置与提示内容同步至云端（可选扩展）。

## ✅ 非功能性需求（Non-functional Requirements）

| 类别     | 描述                                    |
| -------- | --------------------------------------- |
| 启动性能 | 应用应在启动后 1 秒内完成浮窗加载       |
| 系统资源 | 内存占用低于 100MB，CPU 常驻占用低于 2% |
| 兼容性   | 支持 Windows 和 macOS                   |
| 安全性   | 禁止浮窗穿透和脚本注入                  |
| UI 规范  | 支持 DPI 缩放，适配高分屏，响应式布局   |

## ✅ 示例配置（JSON）

```json
{
  "tips": [
    "先持续，后加量！",
    "一步一步，稳中有进。",
    "规律胜于强度。",
    "专注当下，聚焦行动。"
  ],
  "autoRotate": true,
  "rotateInterval": 60000,
  "theme": "auto",
  "position": {
    "x": null,
    "y": 0
  },
  "shortcut": "Alt+Space"
}
```
