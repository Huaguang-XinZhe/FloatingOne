# 发布指南

本文档介绍如何使用发布脚本和GitHub Actions自动构建适用于Windows、macOS和Linux的应用程序安装包。

## 准备工作

1. 确保你的代码已经提交到Git仓库
2. 确保你有GitHub仓库的写入权限
3. 确保你的本地环境已安装Node.js

## 使用发布脚本

我们提供了一个简便的发布脚本，可以自动更新版本号、创建Git标签并推送到GitHub，从而触发自动构建流程。

### 步骤1: 运行发布脚本

```bash
# 使用npm运行脚本，指定新版本号
npm run release 0.1.0

# 或者使用bun运行脚本
bun run release 0.1.0
```

这个脚本会：

1. 更新`package.json`、`tauri.conf.json`和`Cargo.toml`中的版本号
2. 提交这些更改
3. 创建一个新的Git标签（例如`v0.1.0`）
4. 将提交和标签推送到GitHub

### 步骤2: 监控构建进度

1. 推送标签后，前往GitHub仓库页面
2. 点击"Actions"标签查看构建进度
3. 你应该能看到一个名为"Release"的工作流正在运行

### 步骤3: 查看发布结果

1. 构建完成后，前往GitHub仓库的"Releases"页面
2. 你应该能看到一个新的发布版本，包含为三个平台构建的安装包
3. 如果需要，你可以编辑发布说明，添加更多信息

## 手动触发构建

如果你不想使用发布脚本，也可以手动触发构建流程：

1. 在GitHub仓库页面，点击"Actions"标签
2. 在左侧选择"Release"工作流
3. 点击"Run workflow"按钮
4. 选择要从哪个分支运行工作流，然后点击"Run workflow"

## 构建产物

构建完成后，你将获得以下安装包：

- Windows: `.msi`和`.exe`安装程序
- macOS: 
  - Intel (x86_64): `.dmg`和`.app.tar.gz`安装包
  - Apple Silicon (ARM64): `.dmg`和`.app.tar.gz`安装包
- Linux: `.AppImage`和`.deb`安装包

## 故障排除

如果构建失败，请检查：

1. GitHub Actions日志，查看具体错误信息
2. 确保你的仓库有适当的权限设置，允许GitHub Actions创建Release和上传文件
   - 在仓库设置中，进入 Settings > Actions > General，确保 "Workflow permissions" 设置为 "Read and write permissions"
3. 检查代码是否有编译错误
4. 对于macOS ARM64构建问题，确保Rust工具链正确配置了目标平台

## 优化说明

我们的GitHub Actions工作流已经进行了以下优化：

1. 使用 `swatinem/rust-cache@v2` 缓存Rust构建产物，加快构建速度
2. 为macOS平台同时构建Intel (x86_64)和Apple Silicon (ARM64)版本
3. 使用Tauri官方推荐的依赖项和构建配置

如果需要更多帮助，请参考[Tauri官方文档](https://tauri.app/v1/guides/distribution/publishing)和[Tauri GitHub Actions指南](https://v2.tauri.app/distribute/pipelines/github/)。