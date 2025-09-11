import { View, Text, ScrollView, Platform } from 'react-native';
import { useRef, useEffect } from 'react';
import { useResponsive } from 'utils/responsive';
import LoadingAnimation from 'components/LoadingAnimation';
import type { Message } from 'app/task/[taskId]';

interface ConversationContentProps {
  messages: Message[];
}

const ConversationContent = ({ messages }: ConversationContentProps) => {
  const { scale, verticalScale } = useResponsive();
  const scrollViewRef = useRef<ScrollView>(null);

  // 当消息更新时，自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      // 延迟执行确保内容已渲染
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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
        {messages.map((message) => (
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

            {/* 消息内容 */}
            <Text
              style={{
                ...getSpeakerStyle(message.speaker_name),
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
