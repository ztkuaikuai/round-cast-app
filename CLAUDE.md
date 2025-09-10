# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

RoundCast 是一个基于 Expo 的 React Native 播客应用，使用 TypeScript 开发。该应用允许用户通过语音输入与AI助手对话，生成个性化播客内容。

## 开发命令

### 启动和构建
```bash
# 启动开发服务器
npm run start

# 在特定平台运行
npm run android
npm run ios  
npm run web

# 预构建项目
npm run prebuild

# EAS 构建
npm run eas:build:android
npm run eas:build:ios
```

### 代码质量
```bash
# 检查代码风格和类型错误
npm run lint

# 自动修复代码格式问题
npm run format
```

## 项目架构

### 核心技术栈
- **框架**: Expo 53.0.22 + React Native 0.79.5
- **语言**: TypeScript
- **导航**: Expo Router (文件系统路由)
- **样式**: NativeWind (Tailwind CSS for React Native) 
- **语音功能**: expo-audio
- **字体**: Anton-Regular, Montserrat

### 目录结构
```
├── app/                    # Expo Router 页面
│   ├── _layout.tsx        # 根布局 (Stack导航配置)
│   ├── index.tsx          # 首页 (落地页)
│   ├── home.tsx           # 主页面 (聊天界面)
│   ├── sidebar.tsx        # 侧边栏页面
│   ├── user-info.tsx      # 用户信息页面
│   └── task/[taskId]/     # 动态路由 (任务详情)
├── components/            # 可复用组件
│   ├── Container.tsx      # 页面容器
│   ├── Hero.tsx           # 首页英雄区域
│   ├── ChatMessages.tsx   # 聊天消息列表
│   ├── BottomInputButton.tsx # 底部输入组件
│   └── ...               # 其他UI组件
├── utils/                # 工具函数
│   ├── responsive.ts     # 响应式工具
│   └── getVibeImage.ts   # 图片处理工具
├── mock.ts               # Mock数据 (播客对话内容)
└── global.css           # Tailwind CSS样式
```

### 导航和路由
- 使用 Expo Router 的文件系统路由
- 根布局配置了Stack导航，所有页面默认无header
- 包含从左侧滑入的sidebar导航动画
- 支持动态路由 `/task/[taskId]`

### 状态管理
- 使用React内置的useState和useEffect
- 主要状态：聊天消息列表、界面显示状态、语音录制状态

### 样式系统
- 使用NativeWind (Tailwind CSS for React Native)
- 自定义动画：float动画、慢速旋转等
- 响应式设计工具函数
- 主色调：深紫色 (#1E0F59)、浅黄色背景 (#FFF7D3)

### 音频功能
- 集成expo-audio用于语音录制和播放
- 配置了麦克风权限 (iOS/Android)
- 支持语音转文字功能

## 开发注意事项

### 导入路径
- 组件使用相对路径：`import { Container } from "components/Container"`
- 工具函数：`import { useResponsive } from "utils/responsive"`
- 配置了TypeScript路径映射，但主要使用相对路径

### 平台兼容性
- 支持iOS、Android和Web
- 字体权重在iOS和Android上有不同处理
- 包含平台特定的权限配置

### Mock数据结构
- `mock.ts`包含完整的播客对话数据结构
- 包括发言人信息（姓名、角色、个性、背景）
- 支持多轮对话和情感标记

### 自定义字体
- Anton-Regular: 用于标题
- Montserrat: 用于正文
- 字体文件存放在assets目录

### 应用配置
- Bundle ID: com.kuaikuaitz.roundcast
- 自定义URL Scheme: roundcast
- EAS项目ID已配置
- 支持横竖屏切换