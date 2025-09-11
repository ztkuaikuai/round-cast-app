import { View, Text, ScrollView, Platform } from 'react-native';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useResponsive } from 'utils/responsive';
import LoadingAnimation from 'components/LoadingAnimation';
import { Message } from 'api/task';

interface ConversationContentProps {
  messages: Message[];
  updateVisibleMessageIndex: (index: number) => void;
}

const ConversationContent = ({ messages, updateVisibleMessageIndex }: ConversationContentProps) => {
  const { scale, verticalScale } = useResponsive();
  const scrollViewRef = useRef<ScrollView>(null);

  // 打字机效果相关状态
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 使用 useRef 保存最新状态，避免闭包陷阱
  const currentStateRef = useRef({
    currentTypingIndex: 0,
    currentCharIndex: 0,
    isTyping: false,
  });

  // 同步状态到 ref
  currentStateRef.current = {
    currentTypingIndex,
    currentCharIndex,
    isTyping,
  };

  // 清理定时器的函数
  const clearTypingTimer = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  }, []);

  // 开始打字动画的函数
  const startTyping = useCallback(() => {
    const performTyping = () => {
      const { currentTypingIndex: typingIndex } = currentStateRef.current;

      // 检查是否所有消息都已打字完成
      if (typingIndex >= messages.length) {
        setIsTyping(false);
        return;
      }

      const currentMessage = messages[typingIndex];
      if (!currentMessage) return;

      setIsTyping(true);

      const typeNextChar = () => {
        const nextCharIndex = currentStateRef.current.currentCharIndex + 1;
        const fullContent = currentMessage.content;

        if (nextCharIndex <= fullContent.length) {
          // 更新字符索引
          setCurrentCharIndex(nextCharIndex);

          // 更新显示消息
          setDisplayMessages((prevDisplayMessages) => {
            const newDisplayMessages = [...prevDisplayMessages];
            const partialContent = fullContent.slice(0, nextCharIndex);
            const currentTypingIdx = currentStateRef.current.currentTypingIndex;

            // 更新当前正在打字的消息
            if (newDisplayMessages.length <= currentTypingIdx) {
              // 添加新消息
              newDisplayMessages.push({
                ...currentMessage,
                content: partialContent,
              });
            } else {
              // 更新现有消息
              newDisplayMessages[currentTypingIdx] = {
                ...currentMessage,
                content: partialContent,
              };
            }

            return newDisplayMessages;
          });

          if (nextCharIndex < fullContent.length) {
            // 继续打字
            typingTimerRef.current = setTimeout(typeNextChar, 50);
          } else {
            // 当前消息打完，移到下一条消息
            const completedIndex = currentStateRef.current.currentTypingIndex;
            updateVisibleMessageIndex(completedIndex);
            setCurrentTypingIndex((prev) => prev + 1);
            setCurrentCharIndex(0);

            // 延迟一下再开始下一条消息
            typingTimerRef.current = setTimeout(performTyping, 300);
          }
        }
      };

      typeNextChar();
    };

    performTyping();
  }, [messages, updateVisibleMessageIndex]);

  // 智能处理消息更新，避免频闪
  useEffect(() => {
    if (messages.length === 0) {
      // 消息为空时，清理状态
      clearTypingTimer();
      setDisplayMessages([]);
      setCurrentTypingIndex(0);
      setCurrentCharIndex(0);
      setIsTyping(false);
      return;
    }

    // 智能检测是否需要完全重置
    const shouldReset =
      messages.length < currentStateRef.current.currentTypingIndex ||
      (currentStateRef.current.currentTypingIndex === 0 && displayMessages.length === 0);

    if (shouldReset) {
      // 需要完全重置（消息减少或首次加载）
      clearTypingTimer();
      setDisplayMessages([]);
      setCurrentTypingIndex(0);
      setCurrentCharIndex(0);
      setIsTyping(false);

      // 开始打字动画
      setTimeout(() => startTyping(), 100);
    } else if (
      messages.length > currentStateRef.current.currentTypingIndex &&
      !currentStateRef.current.isTyping
    ) {
      // 有新消息且当前没有在打字，继续打字动画
      setTimeout(() => startTyping(), 100);
    }
    // 如果正在打字且只是新增消息，不做任何操作，让当前动画继续
  }, [messages, displayMessages.length, clearTypingTimer, startTyping]);

  // 监听显示消息变化，自动滚动到底部
  useEffect(() => {
    if (displayMessages.length > 0) {
      // 延迟执行确保内容已渲染
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [displayMessages]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      clearTypingTimer();
    };
  }, [clearTypingTimer]);

  const getSpeakerDisplayName = (speaker: Message['speaker_name']) => {
    if (speaker === 'user') {
      return 'You:';
    }
    return `${speaker}:`;
  };

  const getSpeakerStyle = () => {
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
  if (messages.length === 0 || displayMessages.length === 0) {
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
        {displayMessages.map((message) => (
          <View key={message.chunk_id} style={{ marginBottom: verticalScale(20) }}>
            {/* 说话人名称 */}
            <Text
              style={{
                ...getSpeakerStyle(),
                fontFamily: '',
                fontWeight: Platform.OS === 'ios' ? ('700' as const) : ('900' as const),
                marginBottom: verticalScale(4),
              }}>
              {getSpeakerDisplayName(message.speaker_name)}
            </Text>

            {/* 消息内容 */}
            <Text
              style={{
                ...getSpeakerStyle(),
              }}>
              {message.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ConversationContent;
