import { View, Text, ScrollView, Platform } from "react-native";
import { useResponsive } from "utils/responsive";

interface Speaker {
    name: string;
    role: 'host' | 'expert' | 'user';
}

interface Message {
    id: string;
    speaker: Speaker;
    content: string;
}

interface ConversationContentProps {
    messages: Message[];
}

const ConversationContent = ({ messages }: ConversationContentProps) => {
    const { scale, verticalScale } = useResponsive();

    const getSpeakerDisplayName = (speaker: Speaker) => {
        if (speaker.role === 'user') {
            return 'You:';
        }
        return `${speaker.name}:`;
    };

    const getSpeakerStyle = (role: string) => {
        // 基础样式
        const baseStyle = {
            fontFamily: "Montserrat",
            fontWeight: Platform.OS === 'ios' ? '400' : '700',
            fontSize: scale(18),
            lineHeight: verticalScale(26),
            color: '#1E0F59',
        };

        return baseStyle;
    };

    return (
        <View 
            style={{
                flex: 1,
                marginTop: verticalScale(20),
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                    paddingHorizontal: scale(39),
                }}
                contentContainerStyle={{
                    paddingBottom: verticalScale(20),
                }}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((message, index) => (
                    <View key={message.id} style={{ marginBottom: verticalScale(20) }}>
                        {/* 说话人名称 */}
                        <Text
                            style={{
                                ...getSpeakerStyle(message.speaker.role),
                                fontWeight: Platform.OS === 'ios' ? '700' : '900',
                                marginBottom: verticalScale(4),
                            }}
                        >
                            {getSpeakerDisplayName(message.speaker)}
                        </Text>
                        
                        {/* 消息内容 */}
                        <Text
                            style={{
                                ...getSpeakerStyle(message.speaker.role),
                            }}
                        >
                            {message.content}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default ConversationContent;
