import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { useResponsive } from 'utils/responsive';
import LoadingAnimation from 'components/LoadingAnimation';
import WaitingForContentAnimation from 'components/WaitingForContentAnimation';
import { Message } from 'api/task';

interface ConversationContentProps {
  messages: Message[];
  taskStatus: 1 | 0; // 1-进行中, 0-已完成
}

// TypewriterText 组件 - 处理单个消息的打字机效果
interface TypewriterTextProps {
  text: string;
  style: any;
  isActive: boolean;
  isHistory?: boolean; // 可选字段，标识是否为历史消息
  onComplete?: () => void;
}

const TypewriterText = React.memo(({ text, style, isActive, isHistory, onComplete }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 重置打字机状态
  const resetTypewriter = useCallback(() => {
    clearTimer();
    setDisplayedText('');
  }, [clearTimer]);

  // 完成打字机效果
  const completeTypewriter = useCallback(() => {
    clearTimer();
    setDisplayedText(text);
    onComplete?.();
  }, [text, clearTimer, onComplete]);

  // 打字机动画逻辑
  useEffect(() => {
    if (!isActive || isHistory) {
      // 如果不是激活状态，直接显示完整文本
      completeTypewriter();
      return;
    }

    // 重置状态开始新的打字机动画
    resetTypewriter();

    let currentIndex = 0;
    
    const typeNextChar = () => {
      currentIndex += 1;
      
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        
        if (currentIndex < text.length) {
          // 继续下一个字符
          timerRef.current = setTimeout(typeNextChar, 50); // 50ms 间隔
        } else {
          // 完成打字
          onComplete?.();
        }
      }
    };

    // 开始打字动画
    if (text.length > 0) {
      timerRef.current = setTimeout(typeNextChar, 50);
    }

    return clearTimer;
  }, [text, isActive, resetTypewriter, completeTypewriter, clearTimer, onComplete]);

  // 组件卸载时清理
  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return (
    <Text style={style}>
      {displayedText}
    </Text>
  );
});

const ConversationContent = ({ messages, taskStatus }: ConversationContentProps) => {
  const { scale, verticalScale } = useResponsive();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // 打字机状态管理
  const [activeTypingMessageId, setActiveTypingMessageId] = useState<number | null>(null);
  // 追踪打字机是否完成
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // 当消息更新时，处理打字机效果和自动滚动
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // 激活最后一条消息的打字机效果
      setActiveTypingMessageId(lastMessage.chunk_id);
      // 重置打字机完成状态
      setIsTypingComplete(false);
      
      // 延迟执行确保内容已渲染
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // 处理打字机完成回调
  const handleTypingComplete = useCallback(() => {
    // 标记打字机完成
    setIsTypingComplete(true);
    
    // 打字机完成后再次滚动到底部，确保完整内容可见
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  const getSpeakerDisplayName = (speaker: Message['speaker_name']) => {
    if (speaker === 'user') {
      return 'You:';
    }
    return `${speaker}:`;
  };

  const getSpeakerStyle = (role: string) => {
    // 基础样式
    const baseStyle = {
      fontFamily: 'Montserrat',
      fontWeight: Platform.OS === 'ios' ? ('400' as const) : ('700' as const),
      fontSize: scale(18),
      lineHeight: verticalScale(26),
      color: '#1E0F59',
    };

    return baseStyle;
  };

  // 当消息长度为0时，显示加载动画
  if (messages.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          marginTop: verticalScale(20),
        }}>
        <LoadingAnimation />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: verticalScale(20),
      }}>
      <ScrollView
        ref={scrollViewRef}
        style={{
          flex: 1,
          paddingHorizontal: scale(39),
        }}
        contentContainerStyle={{
          paddingBottom: verticalScale(20),
        }}
        showsVerticalScrollIndicator={false}>
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1;
          const isTypingActive = activeTypingMessageId === message.chunk_id;
          
          return (
            <View key={message.chunk_id} style={{ marginBottom: verticalScale(20) }}>
              {/* 说话人名称 */}
              <Text
                style={{
                  ...getSpeakerStyle(message.speaker_name),
                  fontFamily: '',
                  fontWeight: Platform.OS === 'ios' ? ('700' as const) : ('900' as const),
                  marginBottom: verticalScale(4),
                }}>
                {getSpeakerDisplayName(message.speaker_name)}
              </Text>

              {/* 消息内容 - 使用打字机效果 */}
              <TypewriterText
                text={message.content}
                style={getSpeakerStyle(message.speaker_name)}
                isActive={isLastMessage && isTypingActive}
                isHistory={message.isHistory}
                onComplete={handleTypingComplete}
              />
            </View>
          );
        })}

        {/* 当任务状态为进行中且打字机完成时显示等待动画 */}
        {taskStatus === 1 && isTypingComplete && messages.length > 0 && (
          <WaitingForContentAnimation />
        )}
      </ScrollView>
    </View>
  );
};

export default ConversationContent;
