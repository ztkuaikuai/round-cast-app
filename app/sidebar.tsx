import { Container } from 'components/Container';
import UserInfo from 'components/UserInfo';
import ChatHistory from 'components/ChatHistory';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, Text as RNText } from 'react-native';
import { useState, useCallback } from 'react';
import { ChatSessionStorage, ChatSession } from 'utils/chatSessionStorage';

const Sidebar = () => {
  const router = useRouter();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟用户数据
  const userData = {
    avatar: 'https://webp.kuaikuaitz.top/avatar_kk2.jpg', // 临时占位图
    name: 'KuaiKuai',
    id: '34567890',
    tags: ['AI Coding', 'PM', 'FE', 'React'],
  };

  // 加载聊天会话数据
  const loadChatSessions = useCallback(async () => {
    try {
      setLoading(true);
      const sessions = await ChatSessionStorage.getSessions();
      setChatSessions(sessions);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      // 如果加载失败，使用空数组
      setChatSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 使用 useFocusEffect 来在页面获得焦点时重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadChatSessions();
    }, [loadChatSessions])
  );

  const handleSessionPress = (sessionId: string, title: string) => {
    // 处理会话点击
    router.push({
      pathname: '/task/[taskId]',
      params: { taskId: sessionId, topic: title },
    });
  };

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {/* 用户信息区域 */}
        <UserInfo
          avatar={userData.avatar}
          name={userData.name}
          id={userData.id}
          tags={userData.tags}
        />

        {/* 历史会话区域 */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RNText
              style={{
                fontFamily: 'Montserrat',
                fontSize: 16,
                color: '#1E0F59',
              }}>
              加载中...
            </RNText>
          </View>
        ) : chatSessions.length > 0 ? (
          <ChatHistory sessions={chatSessions} onSessionPress={handleSessionPress} />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <RNText
              style={{
                fontFamily: 'Montserrat',
                fontSize: 16,
                color: '#1E0F59',
                textAlign: 'center',
              }}>
              暂无聊天记录{'\n'}开始一段新的对话吧！
            </RNText>
          </View>
        )}
      </View>
    </Container>
  );
};

export default Sidebar;
