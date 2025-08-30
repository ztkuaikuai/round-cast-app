import { Container } from "components/Container";
import BottomInputButton from "components/BottomInputButton";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Svg, { Rect } from 'react-native-svg';
import { useResponsive } from "utils/responsive";
import { useRouter } from "expo-router";

const Home = () => {
  const { scale, verticalScale } = useResponsive();
  const router = useRouter();
  
  // 处理发送消息
  const handleSendMessage = (message: string) => {
    console.log('Message sent from BottomInputButton:', message);
    // 这里可以添加发送消息的逻辑，比如调用API等
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
              router.push({
                pathname: '/sidebar',
                params: {}
              }, {
                // 确保使用从左侧滑入的动画
                relativeToDirectory: false
              });
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

        {/* Bottom Section with BottomInputButton Component */}
        <BottomInputButton onSendMessage={handleSendMessage} />
      </View>
    </Container>
  )
}

export default Home