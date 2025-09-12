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
  type TaskResponse,
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
  // 使用 ref 来解决闭包问题
  const shouldStopPollingRef = useRef(false);
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
    getCurrentUrl
  } = useAudioPlayer();

  // 获取任务对话信息
  const fetchTaskConversation = useCallback(async (currentMessages: Message[] = [], isFirst = false, next = false) => {
    // next 给打断使用
    if (!next) {
      if (isLoading || shouldStopPollingRef.current) {
        console.log('Skipping fetch:', { isLoading, shouldStopPolling: shouldStopPollingRef.current });
        return; // 防止重复请求和语音输入时停止轮询
      }
    }

    // 取消之前的请求
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
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

      let response: TaskResponse | null = null;
      response = await getTaskConversation(params, abortController.signal);

      // 检查请求是否被中断，如果是则不执行后续逻辑
      if (abortController.signal.aborted) {
        console.log('Request was aborted, skipping state updates');
        return;
      }

      // 更新消息列表
      setMessages(response.context);
      // 更新任务状态
      setTaskStatus(response.status);

      if (isFirst) {
        setTimeout(() => {
          play();
        }, 500);
      }

      // 如果任务仍在进行中且没有被停止轮询，继续获取
      if (response.status === 1 && !abortController.signal.aborted) {
        // 递归获取下一条消息，使用 setTimeout 并检查最新的 ref 值
        setTimeout(() => {
          if (!shouldStopPollingRef.current && !abortController.signal.aborted) {
            fetchTaskConversation(response.context);
          } else {
            console.log('Polling stopped due to voice input or abort');
          }
        }, 500);
      }
    } catch (error) {
      // 特别处理请求被中断的情况
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted by user action');
        return; // 中断的请求不需要错误处理
      }
      console.error('获取任务对话信息失败:', error);
    } finally {
      // 只有在请求没有被中断的情况下才重置 loading 状态
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [taskId, topic, from, isLoading]);

  // 组件挂载时开始获取对话信息
  useEffect(() => {
    async function getTask() {
      if (taskId) {
        // 先获取历史信息
        try {
          const data = await getHistoryConversation(taskId as string);
          if (data && data.context) {
            setMessages(data.context);
            setTaskStatus(data.status);
          }
          if (data.status === 0 && data.context.length > 0 && from === 'sidebar') {
            // 如果任务已完成，且是从侧边栏进入的，不用继续请求，并在500ms后播放
            setTimeout(() => {
              play();
            }, 500);
            return;
          }
          // 再获取最新的对话
          fetchTaskConversation(data.context, true); // 初始获取
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
  }, [messages.length]);

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    
    // 立即中断当前正在进行的请求
    if (currentAbortControllerRef.current) {
      console.log('Aborting current request due to user input');
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }

    // 停止当前轮询
    shouldStopPollingRef.current = true;
    
    // 重置 loading 状态，因为我们中断了当前请求
    setIsLoading(false);

    const userMessage: Message = {
      chunk_id: messages.length + 1,
      speaker_name: 'user',
      content: message,
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    // 重新启用轮询并发送用户消息后继续获取任务对话
    shouldStopPollingRef.current = false;
    fetchTaskConversation(updatedMessages, false, true); // 打断对话，强制获取最新
    
    setTimeout(() => {
      play(); // 继续播放队列中的音频
    }, 500);
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
    shouldStopPollingRef.current = true;
    clearQueue();
  }

  const handlePressOut = () => {
    
  }

  // 组件卸载时清理所有请求
  useEffect(() => {
    return () => {
      // 清理当前的 AbortController
      if (currentAbortControllerRef.current) {
        currentAbortControllerRef.current.abort();
      }
      // 停止轮询
      shouldStopPollingRef.current = true;
    };
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
        />

        {/* 底部输入按钮 */}
        <BottomInputButton  onSendMessage={handleSendMessage} onHandlePressIn={handlePressIn} onHandlePressOut={handlePressOut} />
      </View>
    </Container>
  );
};

export default Task;
