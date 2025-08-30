import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
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

  // 根据颜色索引获取对应的图标背景色
  const getIconBackgroundColor = (colorIndex: number) => {
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
      {/* 左侧图标区域 */}
      <View
        style={{
          width: scale(83),
          height: verticalScale(89),
          backgroundColor: getIconBackgroundColor(session.colorIndex),
          borderRadius: 12,
          marginRight: scale(16),
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* 简单的圆点装饰，模拟图标 */}
        <View
          style={{
            width: scale(24),
            height: scale(24),
            backgroundColor: 'rgba(30, 15, 89, 0.3)',
            borderRadius: scale(12)
          }}
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