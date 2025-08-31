import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { useState } from 'react'
import { Container } from '../../../components/Container'
import TaskHeader from '../../../components/TaskHeader'
import MediaDisplay from '../../../components/MediaDisplay'
import ConversationContent from '../../../components/ConversationContent'
import BottomInputButton from '../../../components/BottomInputButton'
import { getVibeImage } from 'utils/getVibeImage'

// 定义消息类型
interface Message {
    id: string;
    speaker: {
        name: string;
        role: 'host' | 'user' | 'expert';
    };
    content: string;
}

const Task = () => {
    const { taskId } = useLocalSearchParams()
    console.log("🚀 ~ Task ~ taskId:", taskId)
    
    // 初始化消息状态
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            speaker: { name: 'Alex', role: 'host' as const },
            content: 'Welcome to Future Flash! Today: multi-agent systems (MAS)—AI teams solving problems smarter and faster. With us is Dr. Lee, a robotics engineer. And we\'ll hear from listener Sam via'
        },
        {
            id: '2',
            speaker: { name: '', role: 'user' as const },
            content: 'Self-organizing swarms. Think drones that adapt to storms mid-flight or traffic lights that \'talk\' to cars to end jams. But the big hurdle? Making agents explain their choices—like why a medical robot skipped a test.'
        },
        {
            id: '3',
            speaker: { name: 'Dr. Lee', role: 'expert' as const },
            content: 'Nope—they\'ll create them. Agents handle repetitive tasks, so humans focus on creativity. Think: artists using AI swarms to design exhibits, or teachers letting bots grade quizzes while they mentor students.'
        },
        {
            id: '4',
            speaker: { name: 'Alex', role: 'host' as const },
            content: 'Final thought: Where\'s MAS heading in 5 years?'
        },
        {
            id: '5',
            speaker: { name: 'Dr. Lee', role: 'expert' as const },
            content: 'Invisible helpers. They\'ll manage your smart home, negotiate bills, even plan vacations—all in the background. But we\'ll need rules to stop them from manipulating users, like ads disguised as \'helpful tips\'.'
        },
        {
            id: '6',
            speaker: { name: 'Alex', role: 'host' as const },
            content: 'Thanks, Dr. Lee! And Sam—great question! Tune in next week for \'AI in Space.\' Catch you later!'
        }
    ]);

    const handleSendMessage = (message: string) => {
        console.log('New message from user:', message);
        
        // 创建新的用户消息
        const newMessage: Message = {
            id: Date.now().toString(), // 使用时间戳作为简单的ID
            speaker: { name: '', role: 'user' },
            content: message
        };
        
        // 将新消息追加到消息列表中
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    const handlePlayPause = () => {
        console.log('Play/Pause media');
        // TODO: 处理播放/暂停逻辑
    };

    return (
        <Container>
            <View className="flex-1">
                {/* 顶部标题区域 */}
                <TaskHeader title="Multi-agent Systems" />
                
                {/* 展示区域 */}
                <MediaDisplay
                    imageSource={getVibeImage(taskId as string)}
                    onPlayPause={handlePlayPause}
                />
                
                {/* 会话内容区域 */}
                <ConversationContent messages={messages} />
                
                {/* 底部输入按钮 */}
                <BottomInputButton onSendMessage={handleSendMessage} />
            </View>
        </Container>
    )
}

export default Task