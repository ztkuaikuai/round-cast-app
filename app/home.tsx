import { Container } from 'components/Container';
import BottomInputButton from 'components/BottomInputButton';
import ChatMessages from 'components/ChatMessages';
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useResponsive } from 'utils/responsive';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ChatSessionStorage } from 'utils/chatSessionStorage';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  userQuery?: string;
  timestamp?: string;
  imageCard?: {
    title?: string;
  };
}

interface RecommendedQuery {
  id: string;
  content: string;
}

const Home = () => {
  const { scale, verticalScale } = useResponsive();
  const router = useRouter();
  
  // 推荐查询数据
  const recommendedQueries: RecommendedQuery[] = [
    { id: 'democase2', content: '京东，美团，饿了么，在外卖领域的竞争动态' },
    { id: 'democase3', content: '父母是否应该查看子女的手机？' },
    { id: 'democase1', content: '消费主义如何把“自我关怀”包装成刚需？' },
    { id: 'democase4', content: '在线教育能否取代传统课堂教育？' },
    { id: 'democase5', content: '短视频平台侵蚀长视频市场，是否会导致公众深度思考能力的退化？' },
  ];
  
  // 默认mock消息数据
  const defaultMessages: ChatMessage[] = [
    {
      id: '1757740445447',
      type: 'user',
      content: '如何看待浙江工业大学开学典礼校长讲话时被两位同学打伞，正好雨从中间流过流到校长头上，俗称 双一流（狗头）',
      timestamp: '2025-01-13T10:30:00.000Z',
    },
    {
      id: '1757740445448',
      type: 'agent',
      content: '哇，这个观点太棒了！圆桌上的朋友们怎么看？',
      userQuery: '如何看待浙江工业大学开学典礼校长讲话时被两位同学打伞，正好雨从中间流过流到校长头上，俗称 双一流（狗头）',
      timestamp: '2025-01-13T10:30:15.000Z',
      imageCard: {
        title: '来参与不同视角的碰撞',
      },
    },
    {
      id: '1757738774709',
      type: 'user',
      content: '虞书欣家庭背景很硬吗',
      timestamp: '2025-01-13T10:32:00.000Z',
    },
    {
      id: '1757738774710',
      type: 'agent',
      content: '这个话题让我想起了最近的热门讨论，我们展开聊聊？',
      userQuery: '虞书欣家庭背景很硬吗',
      timestamp: '2025-01-13T10:32:10.000Z',
      imageCard: {},
    },
    {
      id: '1757738086064',
      type: 'user',
      content: '自动驾驶汽车什么时候会落地',
      timestamp: '2025-01-13T10:34:00.000Z',
    },
    {
      id: '1757738086065',
      type: 'agent',
      content: '圆桌时间！大家各抒己见吧～',
      userQuery: '自动驾驶汽车什么时候会落地',
      timestamp: '2025-01-13T10:34:08.000Z',
      imageCard: {
        title: '这个观点真有趣，大家怎么看？',
      },
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [showChat, setShowChat] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  // 模拟 Agent 响应的假数据
  const mockAgentResponses = [
    {
      content: '来了哦～',
      imageCard: {
        title: '好久不见，加入我们的对话吧！',
      },
    },
    {
      content: '这是个很好的问题！我们一起讨论一下。',
      imageCard: {},
    },
    {
      content: '让我想想...这个话题确实很有意思，我们来一起分析一下。',
      imageCard: {},
    },
    {
      content: '脑爆环节到！来加入我们！',
      imageCard: {},
    },
    {
      content: '哇，这个观点太棒了！圆桌上的朋友们怎么看？',
      imageCard: {
        title: '来参与不同视角的碰撞',
      },
    },
    {
      content: '说到这里，我想到了一个有趣的案例...',
      imageCard: {},
    },
    {
      content: '等等等等，这里有个细节值得我们仔细聊聊！',
      imageCard: {},
    },
    {
      content: '圆桌时间！大家各抒己见吧～',
      imageCard: {
        title: '这个观点真有趣，大家怎么看？',
      },
    },
    {
      content: '这个话题让我想起了最近的热门讨论，我们展开聊聊？',
      imageCard: {},
    },
    {
      content: '有意思有意思！不如我们从另一个角度来看看这个问题。',
      imageCard: {},
    },
    {
      content: '慢着慢着，让我们深挖一下这个点...',
      imageCard: {},
    },
    {
      content: '欸，这个话题正好是我们上次讨论的延续呢！',
      imageCard: {},
    },
    {
      content: '圆桌围坐，思维碰撞！这就是我们想要的氛围～',
      imageCard: {
        title: '思维的盛宴，观点的交融',
      },
    },
    {
      content: '说得好！让我补充一个不同的视角...',
      imageCard: {},
    },
    {
      content: '这个问题太棒了，正好可以引发一场精彩的圆桌辩论！',
      imageCard: {},
    },
  ];

  // 处理发送消息
  const handleSendMessage = (message: string) => {
    console.log('Message sent from BottomInputButton:', message);

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowChat(true);
    setShouldScrollToBottom(true);

    // 模拟 Agent 延迟响应
    setTimeout(async () => {
      const responseIndex = Math.floor(Math.random() * mockAgentResponses.length);
      const mockResponse = mockAgentResponses[responseIndex];

      const agentMessage: ChatMessage = {
        id: Date.now().toString(), // [INFO] 前端维护一个唯一id，通过时间戳生成
        type: 'agent',
        content: mockResponse.content,
        userQuery: message,
        timestamp: new Date().toISOString(),
        imageCard: mockResponse.imageCard,
      };

      // 保存聊天会话到本地存储
      try {
        await ChatSessionStorage.addSession(agentMessage.id, message);
        console.log('Chat session saved:', { id: agentMessage.id, title: message });
      } catch (error) {
        console.error('Failed to save chat session:', error);
      }

      setMessages((prev) => [...prev, agentMessage]);
      setShouldScrollToBottom(true);
    }, 1000);
  };

  // 处理图片卡片点击
  const handleImageCardPress = (messageId: string) => {
    console.log('Image card pressed for message:', messageId);
    // 这里可以添加跳转到播客播放页面的逻辑
  };

  // 重置滚动状态，避免每次组件更新都触发滚动
  useEffect(() => {
    if (shouldScrollToBottom) {
      const timer = setTimeout(() => {
        setShouldScrollToBottom(false);
      }, 800); // 增加时间让滚动动画完全完成
      return () => clearTimeout(timer);
    }
  }, [shouldScrollToBottom]);

  return (
    <Container>
      {/* Main Content Container */}
      <View className="flex-1 justify-between" style={{ paddingHorizontal: scale(15) }}>
        <View className="relative flex items-center justify-center">
          {/* Menu Icon - positioned in top left of microphone area */}
          <TouchableOpacity
            className="absolute"
            style={{
              left: scale(15),
              top: scale(16),
              width: scale(20),
              height: scale(20),
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => {
              router.push(
                {
                  pathname: '/sidebar',
                  params: {},
                },
                {
                  // 确保使用从左侧滑入的动画
                  relativeToDirectory: false,
                }
              );
            }}>
            <Svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
              <Rect x="0" y="0" width="20" height="4" fill="#1E0F59" />
              <Rect x="0" y="8" width="20" height="4" fill="#1E0F59" />
              <Rect x="0" y="16" width="20" height="4" fill="#1E0F59" />
            </Svg>
          </TouchableOpacity>
          {/* Header with RoundCast Title */}
          <View
            className="items-center justify-center bg-[#FFF7D3]"
            style={{
              marginTop: verticalScale(8),
            }}>
            <Text
              className="text-center text-[#1E0F59]"
              style={{
                fontFamily: 'Anton-Regular',
                fontSize: scale(24),
                lineHeight: verticalScale(36),
              }}>
              RoundCast
            </Text>
          </View>
        </View>

        {/* 根据是否有对话来显示不同内容 */}
        {showChat ? (
          /* 对话界面 */
          <View className="flex-1" style={{ marginTop: verticalScale(20) }}>
            <ChatMessages
              messages={messages}
              onImageCardPress={handleImageCardPress}
              scrollToBottom={shouldScrollToBottom}
            />
          </View>
        ) : (
          /* 初始欢迎界面 */
          <View className="flex-1 items-center justify-center">
            <Text
              className="text-center text-[#1E0F59]"
              style={{
                fontFamily: 'Montserrat',
                fontWeight: Platform.OS === 'ios' ? '400' : '700',
                fontSize: scale(24),
                lineHeight: verticalScale(29),
                width: scale(401),
              }}>
              Feel free to ask me{'\n'}anything you want to know
            </Text>
          </View>
        )}

        {/* Recommended Queries Section */}
        <View style={{ 
          position: 'absolute',
          bottom: verticalScale(86),
          left: 0,
          right: 0,
          zIndex: 10,
        }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: scale(15),
            }}
            style={{ backgroundColor: 'transparent' }}
          >
            {recommendedQueries.map((query, index) => (
              <TouchableOpacity
                key={query.id}
                activeOpacity={0.7}
                style={{
                  backgroundColor: 'rgba(255, 247, 211, 0.9)',
                  borderWidth: 1,
                  borderColor: '#1E0F59',
                  borderRadius: scale(20),
                  paddingHorizontal: scale(16),
                  paddingVertical: verticalScale(10),
                  marginRight: index === recommendedQueries.length - 1 ? 0 : scale(8),
                }}
                onPress={() => handleSendMessage(query.content)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="clip"
                  style={{
                    fontFamily: 'Montserrat',
                    fontSize: scale(14),
                    lineHeight: verticalScale(18),
                    color: '#1E0F59',
                    fontWeight: '700',
                  }}
                >
                  {query.content}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Section with BottomInputButton Component */}
        <BottomInputButton onSendMessage={handleSendMessage} />
      </View>
    </Container>
  );
};

export default Home;
