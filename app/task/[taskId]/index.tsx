import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Container } from '../../../components/Container';
import TaskHeader from '../../../components/TaskHeader';
import MediaDisplay from '../../../components/MediaDisplay';
import ConversationContent from '../../../components/ConversationContent';
import BottomInputButton from '../../../components/BottomInputButton';
import { getVibeImage } from 'utils/getVibeImage';
import {
  getTaskConversation,
  type TaskRequest,
  type Message,
  getHistoryConversation,
} from '../../../api/task';
import { useAudioPlayer } from 'hooks';

const Task = () => {
  const { taskId, topic, from } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(true);

  // 初始化消息状态
  const [messages, setMessages] = useState<Message[]>([]);
  // 任务状态
  const [taskStatus, setTaskStatus] = useState<1 | 0>(1); // 1-进行中, 0-已完成
  // 是否正在获取对话
  const [isLoading, setIsLoading] = useState(false);
  // 用于中断当前请求的 AbortController
  const currentAbortControllerRef = useRef<AbortController | null>(null);

  
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
    getCurrentVoiceId
  } = useAudioPlayer();

  // 停止轮询
  const stopPolling = useCallback(() => {
    console.log('Stopping polling...');
    
    // 先设置 loading 状态为 false
    setIsLoading(false);
    
    // 然后中断当前请求
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }
  }, []);

  // 获取任务对话信息
  const fetchTaskConversation = useCallback(async (currentMessages: Message[] = []) => {
    // 取消之前的请求，但不检查 isLoading 状态
    // 因为用户打断时需要立即重新开始请求
    if (currentAbortControllerRef.current) {
      console.log('Aborting previous request');
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }

    // 创建新的 AbortController
    const abortController = new AbortController();
    currentAbortControllerRef.current = abortController;

    setIsLoading(true);
    try {
      const params: TaskRequest = {
        task_id: taskId as string,
        topic: Array.isArray(topic) ? topic.join(', ') : (topic as string) || '',
        context: currentMessages,
      };

      const response = await getTaskConversation(params, abortController.signal);

      // 检查请求是否被中断
      if (abortController.signal.aborted) {
        return;
      }

      // 更新消息列表和任务状态
      setMessages(response.context);
      setTaskStatus(response.status);

      // 播放
      setTimeout(() => {
        setIsPlaying(true);
        play();
      }, 200);

      // 如果任务仍在进行中，继续轮询
      if (response.status === 1 && !abortController.signal.aborted) {
        setTimeout(() => {
          if (!abortController.signal.aborted) {
            fetchTaskConversation(response.context);
          }
        }, 500);
      }
    } catch (error) {
      // 忽略被中断的请求错误
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request was aborted by user action');
        return;
      }
      console.error('获取任务对话信息失败:', error);
    } finally {
      // 只有在请求没有被中断的情况下才重置 loading 状态
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [taskId, topic]);

  // 开始轮询（用于首次获取和重新开始）
  const startPolling = useCallback((messages: Message[] = []) => {
    fetchTaskConversation(messages);
  }, [fetchTaskConversation]);

  // 组件挂载时开始获取对话信息
  useEffect(() => {
    async function getTask() {
      if (taskId) {
        try {
          const data = await getHistoryConversation(taskId as string);
          if (data && data.context) {
            // 处理历史消息，标记为历史
            const historyMessages = data.context.map(msg => ({ ...msg, isHistory: true }));
            setMessages(historyMessages);
            setTaskStatus(data.status);
            
            // 如果任务已完成，且是从侧边栏进入的，只播放不轮询
            if (data.status === 0 && historyMessages.length > 0 && from === 'sidebar') {
              setTimeout(() => {
                setIsPlaying(true);
                play();
              }, 500);
              return;
            }
            
            // 开始轮询获取最新对话，首次请求需要播放
            startPolling(historyMessages);
          }
        } catch (error) {
          console.error('获取历史信息失败:', error);
        }
      }
    }
    getTask();
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
  }, [messages, enqueueMultiple]);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    
    // 停止当前轮询和播放
    stopPolling();
    clearQueue();
    setIsPlaying(false);

    // 设置任务状态
    setTaskStatus(1);

    // 添加用户消息
    const userMessage: Message = {
      chunk_id: messages.length + 1,
      speaker_name: 'user',
      content: message,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // 延迟一小段时间确保停止操作完成，然后重新开始轮询
    setTimeout(() => {
      console.log('Restarting polling with updated messages');
      startPolling(updatedMessages);
    }, 100);
  };

  const handlePlayPause = () => {
    console.log('Play/Pause media');
    setIsPlaying((prev) => !prev);
    if (!isPlaying) {
      // 播放逻辑
      play();
    } else {
      // 暂停播放逻辑
      pause();
    }
  };

  const handlePressIn = () => {
    // 按下逻辑 - 语音输入开始，停止轮询
    console.log('Voice input started - stopping polling');
    stopPolling();
    clearQueue();
    setIsPlaying(false);
  }

  const handlePressOut = () => {
    
  }

  const handlePlayFromMessage = (messageIndex: number) => {
    console.log('Play from message index:', messageIndex);
    
    // 停止当前播放并清空队列
    clearQueue();
    setIsPlaying(false);
    
    // 获取从指定消息开始的所有后续消息
    const messagesFromIndex = messages.slice(messageIndex);
    
    if (messagesFromIndex.length > 0) {
      // 将消息加入播放队列并开始播放
      enqueueMultiple(messagesFromIndex);
      setTimeout(() => {
        setIsPlaying(true);
        play();
      }, 200);
    }
  };

  // 组件卸载时清理所有请求
  useEffect(() => {
    return () => {
      console.log('Component unmounting - cleaning up resources');
      stopPolling();
    };
  }, [stopPolling]);

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
          taskStatus={taskStatus}
          onPlayFromMessage={handlePlayFromMessage}
        />

        {/* 底部输入按钮 */}
        <BottomInputButton  onSendMessage={handleSendMessage} onHandlePressIn={handlePressIn} onHandlePressOut={handlePressOut} />
      </View>
    </Container>
  );
};

export default Task;
