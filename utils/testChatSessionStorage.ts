// 简单的测试文件，用于验证聊天会话存储功能
import { ChatSessionStorage } from './chatSessionStorage';

// 测试函数
export const testChatSessionStorage = async () => {
  console.log('开始测试聊天会话存储功能...');

  try {
    // 清除现有数据
    await ChatSessionStorage.clearAllSessions();
    console.log('✅ 清除现有数据成功');

    // 测试添加会话
    await ChatSessionStorage.addSession('test-1', '这是第一个测试问题');
    await ChatSessionStorage.addSession('test-2', '这是第二个测试问题');
    console.log('✅ 添加测试会话成功');

    // 测试获取会话
    const sessions = await ChatSessionStorage.getSessions();
    console.log('✅ 获取会话成功，共', sessions.length, '个会话');
    console.log('会话列表:', sessions);

    // 测试获取特定会话
    const session1 = await ChatSessionStorage.getSession('test-1');
    console.log('✅ 获取特定会话成功:', session1);

    // 测试删除会话
    await ChatSessionStorage.deleteSession('test-1');
    const remainingSessions = await ChatSessionStorage.getSessions();
    console.log('✅ 删除会话成功，剩余', remainingSessions.length, '个会话');

    console.log('🎉 所有测试通过！');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
};
