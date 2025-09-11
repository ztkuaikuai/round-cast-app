import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Container } from '../../../components/Container';
import TaskHeader from '../../../components/TaskHeader';
import MediaDisplay from '../../../components/MediaDisplay';
import ConversationContent from '../../../components/ConversationContent';
import BottomInputButton from '../../../components/BottomInputButton';
import { getVibeImage } from 'utils/getVibeImage';
import {
  getTaskConversation,
  type TaskRequest,
  type TaskResponse,
  type Message,
} from '../../../api/task';
import { useAudioPlayer } from 'hooks';

const Task = () => {
  const { taskId, topic } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(true);

  // 初始化消息状态
  const [messages, setMessages] = useState<Message[]>([]);
  // 任务状态
  const [taskStatus, setTaskStatus] = useState<1 | 0>(1); // 1-进行中, 0-已完成
  // 是否正在获取对话
  const [isLoading, setIsLoading] = useState(false);
  // 用户正看到的消息索引
  const [visibleMessageIndex, setVisibleMessageIndex] = useState(-1);
  const updateVisibleMessageIndex = (index: number) => {
    if (index > visibleMessageIndex) {
      setVisibleMessageIndex(index);
    }
  };
  const {
    isPlaying: isAudioPlaying,
    isLoading: isAudioLoading,
    queue,
    error,
    play,
    pause,
    enqueue,
    enqueueMultiple,
    clearQueue,
    getCurrentUrl
  } = useAudioPlayer();

  // 获取任务对话信息
  const fetchTaskConversation = async (currentMessages: Message[] = []) => {
    if (isLoading) return; // 防止重复请求

    setIsLoading(true);
    try {
      const params: TaskRequest = {
        task_id: taskId as string,
        topic: Array.isArray(topic) ? topic.join(', ') : (topic as string) || '',
        context: currentMessages,
      };

      const response: TaskResponse = await getTaskConversation(params);

      // 更新消息列表
      setMessages(response.context);
      // 更新任务状态
      setTaskStatus(response.status);

      // 如果任务仍在进行中，继续获取
      if (response.status === 1) {
        // 递归获取下一条消息
        setTimeout(() => {
          fetchTaskConversation(response.context);
        }, 500);
      }
    } catch (error) {
      console.error('获取任务对话信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时开始获取对话信息
  useEffect(() => {
    if (taskId) {
      fetchTaskConversation();
    }
  }, [taskId]);

  const prevMessagesRef = useRef<Message[]>([]);
  useEffect(() => {
    // 消息更新，推送语音信息
    if (messages.length > 0) {
      // 使用ref获取prevMessages，和最新的messages对比，通过从后向前比较chunk_id，找出新增的消息
      const prevMessages = prevMessagesRef.current;
      // 从后向前找到与prevMessages最后一项chunk_id相同的索引
      let newMessages: Message[] = [];
      if (prevMessages.length > 0) {
        const lastPrevChunkId = prevMessages[prevMessages.length - 1].chunk_id;
        const lastMatchIndex = messages.findLastIndex(msg => msg.chunk_id === lastPrevChunkId);
        
        if (lastMatchIndex !== -1) {
          // 截取匹配索引之后的所有消息作为新消息
          newMessages = messages.slice(lastMatchIndex + 1);
        } else {
          // 如果没有找到匹配项，说明所有消息都是新的
          newMessages = messages;
        }
      } else {
        // 如果之前没有消息，所有消息都是新的
        newMessages = messages;
      }

      if (newMessages.length > 0) {
        enqueueMultiple(newMessages);
      }

      prevMessagesRef.current = messages;
    }
  }, [messages.length]);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handlePlayPause = () => {
    console.log('Play/Pause media');
    setIsPlaying((prev) => !prev);
    // TODO)) 处理播放/暂停逻辑
    if (!isPlaying) {
      // 播放逻辑
      play();
    } else {
      // 暂停播放逻辑
      pause();
    }
  };

  useEffect(() => {
    // 组件挂载，自动播放
    setTimeout(() => {
      play();
    }, 500);
  }, []);

  return (
    <Container>
      <View className="flex-1">
        {/* 顶部标题区域 */}
        <TaskHeader
          title={
            Array.isArray(topic)
              ? topic.join(', ').replace(/。$/, '')
              : (topic as string)?.replace(/。$/, '') || ''
          }
        />

        {/* 展示区域 */}
        <MediaDisplay
          imageSource={getVibeImage(taskId as string)}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />

        {/* 会话内容区域 */}
        <ConversationContent
          messages={messages}
          updateVisibleMessageIndex={updateVisibleMessageIndex}
        />

        {/* 底部输入按钮 */}
        <BottomInputButton onSendMessage={handleSendMessage} />
      </View>
    </Container>
  );
};

export default Task;
