import { Container } from "components/Container";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Svg, { Circle, Rect, Ellipse } from 'react-native-svg';
import { useResponsive } from "utils/responsive";
import { useRouter } from "expo-router";

const Home = () => {
  const { scale, verticalScale } = useResponsive();
  const router = useRouter();

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
        <View className="flex-1 justify-center items-center" style={{ paddingHorizontal: scale(14) }}>
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
              borderRadius: verticalScale(30), // 使用高度的一半作为圆角
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: scale(20),
              marginHorizontal: 'auto',
              alignSelf: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Hold to Speak Button - 占据大部分空间 */}
            <TouchableOpacity
              className="flex-1 justify-center items-center"
              style={{
                height: '100%',
              }}
              onPress={() => {
                console.log('Hold to Speak pressed');
                // 这里可以添加语音识别逻辑
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
            </TouchableOpacity>

            {/* Microphone Icon - 可点击的独立按钮 */}
            <TouchableOpacity
              className="absolute justify-center items-center"
              style={{
                width: scale(41),
                height: scale(41),
                right: scale(20),
                top: '50%',
                transform: [{ translateY: -scale(20.5) }], //
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