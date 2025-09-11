import { View, Text, Animated } from 'react-native';
import { useRef, useEffect, useState, useCallback } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useResponsive } from 'utils/responsive';

const LoadingAnimation = () => {
  const { scale, verticalScale } = useResponsive();

  // 音频波形动画状态
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // 文字淡入淡出动画
  const textOpacity = useRef(new Animated.Value(0.3)).current;

  // 星形旋转动画
  const starRotation1 = useRef(new Animated.Value(0)).current;
  const starRotation2 = useRef(new Animated.Value(0)).current;
  const starRotation3 = useRef(new Animated.Value(0)).current;

  // 生成随机音频波形数据
  const generateAudioLevels = () => {
    const levels = Array.from({ length: 25 }, () => Math.random() * 0.8 + 0.2); // 0.2-1.0 范围
    setAudioLevels(levels);
  };

  // 开始音频波形动画
  const startAudioAnimation = useCallback(() => {
    generateAudioLevels();
    animationRef.current = setInterval(() => {
      generateAudioLevels();
    }, 120); // 每120ms更新一次，比录音时稍慢
  }, []);

  // 开始文字呼吸动画
  const startTextAnimation = useCallback(() => {
    const breathe = () => {
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(breathe);
    };
    breathe();
  }, [textOpacity]);

  // 开始星形旋转动画
  const startStarAnimations = useCallback(() => {
    // 星形1 - 缓慢顺时针旋转
    Animated.loop(
      Animated.timing(starRotation1, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // 星形2 - 稍快逆时针旋转
    Animated.loop(
      Animated.timing(starRotation2, {
        toValue: -1,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();

    // 星形3 - 最慢顺时针旋转
    Animated.loop(
      Animated.timing(starRotation3, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, [starRotation1, starRotation2, starRotation3]);

  // 组件挂载时开始所有动画
  useEffect(() => {
    startAudioAnimation();
    startTextAnimation();
    startStarAnimations();

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [startAudioAnimation, startTextAnimation, startStarAnimations]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(39),
        position: 'relative',
      }}>
      {/* 装饰星形元素 */}
      <Animated.View
        style={{
          position: 'absolute',
          width: verticalScale(60),
          height: verticalScale(60),
          top: verticalScale(50),
          right: scale(40),
          transform: [
            {
              rotate: starRotation1.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}>
        <Svg width="100%" height="100%" viewBox="0 0 44 44" fill="none">
          <Path
            d="M13.0796 15.3746L10.5477 3.01616L20.4242 11.3662L28.0344 0.888595L28.6145 13.0846L41.6304 10.4908L32.362 20.1841L43.6003 27.5297L29.983 28.4438L32.5696 40.955L22.6499 32.9649L15.0397 43.4426L14.4481 30.7338L1.69424 33.5783L10.646 23.4817L0.0408818 16.943L13.0796 15.3746Z"
            fill="#2972F1"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          width: verticalScale(40),
          height: verticalScale(40),
          bottom: verticalScale(120),
          left: scale(30),
          transform: [
            {
              rotate: starRotation2.interpolate({
                inputRange: [-1, 0],
                outputRange: ['-360deg', '0deg'],
              }),
            },
          ],
        }}>
        <Svg width="100%" height="100%" viewBox="0 0 21 21" fill="none">
          <Path
            d="M6.54 7.69L5.27 1.51L10.21 5.68L14.02 0.44L14.31 6.54L20.83 5.25L16.18 10.09L21.8 13.76L15 14.22L16.28 20.48L11.32 16.49L7.52 21.72L7.22 15.37L0.85 16.78L5.32 11.72L0.02 8.47L6.54 7.69Z"
            fill="#FD7416"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          width: verticalScale(35),
          height: verticalScale(35),
          top: verticalScale(80),
          left: scale(50),
          transform: [
            {
              rotate: starRotation3.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}>
        <Svg width="100%" height="100%" viewBox="0 0 21 21" fill="none">
          <Path
            d="M6.54 7.69L5.27 1.51L10.21 5.68L14.02 0.44L14.31 6.54L20.83 5.25L16.18 10.09L21.8 13.76L15 14.22L16.28 20.48L11.32 16.49L7.52 21.72L7.22 15.37L0.85 16.78L5.32 11.72L0.02 8.47L6.54 7.69Z"
            fill="#FED25C"
          />
        </Svg>
      </Animated.View>

      {/* 音频波形动画 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: verticalScale(80),
          marginBottom: verticalScale(30),
        }}>
        {audioLevels.map((level: number, index: number) => (
          <View
            key={index}
            style={{
              width: scale(3.5),
              height: verticalScale(60 * level),
              backgroundColor: '#1E0F59',
              marginHorizontal: scale(1.5),
              borderRadius: scale(1.75),
            }}
          />
        ))}
      </View>

      {/* 加载文字 */}
      <Animated.Text
        style={{
          fontFamily: 'Anton-Regular',
          fontSize: scale(22),
          lineHeight: verticalScale(32),
          color: '#1E0F59',
          textAlign: 'center',
          opacity: textOpacity,
        }}>
        正在准备播客内容...
      </Animated.Text>
    </View>
  );
};

export default LoadingAnimation;
