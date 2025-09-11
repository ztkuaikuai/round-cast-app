import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useState, useEffect } from 'react';
import { Container } from '../../../components/Container';
import TaskHeader from '../../../components/TaskHeader';
import MediaDisplay from '../../../components/MediaDisplay';
import ConversationContent from '../../../components/ConversationContent';
import BottomInputButton from '../../../components/BottomInputButton';
import { getVibeImage } from 'utils/getVibeImage';
import { messageMock } from 'mock';

// 定义消息类型
export interface Message {
  chunk_id: number;
  speaker_name: string | 'user';
  content: string;
  url?: string; // 音频的URL链接，只有非用户消息才有
}

const Task = () => {
  const { taskId, query } = useLocalSearchParams();
  console.log('🚀 ~ Task ~ taskId:', taskId, 'query:', query);

  // 初始化消息状态
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handlePlayPause = () => {
    console.log('Play/Pause media');
    // TODO: 处理播放/暂停逻辑
  };

  return (
    <Container>
      <View className="flex-1">
        {/* 顶部标题区域 */}
        <TaskHeader title={Array.isArray(query) ? query.join(', ') : query} />

        {/* 展示区域 */}
        <MediaDisplay imageSource={getVibeImage(taskId as string)} onPlayPause={handlePlayPause} />

        {/* 会话内容区域 */}
        <ConversationContent messages={messages} />

        {/* 底部输入按钮 */}
        <BottomInputButton onSendMessage={handleSendMessage} />
      </View>
    </Container>
  );
};

export default Task;
