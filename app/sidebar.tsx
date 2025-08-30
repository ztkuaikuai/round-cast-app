import { Container } from 'components/Container'
import { Link, useRouter } from 'expo-router'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import { useResponsive } from 'utils/responsive'

const Sidebar = () => {
  const router = useRouter();
  const { scale, verticalScale } = useResponsive();

  return (
    <Container>
      <View className="flex-1" style={{ paddingHorizontal: scale(15) }}>
        {/* Header with back button */}
        <View className="flex-row items-center justify-between" style={{ 
          paddingTop: verticalScale(50),
          paddingBottom: verticalScale(20)
        }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: scale(40),
              height: scale(40),
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Svg width={scale(24)} height={scale(24)} viewBox="0 0 24 24" fill="none">
              <Path 
                d="M15 18L9 12L15 6" 
                stroke="#1E0F59" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          
          <Text
            className="text-[#1E0F59] text-center"
            style={{
              fontFamily: "Anton-Regular",
              fontSize: scale(24),
              lineHeight: verticalScale(36),
            }}
          >
            Menu
          </Text>
          
          <View style={{ width: scale(40) }} />
        </View>

        {/* Navigation Links */}
        <View className="flex-1" style={{ paddingTop: verticalScale(40) }}>
          <Link href="/home" asChild>
            <TouchableOpacity 
              className="border-b border-[#E0E0E0]"
              style={{ 
                paddingVertical: verticalScale(20)
              }}
            >
              <Text
                className="text-[#1E0F59]"
                style={{
                  fontFamily: 'Montserrat',
                  fontWeight: Platform.OS === 'ios' ? '500' : '700',
                  fontSize: scale(18),
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/user-info" asChild>
            <TouchableOpacity 
              className="border-b border-[#E0E0E0]"
              style={{ 
                paddingVertical: verticalScale(20)
              }}
            >
              <Text
                className="text-[#1E0F59]"
                style={{
                  fontFamily: 'Montserrat',
                  fontWeight: Platform.OS === 'ios' ? '500' : '700',
                  fontSize: scale(18),
                }}
              >
                User Info
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href="/task/666" asChild>
            <TouchableOpacity 
              className="border-b border-[#E0E0E0]"
              style={{ 
                paddingVertical: verticalScale(20)
              }}
            >
              <Text
                className="text-[#1E0F59]"
                style={{
                  fontFamily: 'Montserrat',
                  fontWeight: Platform.OS === 'ios' ? '500' : '700',
                  fontSize: scale(18),
                }}
              >
                Tasks
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </Container>
  )
}

export default Sidebar