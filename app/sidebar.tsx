import { Container } from 'components/Container'
import UserInfo from 'components/UserInfo'
import ChatHistory from 'components/ChatHistory'
import { useRouter } from 'expo-router'
import { View } from 'react-native'

const Sidebar = () => {
  const router = useRouter();

  // 模拟用户数据
  const userData = {
    avatar: 'https://webp.kuaikuaitz.top/avatar_kk2.jpg', // 临时占位图
    name: 'KuaiKuai',
    id: '34567890',
    tags: ['Tech Enthusiast', 'Cat', 'PM']
  }

  // 模拟聊天历史数据
  const chatSessions = [
    {
      id: '1',
      title: '会被AI取代的工作有什么',
      date: '2025-08-31',
      colorIndex: 0
    },
    {
      id: '2', 
      title: 'The Stocks Lately',
      date: '2025-08-19',
      colorIndex: 1
    },
    {
      id: '3',
      title: 'Employment Situation', 
      date: '2025-08-18',
      colorIndex: 2
    },
    {
      id: '4',
      title: 'Hidden Histories',
      date: '2025-08-17',
      colorIndex: 3
    },
    {
      id: '5',
      title: 'Science of Happiness',
      date: '2025-08-17',
      colorIndex: 1
    },
    {
      id: '6',
      title: 'Future Hacks',
      date: '2025-08-16',
      colorIndex: 0
    },
    {
      id: '7',
      title: 'Creativity Unlocked',
      date: '2025-08-15',
      colorIndex: 2
    },
    {
      id: '8',
      title: 'Mindful Tech',
      date: '2025-08-15',
      colorIndex: 0
    }
  ]

  const handleSessionPress = (sessionId: string) => {
    // 处理会话点击
    router.push(`/task/${sessionId}`)
  }

  return (
    <Container>
      <View style={{ flex: 1 }}>
        {/* 用户信息区域 */}
        <UserInfo
          avatar={userData.avatar}
          name={userData.name}
          id={userData.id}
          tags={userData.tags}
        />

        {/* 历史会话区域 */}
        <ChatHistory
          sessions={chatSessions}
          onSessionPress={handleSessionPress}
        />
      </View>
    </Container>
  )
}

export default Sidebar