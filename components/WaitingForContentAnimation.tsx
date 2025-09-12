import { View, Text, Animated } from 'react-native';
import { useRef, useEffect, useState, useCallback } from 'react';
import Svg, { Path } from 'react-native-svg';
import { useResponsive } from 'utils/responsive';

const WaitingForContentAnimation = () => {
  const { scale, verticalScale } = useResponsive();

  // 音频波形动画状态
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // 文字淡入淡出动画
  const textOpacity = useRef(new Animated.Value(0.3)).current;

  // 星形旋转动画
  const starRotation1 = useRef(new Animated.Value(0)).current;
  const starRotation2 = useRef(new Animated.Value(0)).current;

  // 生成随机音频波形数据
  const generateAudioLevels = () => {
    const levels = Array.from({ length: 20 }, () => Math.random() * 0.6 + 0.3); // 0.3-0.9 范围，更小的波动
    setAudioLevels(levels);
  };

  // 开始音频波形动画
  const startAudioAnimation = useCallback(() => {
    generateAudioLevels();
    animationRef.current = setInterval(() => {
      generateAudioLevels();
    }, 150); // 稍慢的动画
  }, []);

  // 开始文字呼吸动画
  const startTextAnimation = useCallback(() => {
    const breathe = () => {
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0.4,
          duration: 2000,
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
        duration: 12000,
        useNativeDriver: true,
      })
    ).start();

    // 星形2 - 稍快逆时针旋转
    Animated.loop(
      Animated.timing(starRotation2, {
        toValue: -1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [starRotation1, starRotation2]);

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
        height: verticalScale(120),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: scale(39),
        position: 'relative',
        marginTop: verticalScale(20),
      }}>
      {/* 装饰星形元素 - 相对更小和简约 */}
      <Animated.View
        style={{
          position: 'absolute',
          width: verticalScale(30),
          height: verticalScale(30),
          top: verticalScale(10),
          right: scale(20),
          transform: [
            {
              rotate: starRotation1.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}>
        <Svg width="100%" height="100%" viewBox="0 0 21 21" fill="none">
          <Path
            d="M6.54 7.69L5.27 1.51L10.21 5.68L14.02 0.44L14.31 6.54L20.83 5.25L16.18 10.09L21.8 13.76L15 14.22L16.28 20.48L11.32 16.49L7.52 21.72L7.22 15.37L0.85 16.78L5.32 11.72L0.02 8.47L6.54 7.69Z"
            fill="#D7DD4C"
          />
        </Svg>
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute',
          width: verticalScale(25),
          height: verticalScale(25),
          bottom: verticalScale(10),
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
            fill="#2972F1"
          />
        </Svg>
      </Animated.View>

      {/* 音频波形动画 - 更紧凑 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: verticalScale(50),
          marginBottom: verticalScale(15),
        }}>
        {audioLevels.map((level: number, index: number) => (
          <View
            key={index}
            style={{
              width: scale(2.5),
              height: verticalScale(35 * level),
              backgroundColor: '#1E0F59',
              marginHorizontal: scale(1),
              borderRadius: scale(1.25),
            }}
          />
        ))}
      </View>

      {/* 加载文字 */}
      <Animated.Text
        style={{
          fontFamily: 'Anton-Regular',
          fontSize: scale(16),
          lineHeight: verticalScale(24),
          color: '#1E0F59',
          textAlign: 'center',
          opacity: textOpacity,
        }}>
        等待更多内容...
      </Animated.Text>
    </View>
  );
};

export default WaitingForContentAnimation;
