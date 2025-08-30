import { View, Text, ScrollView, TouchableOpacity, Platform, Image } from 'react-native'
import { useResponsive } from 'utils/responsive'

interface ChatSession {
  id: string
  title: string
  date: string
  colorIndex: number
}

interface ChatHistoryProps {
  sessions: ChatSession[]
  onSessionPress?: (sessionId: string) => void
}

const ChatHistory = ({ sessions, onSessionPress }: ChatHistoryProps) => {
  const { scale, verticalScale } = useResponsive()

  return (
    <View style={{ flex: 1, paddingHorizontal: scale(20) }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(20) }}
      >
        {sessions.map((session) => (
          <ChatSessionItem
            key={session.id}
            session={session}
            onPress={() => onSessionPress?.(session.id)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

interface ChatSessionItemProps {
  session: ChatSession
  onPress?: () => void
}

const ChatSessionItem = ({ session, onPress }: ChatSessionItemProps) => {
  const { scale, verticalScale } = useResponsive()

  // 根据 session id 获取对应的 vibe 图片
  const getVibeImage = (id: string) => {
    const imageIndex = (parseInt(id) % 9) + 1 // 1-9 对应 1.png - 9.png
    
    // 创建图片资源映射数组
    const vibeImages = [
      require('assets/vibe/1.png'),
      require('assets/vibe/2.png'),
      require('assets/vibe/3.png'),
      require('assets/vibe/4.png'),
      require('assets/vibe/5.png'),
      require('assets/vibe/6.png'),
      require('assets/vibe/7.png'),
      require('assets/vibe/8.png'),
      require('assets/vibe/9.png'),
    ]
    
    return vibeImages[imageIndex - 1] || vibeImages[0] // 默认返回第一张图片
  }

  // 根据颜色索引获取背景色
  const getBackgroundColor = (colorIndex: number) => {
    const colors = [
      '#FED25C',  // 黄色
      '#FD7416',  // 橙色
      '#00C4FF',  // 蓝色
      '#D6DD18',  // 绿黄色
    ]
    return colors[colorIndex % colors.length]
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: getBackgroundColor(session.colorIndex),
        borderRadius: 12,
        marginBottom: verticalScale(12),
        minHeight: verticalScale(112),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(10)
      }}
    >
      {/* 左侧图片区域 */}
      <View
        style={{
          width: scale(83),
          height: verticalScale(89),
          borderRadius: 12,
          marginRight: scale(16),
          overflow: 'hidden'
        }}
      >
        <Image
          source={getVibeImage(session.id)}
          style={{
            width: '100%',
            height: '100%'
          }}
          resizeMode="cover"
        />
      </View>

      {/* 右侧内容区域 */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: 'Montserrat',
            fontWeight: Platform.OS === 'ios' ? '400' : '700',
            fontSize: scale(22),
            color: '#1E0F59',
            marginBottom: verticalScale(4),
            lineHeight: scale(27)
          }}
          numberOfLines={2}
        >
          {session.title}
        </Text>
        <Text
          style={{
            fontFamily: 'Montserrat',
            fontWeight: Platform.OS === 'ios' ? '400' : '700',
            fontSize: scale(16),
            color: '#1E0F59',
            lineHeight: scale(20)
          }}
        >
          {session.date}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ChatHistory