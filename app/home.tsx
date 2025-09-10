import { Container } from "components/Container";
import BottomInputButton from "components/BottomInputButton";
import ChatMessages from "components/ChatMessages";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Svg, { Rect } from 'react-native-svg';
import { useResponsive } from "utils/responsive";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

interface ChatMessage {
  id: string
  type: 'user' | 'agent'
  content: string
  userQuery?: string
  timestamp?: string
  imageCard?: {
    title?: string
  }
}

const Home = () => {
  const { scale, verticalScale } = useResponsive();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  
  // 模拟 Agent 响应的假数据
  const mockAgentResponses = [
    {
      content: "来了哦～",
      imageCard: {
        title: "好久不见，加入我们的对话吧！"
      }
    },
    {
      content: "这是个很好的问题！我们一起讨论一下。",
      imageCard: {
      }
    },
    {
      content: "让我想想...这个话题确实很有意思，我们来一起分析一下。",
      imageCard: {
      }
    },
    {
      content: "脑爆环节到！来加入我们！",
      imageCard: {
      }
    },
    {
      content: "哇，这个观点太棒了！圆桌上的朋友们怎么看？",
      imageCard: {
        title: "来参与不同视角的碰撞"
      }
    },
    {
      content: "说到这里，我想到了一个有趣的案例...",
      imageCard: {
      }
    },
    {
      content: "等等等等，这里有个细节值得我们仔细聊聊！",
      imageCard: {
      }
    },
    {
      content: "圆桌时间！大家各抒己见吧～",
      imageCard: {
        title: "这个观点真有趣，大家怎么看？"
      }
    },
    {
      content: "这个话题让我想起了最近的热门讨论，我们展开聊聊？",
      imageCard: {
      }
    },
    {
      content: "有意思有意思！不如我们从另一个角度来看看这个问题。",
      imageCard: {
      }
    },
    {
      content: "慢着慢着，让我们深挖一下这个点...",
      imageCard: {
      }
    },
    {
      content: "欸，这个话题正好是我们上次讨论的延续呢！",
      imageCard: {
      }
    },
    {
      content: "圆桌围坐，思维碰撞！这就是我们想要的氛围～",
      imageCard: {
        title: "思维的盛宴，观点的交融"
      }
    },
    {
      content: "说得好！让我补充一个不同的视角...",
      imageCard: {
      }
    },
    {
      content: "这个问题太棒了，正好可以引发一场精彩的圆桌辩论！",
      imageCard: {
      }
    }
  ];
  
  // 处理发送消息
  const handleSendMessage = (message: string) => {
    console.log('Message sent from BottomInputButton:', message);
    
    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowChat(true);
    setShouldScrollToBottom(true);
    
    // 模拟 Agent 延迟响应
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * mockAgentResponses.length);
      const mockResponse = mockAgentResponses[responseIndex];
      
      const agentMessage: ChatMessage = {
        id: Date.now().toString(), // TODO))前端需要维护一个唯一id
        type: 'agent',
        content: mockResponse.content,
        userQuery: message,
        timestamp: new Date().toISOString(),
        imageCard: mockResponse.imageCard,
      };
      
      setMessages(prev => [...prev, agentMessage]);
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
        <View className="relative flex justify-center items-center">
          {/* Menu Icon - positioned in top left of microphone area */}
          <TouchableOpacity
            className="absolute"
            style={{
              left: scale(15),
              top: scale(16),
              width: scale(20),
              height: scale(20)
            }}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => {
              router.push({
                pathname: '/sidebar',
                params: {}
              }, {
                // 确保使用从左侧滑入的动画
                relativeToDirectory: false
              });
            }}
          >
            <Svg width="100%" height="100%" viewBox="0 0 20 20" fill="none">
              <Rect x="0" y="0" width="20" height="4" fill="#1E0F59" />
              <Rect x="0" y="8" width="20" height="4" fill="#1E0F59" />
              <Rect x="0" y="16" width="20" height="4" fill="#1E0F59" />
            </Svg>
          </TouchableOpacity>
          {/* Header with RoundCast Title */}
          <View
            className="bg-[#FFF7D3] items-center justify-center"
            style={{
              marginTop: verticalScale(8)
            }}
          >
            <Text
              className="text-[#1E0F59] text-center"
              style={{
                fontFamily: "Anton-Regular",
                fontSize: scale(24),
                lineHeight: verticalScale(36),
              }}
            >
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
          <View className="flex-1 justify-center items-center">
            <Text
              className="text-[#1E0F59] text-center"
              style={{
                fontFamily: 'Montserrat',
                fontWeight: Platform.OS === 'ios' ? '400' : '700',
                fontSize: scale(24),
                lineHeight: verticalScale(29),
                width: scale(401)
              }}
            >
              Feel free to ask me{'\n'}anything you want to know
            </Text>
          </View>
        )}

        {/* Bottom Section with BottomInputButton Component */}
        <BottomInputButton onSendMessage={handleSendMessage} />
      </View>
    </Container>
  )
}

export default Home