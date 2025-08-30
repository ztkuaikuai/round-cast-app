import { View, Text, ScrollView, TouchableOpacity, Platform, Image, Animated } from 'react-native'
import { useResponsive } from 'utils/responsive'
import { useRouter } from 'expo-router'
import { useRef, useEffect } from 'react'
import Svg, { Circle, Polygon } from 'react-native-svg'

interface ChatMessage {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp?: string
  imageCard?: {
    imageUrl: any
    title?: string
  }
}

interface ChatMessagesProps {
  messages: ChatMessage[]
  onImageCardPress?: (messageId: string) => void
  scrollToBottom?: boolean
}

const ChatMessages = ({ messages, onImageCardPress, scrollToBottom }: ChatMessagesProps) => {
  const { scale, verticalScale } = useResponsive()
  const scrollViewRef = useRef<ScrollView>(null)

  // 当消息更新或需要滚动到底部时，自动滚动到底部
  useEffect(() => {
    if (scrollToBottom && scrollViewRef.current && messages.length > 0) {
      // 使用两段式滚动实现更顺滑的效果
      // 第一次快速滚动到接近底部
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false })
      }, 50)
      
      // 第二次平滑滚动到完全底部，确保完整显示
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }, 150)
    }
  }, [messages.length, scrollToBottom])

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ 
        paddingHorizontal: scale(18), 
        paddingVertical: verticalScale(20) 
      }}
      showsVerticalScrollIndicator={false}
      // 优化滚动性能和体验的属性
      decelerationRate="normal"
      scrollEventThrottle={16}
      bounces={true}
      bouncesZoom={false}
      alwaysBounceVertical={false}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10
      }}
      // 确保内容能够完整显示
      contentInsetAdjustmentBehavior="automatic"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onImageCardPress={onImageCardPress}
        />
      ))}
    </ScrollView>
  )
}

interface MessageBubbleProps {
  message: ChatMessage
  onImageCardPress?: (messageId: string) => void
}

const MessageBubble = ({ message, onImageCardPress }: MessageBubbleProps) => {
  const { scale, verticalScale } = useResponsive()
  const router = useRouter()
  const isUser = message.type === 'user'
  
  // 添加消息进入动画
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    // 消息出现时的动画效果
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, slideAnim])

  const getUserBubbleColor = () => '#D6DD18' // 绿黄色
  const getAgentBubbleColor = (index: number) => {
    const colors = ['#FED25C', '#FD7416', '#01C4FF'] // 黄色、橙色、蓝色
    return colors[index % colors.length]
  }

  // 处理图片点击，跳转到任务页面
  const handleImagePress = () => {
    router.push({
      pathname: '/task/[taskId]',
      params: { taskId: message.id }
    })
  }

  return (
    <Animated.View 
      style={{ 
        marginBottom: verticalScale(16),
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: isUser ? 'flex-end' : 'flex-start',
          alignItems: 'flex-start'
        }}
      >
        {/* 消息气泡 */}
        <View
          style={{
            backgroundColor: isUser ? getUserBubbleColor() : getAgentBubbleColor(0),
            borderRadius: scale(20),
            paddingHorizontal: scale(16),
            paddingVertical: verticalScale(12),
            maxWidth: scale(273),
          }}
        >
          {/* 文字内容 */}
          <Text
            style={{
              fontFamily: 'Montserrat',
              fontWeight: Platform.OS === 'ios' ? '400' : '700',
              fontSize: scale(17),
              color: '#1E0F59',
              lineHeight: scale(21),
              textAlign: isUser ? 'right' : 'left',
              marginBottom: !isUser && message.imageCard ? verticalScale(12) : 0
            }}
          >
            {message.content}
          </Text>

          {/* Agent 的图片卡片（放在同一个气泡内） */}
          {!isUser && message.imageCard && (
            <View>
              {/* 图片容器 - 可点击区域 */}
              <TouchableOpacity
                onPress={handleImagePress}
                activeOpacity={0.8}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: scale(32),
                  width: scale(237),
                  height: verticalScale(254),
                  marginBottom: message.imageCard.title ? verticalScale(12) : 0,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}
              >
                <Image
                  source={message.imageCard.imageUrl}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                  resizeMode="cover"
                />
                
                {/* 播放按钮覆盖层 */}
                <View
                  style={{
                    position: 'absolute',
                    width: scale(60),
                    height: scale(60),
                    borderRadius: scale(30),
                    backgroundColor: '#2972F1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4
                  }}
                >
                  <Svg width={scale(40)} height={scale(40)} viewBox="0 0 40 40" fill="none">
                    <Polygon
                      points="12,10 32,20 12,30"
                      fill="#FED25C"
                    />
                  </Svg>
                </View>
              </TouchableOpacity>

              {/* 标题文本 */}
              {message.imageCard.title && (
                <Text
                  style={{
                    fontFamily: 'Montserrat',
                    fontWeight: Platform.OS === 'ios' ? '400' : '700',
                    fontSize: scale(17),
                    color: '#1E0F59',
                    lineHeight: scale(21),
                    textAlign: 'left'
                  }}
                >
                  {message.imageCard.title}
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

export default ChatMessages
