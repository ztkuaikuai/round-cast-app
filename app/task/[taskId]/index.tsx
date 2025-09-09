import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { useState, useEffect } from 'react'
import { Container } from '../../../components/Container'
import TaskHeader from '../../../components/TaskHeader'
import MediaDisplay from '../../../components/MediaDisplay'
import ConversationContent from '../../../components/ConversationContent'
import BottomInputButton from '../../../components/BottomInputButton'
import { getVibeImage } from 'utils/getVibeImage'
import { messageMock } from 'mock'

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
    const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    speaker: { name: '林知远', role: 'expert' as const },
    content: '大家好，欢迎收听「知远聊科技」，我是主持人林知远。今天我们聊一个大家最近可能都在关注的话题——哪些工作可能会被AI替代？最近有不少新闻让大家既兴奋又担忧，比如某大厂用AI替代了80%的客服人员，还有内容运营的朋友分享说AI帮他们效率提升了3倍，但同时也担心自己的工作会不会被取代。\n\n我们先从客服这个例子聊起。AI客服确实能处理大量重复性问题，节省人力成本，但遇到复杂情况时，还是需要人工介入。那大家觉得，除了客服，还有哪些岗位可能面临类似的情况？比如数据录入、基础翻译，或者一些流水线上的工作？\n\n不过，AI带来的不只是替代。世界经济论坛的报告也提到，未来五年AI可能会淘汰一些岗位，但也会创造新的机会，比如数据分析师、AI训练师这样的角色。这其实提醒我们，技术的进步往往伴随着就业结构的变化。\n\n那我们不妨想一想，面对这样的趋势，个人和企业可以怎么应对？是加强学习新技能，还是调整职业方向？希望今天的讨论能给大家带来一些启发。接下来，我们会听听不同嘉宾的看法，一起展开更深入的探讨。'
  },]);

    // 组件挂载时开始逐个添加 mock 消息
    useEffect(() => {
        let currentIndex = 0;
        
        const addNextMessage = () => {
            if (currentIndex < messageMock.length) {
                const mockMessage = messageMock[currentIndex];
                setMessages(prevMessages => [...prevMessages, mockMessage]);
                currentIndex++;
                
                // 5秒后添加下一条消息
                setTimeout(addNextMessage, 5000);
            }
        };
        
        // 延迟1秒开始添加第一条消息
        setTimeout(addNextMessage, 1000);
    }, []);

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

        // 模拟 Agent 回复（延迟1-2秒）
        setTimeout(() => {
            const agentReplies = [
                "That's a great question! Let me think about that...",
                "Interesting perspective! Here's what I think about multi-agent systems in that context...",
                "You've touched on a key point there. In terms of MAS applications...",
                "Excellent observation! This relates to some cutting-edge research in AI collaboration...",
                "That's exactly the kind of thinking we need in this field. Consider this aspect...",
                "Your question highlights an important challenge in multi-agent coordination...",
                "I appreciate your engagement with this topic. From a technical standpoint...",
                "That's a sophisticated way to look at it. In practice, what we're seeing is..."
            ];

            // 随机选择回复类型（主持人或专家）
            const isHost = Math.random() > 0.5;
            const agentReply: Message = {
                id: (Date.now() + 1).toString(),
                speaker: { 
                    name: isHost ? 'Alex' : 'Dr. Lee', 
                    role: isHost ? 'host' : 'expert' 
                },
                content: agentReplies[Math.floor(Math.random() * agentReplies.length)]
            };

            setMessages(prevMessages => [...prevMessages, agentReply]);
        }, 1000 + Math.random() * 1000); // 1-2秒随机延迟
    };

    const handlePlayPause = () => {
        console.log('Play/Pause media');
        // TODO: 处理播放/暂停逻辑
    };

    return (
        <Container>
            <View className="flex-1">
                {/* 顶部标题区域 */}
                <TaskHeader title="会被 AI 取代的工作有什么" />
                
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