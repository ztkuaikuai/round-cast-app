import { Container } from "components/Container";
import { View, Text, TouchableOpacity, Platform, Animated } from "react-native";
import Svg, { Circle, Rect, Ellipse } from 'react-native-svg';
import { useResponsive } from "utils/responsive";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect } from 'react';

const Home = () => {
  const { scale, verticalScale } = useResponsive();
  const router = useRouter();
  
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
        duration: 200, // 从300ms减少到200ms
        useNativeDriver: false,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 200, // 从300ms减少到200ms
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
        duration: 150, // 从250ms减少到150ms
        useNativeDriver: false,
      }),
      Animated.timing(backgroundOpacity, {
        toValue: 0,
        duration: 150, // 从250ms减少到150ms
        useNativeDriver: false,
      }),
    ]).start();
    
    console.log('Hold to Speak - Press ended');
  };

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
            onPress={() => {
              router.push('/sidebar');
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

        {/* Central Message */}
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

        {/* Bottom Section with Hold to Speak Button and Microphone */}
        <View className="relative" style={{ paddingBottom: verticalScale(36) }}>
          
          {/* Button Container with White Background */}
          <View 
            style={{
              width: scale(398),
              height: verticalScale(60),
              borderRadius: verticalScale(30),
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: scale(20),
              marginHorizontal: 'auto',
              alignSelf: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* 动画背景层 - 从中心扩散 */}
            <Animated.View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: scale(398), // 明确设置为按钮的完整宽度
                height: verticalScale(60), // 明确设置为按钮的完整高度
                backgroundColor: '#d7dd4c',
                borderRadius: verticalScale(30),
                opacity: backgroundOpacity,
                transform: [
                  {
                    scale: animationScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1.1], // 稍微超出一点确保完全覆盖
                    }),
                  },
                ],
              }}
            />
            {/* Hold to Speak Button - 占据大部分空间 */}
            <TouchableOpacity
              className="flex-1 justify-center items-center"
              style={{
                height: '100%',
                zIndex: 1, // 确保按钮在动画背景之上
              }}
              activeOpacity={1}  // 设置为1可以完全取消透明度效果
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
                    opacity: animationScale, // 与扩散动画同步出现
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
                    outputRange: [1, 0], // 按住时文字淡出
                  }),
                }}
              >
                <Text
                  className="text-[#1E0F59] text-center"
                  style={{
                    fontFamily: "Anton-Regular",
                    fontSize: scale(28),
                    lineHeight: verticalScale(42),
                  }}
                >
                  Hold to Speak
                </Text>
              </Animated.View>
            </TouchableOpacity>

            {/* Microphone Icon - 可点击的独立按钮 */}
            <TouchableOpacity
              className="absolute justify-center items-center"
              style={{
                width: scale(41),
                height: scale(41),
                right: scale(20),
                top: '50%',
                transform: [{ translateY: -scale(20.5) }],
                zIndex: 2, // 确保麦克风图标在最上层
              }}
              onPress={() => {
                console.log('Microphone icon pressed');
                // 这里可以添加麦克风相关逻辑，比如切换录音模式
              }}
            >
              <Svg width="100%" height="100%" viewBox="0 0 41 41" fill="none">
                {/* Outer circle with stroke */}
                <Circle
                  cx="20.5"
                  cy="20.5"
                  r="19.5"
                  fill="none"
                  stroke="#1E0F59"
                  strokeWidth="2"
                />

                {/* Microphone pattern - dots grid */}
                <Rect x="11" y="11" width="5" height="5" rx="2" fill="#1E0F59" />
                <Rect x="18" y="11" width="5" height="5" rx="2" fill="#1E0F59" />
                <Rect x="25" y="11" width="5" height="5" rx="2" fill="#1E0F59" />

                <Rect x="11" y="18" width="5" height="5" rx="2" fill="#1E0F59" />
                <Rect x="25" y="18" width="5" height="5" rx="2" fill="#1E0F59" />
                <Rect x="18" y="18" width="5" height="5" rx="2" fill="#1E0F59" />

                {/* Bottom bar */}
                <Rect x="11" y="27" width="19" height="3" rx="1.5" fill="#1E0F59" />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  )
}

export default Home