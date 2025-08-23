import { View, Text, Image, TouchableOpacity, StatusBar, Dimensions } from "react-native";
import Svg, { Circle, Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// 响应式尺寸函数
const getResponsiveSize = (size: number) => (screenWidth / 430) * size; // 基于iPhone X的430px宽度
const getResponsiveHeight = (size: number) => (screenHeight / 932) * size; // 基于iPhone X的932px高度

const Hero = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF7D3" />
            <View className="flex-1 bg-[#FFF7D3]">
                {/* Main Content Container */}
                <View className="flex-1 justify-center px-6 py-8">
                    {/* Welcome */}
                    <View className="items-center pt-8">
                        <Text className="text-[#403284] text-6xl font-bold text-center mb-4">
                            Welcome
                        </Text>
                    </View>

                    {/* Svg 图像 Wrapper */}
                    

                    {/* 底部文字和Btn */}
                    <View className="items-center space-y-6">
                        {/* RoundCast Title */}
                        <Text className="text-[#1E0F59] text-5xl font-bold text-center">
                            RoundCast
                        </Text>

                        {/* Subtitle */}
                        <Text className="text-[#1E0F59] text-xl text-center leading-6 px-4">
                            Every perspective deserves a seat at our round table
                        </Text>

                        {/* Start to Talk Button */}
                        <TouchableOpacity
                            className="bg-[#D6DD18] rounded-3xl px-12 py-4 shadow-lg"
                            onPress={() => {
                                console.log('Start to Talk pressed');
                            }}
                        >
                            <Text className="text-[#1E0F59] text-2xl font-bold text-center">
                                Start to Talk
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>);
};

export default Hero;