#!/usr/bin/env node

/**
 * 创建发布标签并推送到GitHub的脚本
 * 使用方法: node scripts/create-release.js [版本号]
 * 例如: node scripts/create-release.js 0.1.0
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取版本号参数
const version = process.argv[2];

if (!version) {
  console.error('错误: 请提供版本号');
  console.log('使用方法: node scripts/create-release.js [版本号]');
  console.log('例如: node scripts/create-release.js 0.1.0');
  process.exit(1);
}

// 验证版本号格式
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error('错误: 版本号格式无效，应为 x.y.z 格式');
  process.exit(1);
}

try {
  // 读取 package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // 更新 package.json 中的版本号
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ 已更新 package.json 版本号为 ${version}`);
  
  // 读取 tauri.conf.json
  const tauriConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
  const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf8'));
  
  // 更新 tauri.conf.json 中的版本号
  tauriConf.version = version;
  fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');
  console.log(`✅ 已更新 tauri.conf.json 版本号为 ${version}`);
  
  // 读取 Cargo.toml
  const cargoTomlPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml');
  let cargoToml = fs.readFileSync(cargoTomlPath, 'utf8');
  
  // 更新 Cargo.toml 中的版本号
  cargoToml = cargoToml.replace(/^version = ".*"$/m, `version = "${version}"`);
  fs.writeFileSync(cargoTomlPath, cargoToml);
  console.log(`✅ 已更新 Cargo.toml 版本号为 ${version}`);
  
  // 提交更改
  execSync('git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml');
  execSync(`git commit -m "chore: 发布 v${version}"`);
  console.log('✅ 已提交版本更新');
  
  // 创建标签
  execSync(`git tag -a v${version} -m "版本 ${version}"`);
  console.log(`✅ 已创建标签 v${version}`);
  
  // 推送提交和标签
  console.log('🔄 正在推送提交和标签到远程仓库...');
  execSync('git push');
  execSync('git push --tags');
  console.log('✅ 已推送提交和标签到远程仓库');
  
  console.log('\n🎉 发布流程已启动！');
  console.log(`GitHub Actions 将自动构建版本 v${version} 的安装包。`);
  console.log('请前往 GitHub 仓库的 Actions 标签页查看构建进度。');
  
} catch (error) {
  console.error('❌ 发布过程中出错:', error.message);
  process.exit(1);
}