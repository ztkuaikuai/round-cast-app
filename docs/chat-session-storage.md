# 聊天会话存储功能实现

## 概述
本次实现将 `sidebar.tsx` 中的模拟数据 `chatSessions` 替换为真实的本地存储数据，实现用户对话历史的持久化存储。

## 实现的功能

### 1. 聊天会话存储工具类 (`utils/chatSessionStorage.ts`)
- 使用 `AsyncStorage` 进行本地数据持久化存储
- 支持添加、获取、删除聊天会话
- 自动按日期倒序排列（最新的在前面）
- 支持颜色索引的循环分配

### 2. 主页面更新 (`app/home.tsx`)
- 在用户发送消息并收到 Agent 响应时，自动保存聊天会话
- 使用 `agentMessage.id` 作为会话的唯一标识
- 使用 `agentMessage.userQuery`（用户原始问题）作为会话标题

### 3. 侧边栏更新 (`app/sidebar.tsx`)
- 移除了硬编码的模拟数据
- 添加了加载状态和空状态的用户界面
- 使用 `useFocusEffect` 确保每次页面获得焦点时重新加载最新数据
- 支持异步数据加载和错误处理

## 主要改动

### 新增文件
- `utils/chatSessionStorage.ts` - 聊天会话存储工具类
- `utils/testChatSessionStorage.ts` - 测试工具（可选）

### 修改文件
- `app/home.tsx` - 添加了会话保存逻辑
- `app/sidebar.tsx` - 替换模拟数据为真实数据

### 新增依赖
- `@react-native-async-storage/async-storage` - 本地存储库

## 数据结构

```typescript
interface ChatSession {
  id: string;          // 会话唯一标识（来自 agentMessage.id）
  title: string;       // 会话标题（来自用户问题）
  date: string;        // 会话日期（YYYY-MM-DD 格式）
  colorIndex: number;  // 颜色索引（0-3 循环）
}
```

## 使用方式

### 用户角度
1. 在主页面输入问题并发送
2. Agent 响应后，会话会自动保存
3. 在侧边栏可以查看所有历史会话
4. 点击会话可以跳转到对应的任务详情页面

### 开发者角度
```typescript
import { ChatSessionStorage } from 'utils/chatSessionStorage'

// 添加新会话
await ChatSessionStorage.addSession(messageId, userQuery)

// 获取所有会话
const sessions = await ChatSessionStorage.getSessions()

// 删除会话
await ChatSessionStorage.deleteSession(sessionId)
```

## 特性

1. **持久化存储** - 数据在应用重启后依然保存
2. **自动排序** - 最新的会话显示在最前面
3. **颜色循环** - 自动为会话分配不同的背景颜色
4. **实时更新** - 侧边栏会在获得焦点时自动刷新数据
5. **错误处理** - 优雅处理存储错误，不会影响用户体验
6. **加载状态** - 提供加载中和空状态的用户界面

## 注意事项

- 每个 Agent 响应都会创建一个新的会话记录
- 会话 ID 基于时间戳生成，确保唯一性
- 颜色索引会循环使用 4 种预定义颜色
- 使用 expo-router 的 `useFocusEffect` 确保页面数据实时性
