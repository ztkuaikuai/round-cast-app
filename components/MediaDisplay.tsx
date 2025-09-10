import { View, TouchableOpacity, ImageBackground } from 'react-native';
import Svg, { Circle, Polygon, Rect } from 'react-native-svg';
import { useResponsive } from 'utils/responsive';
import { useState } from 'react';

interface MediaDisplayProps {
  imageSource?: any; // 图片源，可以是 require() 或 uri
  isPlaying?: boolean;
  onPlayPause?: () => void;
}

const MediaDisplay = ({ imageSource, isPlaying = true, onPlayPause }: MediaDisplayProps) => {
  const { scale, verticalScale } = useResponsive();
  const [localIsPlaying, setLocalIsPlaying] = useState(isPlaying);

  const handlePlayPress = () => {
    const newPlayingState = !localIsPlaying;
    setLocalIsPlaying(newPlayingState);
    onPlayPause?.();
    console.log(newPlayingState ? 'Play' : 'Pause');
  };

  // 如果没有提供图片源，使用默认的占位符背景色
  const defaultImageSource = require('../assets/vibe/1.png'); // 使用默认图片

  return (
    <View
      className="items-center justify-center"
      style={{
        marginTop: verticalScale(8),
      }}>
      {/* 图片容器 */}
      <View
        style={{
          width: scale(237),
          height: verticalScale(254),
          borderRadius: scale(32),
          overflow: 'hidden',
          position: 'relative',
        }}>
        <ImageBackground
          source={imageSource || defaultImageSource}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="cover">
          {/* 播放按钮覆盖层 */}
          <View className="absolute inset-0 items-center justify-center">
            <TouchableOpacity
              onPress={handlePlayPress}
              style={{
                width: scale(60),
                height: scale(60),
              }}
              activeOpacity={0.8}
              hitSlop={170}>
              <Svg width="100%" height="100%" viewBox="0 0 60 60" fill="none">
                {/* 播放按钮背景圆 */}
                <Circle cx="30" cy="30" r="30" fill="#2972F1" />
                {/* 播放/暂停图标 */}
                {localIsPlaying ? (
                  // 暂停图标 (两个矩形)
                  <>
                    <Rect x="22" y="18" width="4" height="24" fill="#FED25C" rx="2" />
                    <Rect x="34" y="18" width="4" height="24" fill="#FED25C" rx="2" />
                  </>
                ) : (
                  // 播放图标 (三角形)
                  <Polygon points="25,18 25,42 43,30" fill="#FED25C" />
                )}
              </Svg>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default MediaDisplay;
