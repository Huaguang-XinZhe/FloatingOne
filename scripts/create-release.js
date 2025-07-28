#!/usr/bin/env node

/**
 * 创建发布标签并推送到GitHub的脚本
 * 使用方法: node scripts/create-release.js [版本号]
 * 例如: node scripts/create-release.js 0.1.0
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES模块中没有__dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  try {
    // 添加所有更改的文件，确保不会遗漏任何更改
    execSync('git add .');
    
    // 检查是否有文件被暂存
    const stagedFiles = execSync('git diff --cached --name-only').toString().trim();
    
    if (stagedFiles) {
      // 如果有暂存的文件，提交更改
      execSync(`git commit -m "chore: 发布 v${version}"`);
      console.log('✅ 已提交版本更新');
    } else {
      console.log('⚠️ 没有文件需要提交，跳过提交步骤');
    }
  } catch (error) {
    console.error(`❌ 提交过程中出错: ${error.message}`);
    process.exit(1);
  }
  
  // 创建标签
  try {
    // 检查标签是否已存在
    const existingTags = execSync('git tag').toString().trim().split('\n');
    
    if (existingTags.includes(`v${version}`)) {
      console.log(`⚠️ 标签 v${version} 已存在，跳过创建标签步骤`);
    } else {
      execSync(`git tag -a v${version} -m "版本 ${version}"`);
      console.log(`✅ 已创建标签 v${version}`);
    }
  } catch (error) {
    console.error(`❌ 创建标签过程中出错: ${error.message}`);
    process.exit(1);
  }
  
  // 推送提交和标签
  try {
    console.log('🔄 正在推送提交和标签到远程仓库...');
    
    // 获取当前分支名
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    
    // 检查是否有远程仓库
    const remotes = execSync('git remote').toString().trim();
    if (!remotes) {
      console.log('⚠️ 没有配置远程仓库，跳过推送步骤');
      console.log('💡 提示：使用 git remote add origin <仓库URL> 添加远程仓库');
    } else {
      try {
        // 检查分支是否有上游分支
        execSync(`git rev-parse --abbrev-ref ${currentBranch}@{upstream}`, { stdio: 'pipe' });
        // 如果有上游分支，直接推送
        execSync('git push');
      } catch (error) {
        // 如果没有上游分支，设置上游分支并推送
        console.log(`当前分支 ${currentBranch} 没有上游分支，正在设置上游分支...`);
        execSync(`git push --set-upstream origin ${currentBranch}`);
      }
      
      // 推送标签
      execSync('git push --tags');
      console.log('✅ 已推送提交和标签到远程仓库');
    }
  } catch (error) {
    console.error(`❌ 推送过程中出错: ${error.message}`);
    console.log('💡 提示：您可以稍后手动推送：git push && git push --tags');
    // 不退出，因为版本号已经更新，标签可能已经创建
  }
  
  console.log('🎉 版本更新完成！');
  
  // 检查是否有远程仓库
  const hasRemote = execSync('git remote').toString().trim() !== '';
  
  if (hasRemote) {
    try {
      // 检查是否有GitHub Actions配置
      const hasGitHubActions = fs.existsSync(path.join(process.cwd(), '.github', 'workflows'));
      
      if (hasGitHubActions) {
        console.log(`GitHub Actions 将自动构建版本 v${version} 的安装包。`);
        console.log('请前往 GitHub 仓库的 Actions 标签页查看构建进度。');
        console.log('💡 提示：如果GitHub Actions构建失败并显示"Resource not accessible by integration"错误，');
        console.log('      请检查仓库的Actions权限设置：');
        console.log('      1. 前往 GitHub 仓库 -> Settings -> Actions -> General');
        console.log('      2. 在 Workflow permissions 部分，选择 "Read and write permissions"');
        console.log('      3. 或者在工作流文件中为每个任务添加 "permissions: contents: write"');
      } else {
        console.log(`版本 v${version} 已创建并推送到远程仓库。`);
        console.log('注意：未检测到 GitHub Actions 配置，不会自动构建安装包。');
      }
    } catch (error) {
      console.log(`版本 v${version} 已创建。`);
      console.log('注意：检查 GitHub Actions 配置时出错，不确定是否会自动构建安装包。');
    }
  } else {
    console.log(`版本 v${version} 已在本地创建。`);
    console.log('注意：未检测到远程仓库，GitHub Actions 不会被触发。');
    console.log('如需触发自动构建，请配置远程仓库并推送标签：');
    console.log('  git remote add origin <仓库URL>');
    console.log('  git push --set-upstream origin <当前分支>');
    console.log('  git push --tags');
  }
  
} catch (error) {
  console.error('❌ 发布过程中出错:', error.message);
  process.exit(1);
}