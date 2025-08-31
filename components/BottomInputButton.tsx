import { View, Text, TouchableOpacity, Animated, TextInput } from "react-native";
import Svg, { Circle, Rect, Path } from 'react-native-svg';
import { useResponsive } from "utils/responsive";
import { useState, useRef, useEffect } from 'react';

interface BottomInputButtonProps {
    onSendMessage?: (message: string) => void;
}

const BottomInputButton = ({ onSendMessage }: BottomInputButtonProps) => {
    const { scale, verticalScale } = useResponsive();

    // 底部按钮模式状态：'voice' | 'text'
    const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
    const [inputText, setInputText] = useState('');

    // 长按状态和音量波动效果
    const [isPressing, setIsPressing] = useState(false);
    const [audioLevels, setAudioLevels] = useState<number[]>([]);
    const animationRef = useRef<NodeJS.Timeout | null>(null);

    // 动画值
    const animationScale = useRef(new Animated.Value(0)).current; // 扩散动画的缩放值
    const backgroundOpacity = useRef(new Animated.Value(0)).current; // 背景透明度

    // 生成随机音量波动数据
    const generateAudioLevels = () => {
        const levels = Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2); // 0.2-1.0 范围
        setAudioLevels(levels);
    };

    // 开始音量波动动画
    const startAudioAnimation = () => {
        generateAudioLevels();
        animationRef.current = setInterval(() => {
            generateAudioLevels();
        }, 150); // 每150ms更新一次
    };

    // 停止音量波动动画
    const stopAudioAnimation = () => {
        if (animationRef.current) {
            clearInterval(animationRef.current);
            animationRef.current = null;
        }
        setAudioLevels([]);
    };

    // 清理定时器
    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, []);

    // 长按开始
    const handlePressIn = () => {
        setIsPressing(true);
        startAudioAnimation();

        // 开始扩散动画 - 更快更顺滑
        Animated.parallel([
            Animated.timing(animationScale, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundOpacity, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }),
        ]).start();

        console.log('Hold to Speak - Press started');
    };

    // 长按结束
    const handlePressOut = () => {
        setIsPressing(false);
        stopAudioAnimation();

        // 收缩动画 - 更快
        Animated.parallel([
            Animated.timing(animationScale, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(backgroundOpacity, {
                toValue: 0,
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();
        onSendMessage?.("当下可能会被AI取代的工作有什么？如何避免不被取代呢？");
        console.log('Hold to Speak - Press ended');
    };

    // 处理发送消息
    const handleSendMessage = () => {
        if (inputText.trim()) {
            console.log('Send message:', inputText);
            onSendMessage?.(inputText.trim());
            setInputText('');
        }
    };

    return (
        <View className="relative" style={{ paddingBottom: verticalScale(18) }}>
            {/* Button Container with White Background */}
            <View
                style={{
                    width: scale(398),
                    minHeight: verticalScale(60),
                    borderRadius: verticalScale(30),
                    backgroundColor: '#ffffff',
                    flexDirection: 'row',
                    alignItems: inputMode === 'text' ? 'flex-end' : 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: scale(20),
                    marginHorizontal: 'auto',
                    alignSelf: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                }}
            >
                {inputMode === 'voice' ? (
                    <>
                        {/* 动画背景层 - 从中心扩散 */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                width: scale(398),
                                height: verticalScale(60),
                                backgroundColor: '#d7dd4c',
                                borderRadius: verticalScale(30),
                                opacity: backgroundOpacity,
                                transform: [
                                    {
                                        scale: animationScale.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1.1],
                                        }),
                                    },
                                ],
                            }}
                        />
                        {/* Hold to Speak Button - 占据大部分空间 */}
                        <TouchableOpacity
                            className="flex-1 items-center"
                            style={{
                                height: '100%',
                                zIndex: 1,
                            }}
                            activeOpacity={1}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                        >
                            {/* 音量波动效果 */}
                            {isPressing && audioLevels.length > 0 && (
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        width: '80%',
                                        opacity: animationScale,
                                    }}
                                >
                                    {audioLevels.map((level, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                width: scale(3),
                                                height: verticalScale(30 * level),
                                                backgroundColor: '#3e337f',
                                                marginHorizontal: scale(1),
                                                borderRadius: scale(1.5),
                                            }}
                                        />
                                    ))}
                                </Animated.View>
                            )}

                            {/* Hold to Speak 文字 - 只在未按住时显示 */}
                            <Animated.View
                                style={{
                                    opacity: animationScale.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 0],
                                    }),
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: verticalScale(60),
                                }}
                            >
                                <Text
                                    className="text-[#1E0F59] text-center"
                                    style={{
                                        fontFamily: "Anton-Regular",
                                        fontSize: scale(28),
                                        lineHeight: verticalScale(42),
                                        textAlignVertical: 'center',
                                    }}
                                >
                                    Hold to Speak
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>

                        {/* 键盘Icon - 点击后切换到键盘输入 */}
                        <TouchableOpacity
                            className="absolute justify-center items-center"
                            style={{
                                width: scale(41),
                                height: scale(41),
                                right: scale(20),
                                top: '50%',
                                transform: [{ translateY: -scale(20.5) }],
                                zIndex: 2,
                            }}
                            onPress={() => {
                                console.log('Switch to text input mode');
                                setInputMode('text');
                            }}
                        >
                            <Svg width="100%" height="100%" viewBox="0 0 41 41" fill="none">
                                <Circle
                                    cx="20.5"
                                    cy="20.5"
                                    r="19.5"
                                    fill="none"
                                    stroke="#1E0F59"
                                    strokeWidth="2"
                                />
                                <Rect x="11" y="11" width="5" height="5" rx="2" fill="#1E0F59" />
                                <Rect x="18" y="11" width="5" height="5" rx="2" fill="#1E0F59" />
                                <Rect x="25" y="11" width="5" height="5" rx="2" fill="#1E0F59" />
                                <Rect x="11" y="18" width="5" height="5" rx="2" fill="#1E0F59" />
                                <Rect x="25" y="18" width="5" height="5" rx="2" fill="#1E0F59" />
                                <Rect x="18" y="18" width="5" height="5" rx="2" fill="#1E0F59" />
                                <Rect x="11" y="27" width="19" height="3" rx="1.5" fill="#1E0F59" />
                            </Svg>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        {/* 文本输入模式 */}
                        {/* 输入框 */}
                        <View className="flex-1 justify-center" style={{ paddingRight: scale(4) }}>
                            <TextInput
                                style={{
                                    fontFamily: 'Montserrat',
                                    fontSize: scale(17),
                                    color: '#1E0F59',
                                    minHeight: verticalScale(44),
                                    maxHeight: verticalScale(180),
                                    paddingLeft: scale(15),
                                    paddingBottom: scale(16),
                                    textAlignVertical: 'center',
                                }}
                                placeholder="What do you want to know?"
                                placeholderTextColor="#656565"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline={true}
                                onSubmitEditing={handleSendMessage}
                                returnKeyType="send"
                                blurOnSubmit={false}
                                scrollEnabled={true}
                            />
                        </View>

                        {/* 上传图标 */}
                        <TouchableOpacity
                            className="justify-center items-center"
                            style={{
                                width: scale(41),
                                height: scale(41),
                                marginRight: scale(8),
                                marginBottom: verticalScale(9),
                            }}
                            onPress={() => {
                                console.log('Switch to voice input mode');
                            }}
                        >
                            <Svg width="100%" height="100%" viewBox="0 0 41 41" fill="none">
                                <Circle cx="20.5" cy="20.5" r="19.5" stroke="#1E0F59" strokeWidth="2" />
                                <Path d="M15.3171 15.1501L20.7073 12M20.7073 12L26.0976 15.1501M20.7073 12V26.4818M12 22.7046V29H20.7073H29V22.7046" stroke="#1E0F59" strokeWidth="2" strokeLinecap="round" />
                            </Svg>
                        </TouchableOpacity>

                        {/* 话筒图标 */}
                        {!inputText && <TouchableOpacity
                            className="justify-center items-center"
                            style={{
                                width: scale(41),
                                height: scale(41),
                                marginBottom: verticalScale(9),
                            }}
                            onPress={() => {
                                console.log('Switch to voice input mode');
                                setInputMode('voice');
                                setInputText('');
                            }}
                        >
                            <Svg width="100%" height="100%" viewBox="0 0 41 41" fill="none">
                                <Circle cx="20.5" cy="20.5" r="19.5" stroke="#1E0F59" strokeWidth="2" />
                                {/* 话筒图标 - 居中对齐 */}
                                <Path
                                    d="M17.5 11C19.4741 11 21.7241 13.091 21.9814 17H22V27H21.9521C21.9824 27.164 22 27.331 22 27.5C22 29.177 20.4233 30.492 18 30.909V34H21C21.5523 34 22 34.448 22 35C22 35.552 21.5523 36 21 36H12C11.4477 36 11 35.552 11 35C11 34.448 11.4477 34 12 34H15V30.909C12.5767 30.492 11 29.177 11 27.5C11 27.331 11.0176 27.164 11.0479 27H11V17H11.0186C11.2759 13.091 13.5259 11 17.5 11Z"
                                    fill="#1E0F59"
                                    transform="translate(1, -8) scale(1.2)"
                                />
                            </Svg>
                        </TouchableOpacity>}

                        {/* 发送图标 */}
                        {inputText && <TouchableOpacity
                            className="justify-center items-center"
                            style={{
                                width: scale(41),
                                height: scale(41),
                                marginBottom: verticalScale(9),
                            }}
                            onPress={handleSendMessage}
                        >
                            <Svg width="100%" height="100%" viewBox="0 0 41 41" fill="none">
                                <Circle cx="20.5" cy="20.5" r="19.5" stroke="#1E0F59" strokeWidth="2" />
                                <Path d="M28 8.5L6.5 23H19.5L27 34L28 8.5Z" fill="#1E0F59" />
                            </Svg>
                        </TouchableOpacity>}
                    </>
                )}
            </View>
        </View>
    );
};

export default BottomInputButton;
