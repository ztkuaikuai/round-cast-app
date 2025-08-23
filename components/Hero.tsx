import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import Svg, { Circle, Path } from 'react-native-svg';
import { useResponsive } from "utils/responsive";

const Hero = () => {
    const { scale, verticalScale } = useResponsive();
    return (
        <View
            className="flex-1 flex justify-center bg-[#FFF7D3]"
            style={{ paddingHorizontal: scale(27), paddingVertical: verticalScale(27), gap: verticalScale(29) }}
        >
            {/* Welcome */}
            <View className="items-center relative">
                <Text
                    className="text-[#403284] text-center z-10 w-full"
                    style={{ fontFamily: "Anton-Regular", fontSize: scale(72)}}
                >
                    Welcome
                </Text>
                <View
                    className="absolute z-0"
                    style={{ width: verticalScale(370), height: verticalScale(362), top: verticalScale(-20), left: 0 }}
                >
                    <Svg width="100%" height="100%" viewBox="0 0 370 362" fill="none">
                        <Path d="M110.92 123.147L89.4404 18.3033L173.229 89.1419L237.791 0.253921L242.712 103.72L353.133 81.7154L274.504 163.949L369.845 226.266L254.321 234.021L276.265 340.16L192.11 272.376L127.548 361.264L122.53 253.448L14.3313 277.58L90.2742 191.924L0.304924 136.452L110.92 123.147Z" fill="#FED25C" />
                    </Svg>
                </View>
                <View
                    className="absolute z-0"
                    style={{ width: verticalScale(44), height: verticalScale(44), top: verticalScale(80), left: scale(327) }}
                >
                    <Svg width="100%" height="100%" viewBox="0 0 44 44" fill="none">
                        <Path d="M13.0796 15.3746L10.5477 3.01616L20.4242 11.3662L28.0344 0.888595L28.6145 13.0846L41.6304 10.4908L32.362 20.1841L43.6003 27.5297L29.983 28.4438L32.5696 40.955L22.6499 32.9649L15.0397 43.4426L14.4481 30.7338L1.69424 33.5783L10.646 23.4817L0.0408818 16.943L13.0796 15.3746Z" fill="#2972F1" />
                    </Svg>
                </View>
                <View
                    className="absolute z-0"
                    style={{ width: verticalScale(139), height: verticalScale(136), top: verticalScale(354), left: scale(40) }}
                >
                    <Svg width="100%" height="100%" viewBox="0 0 139 136" fill="none">
                        <Path d="M41.5514 46.6499L33.5379 7.53584L64.7968 33.9636L88.8829 0.802161L90.7187 39.4023L131.913 31.193L102.579 61.8718L138.148 85.1203L95.05 88.0136L103.237 127.611L71.8409 102.323L47.7548 135.484L45.8827 95.2613L5.51698 104.264L33.849 72.3085L0.28416 51.6137L41.5514 46.6499Z" fill="#00C4FF" />
                    </Svg>
                </View>
                <Image
                    source={require("assets/headphone.png")}
                    className="absolute -rotate-[30deg] -scale-x-100 aspect-[104/97]"
                    style={{ width: scale(252), height: verticalScale(234), top: verticalScale(120), left: scale(-20) }}
                />
                <Image
                    source={require("assets/microphone.png")}
                    className="absolute rotate-[15deg] aspect-[61/57]"
                    style={{ width: scale(375), height: verticalScale(350), top: verticalScale(160), right: scale(-100) }}
                />
                {/* 圆点 */}
                <View
                    className="absolute z-0"
                    style={{ width: verticalScale(21), height: verticalScale(21), top: verticalScale(345), left: "50%" }}
                >
                    <Svg width="100%" height="100%" viewBox="0 0 21 21" fill="none">
                        <Circle cx="10.5" cy="10.5" r="10.5" fill="#FD7416" />
                    </Svg>
                </View>
                <View
                    className="absolute z-0"
                    style={{ width: verticalScale(21), height: verticalScale(21), top: verticalScale(400), right: scale(40) }}
                >
                    <Svg width="100%" height="100%" viewBox="0 0 21 21" fill="none">
                        <Circle cx="10.5" cy="10.5" r="10.5" fill="#FED25C" />
                    </Svg>
                </View>
            </View>

            {/* RoundCast Title */}
            <Text
                className="items-center text-[#1E0F59] text-center"
                style={{ fontFamily: "Anton-Regular", fontSize: scale(68), paddingTop: verticalScale(400), marginBottom: verticalScale(-24) }}
            >
                RoundCast
            </Text>

            {/* Subtitle */}
            <Text
                className="text-[#1E0F59] text-center"
                style={{ fontFamily: 'Montserrat', fontWeight: "700", lineHeight: verticalScale(32), fontSize: scale(24), width: scale(376), height: scale(60) }}
            >
                Every perspective deserves a seat at our round table
            </Text>

            {/* Start to Talk Button */}
            <View className="items-center">
                <TouchableOpacity
                    className="bg-[#D6DD18]"
                    style={{
                        paddingHorizontal: scale(40),
                        paddingBottom: verticalScale(12),
                        borderRadius: verticalScale(60)
                    }}
                    onPress={() => {
                        console.log('Start to Talk pressed');
                    }}
                >
                    <Text className="text-[#1E0F59] text-center" style={{ fontFamily: "Anton-Regular", fontSize: scale(28) }}>
                        Start to <Text style={{ fontSize: scale(32) }}>Talk</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Hero;