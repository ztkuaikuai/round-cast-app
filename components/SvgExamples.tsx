import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Svg, { 
    Circle, 
    Path, 
    G, 
    Rect, 
    Line, 
    Polygon, 
    Polyline, 
    Text as SvgText,
    Defs,
    LinearGradient,
    Stop,
    ClipPath
} from 'react-native-svg';

const SvgExamples = () => {
    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-2xl font-bold mb-6 text-center">React Native SVG 示例</Text>
            
            {/* 基础形状 */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">1. 基础形状</Text>
                <View className="bg-gray-100 p-4 rounded-lg">
                    <Svg width="300" height="100" viewBox="0 0 300 100">
                        {/* 圆形 */}
                        <Circle cx="50" cy="50" r="30" fill="#FF6B6B" />
                        
                        {/* 矩形 */}
                        <Rect x="100" y="20" width="60" height="60" fill="#4ECDC4" rx="10" />
                        
                        {/* 线条 */}
                        <Line x1="180" y1="20" x2="220" y2="80" stroke="#45B7D1" strokeWidth="4" />
                        
                        {/* 多边形 */}
                        <Polygon 
                            points="250,80 230,40 270,40" 
                            fill="#96CEB4" 
                        />
                    </Svg>
                </View>
            </View>

            {/* 路径和复杂形状 */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">2. 路径和复杂形状</Text>
                <View className="bg-gray-100 p-4 rounded-lg">
                    <Svg width="300" height="120" viewBox="0 0 300 120">
                        {/* 心形 */}
                        <Path
                            d="M150,100 C150,100 120,80 120,60 C120,40 130,30 150,30 C170,30 180,40 180,60 C180,80 150,100 150,100 Z"
                            fill="#E74C3C"
                        />
                        
                        {/* 波浪线 */}
                        <Path
                            d="M20,60 Q40,40 60,60 T100,60"
                            stroke="#3498DB"
                            strokeWidth="3"
                            fill="transparent"
                        />
                        
                        {/* 星形（你原来的形状） */}
                        <Path
                            d="M250,60 L255,45 L270,50 L280,35 L285,50 L300,45 L290,60 L305,70 L285,75 L280,90 L270,75 L255,90 L260,75 L245,70 Z"
                            fill="#F39C12"
                            scale="0.5"
                        />
                    </Svg>
                </View>
            </View>

            {/* 渐变效果 */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">3. 渐变效果</Text>
                <View className="bg-gray-100 p-4 rounded-lg">
                    <Svg width="300" height="100" viewBox="0 0 300 100">
                        <Defs>
                            <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#4ECDC4" stopOpacity="1" />
                            </LinearGradient>
                            <LinearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <Stop offset="0%" stopColor="#A8E6CF" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#88D8C0" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        
                        <Rect x="20" y="20" width="120" height="60" fill="url(#grad1)" rx="10" />
                        <Circle cx="220" cy="50" r="30" fill="url(#grad2)" />
                    </Svg>
                </View>
            </View>

            {/* SVG 文本 */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">4. SVG 文本</Text>
                <View className="bg-gray-100 p-4 rounded-lg">
                    <Svg width="300" height="80" viewBox="0 0 300 80">
                        <SvgText
                            x="150"
                            y="40"
                            fontSize="20"
                            fill="#2C3E50"
                            textAnchor="middle"
                            fontWeight="bold"
                        >
                            Hello SVG!
                        </SvgText>
                        
                        <SvgText
                            x="150"
                            y="65"
                            fontSize="14"
                            fill="#7F8C8D"
                            textAnchor="middle"
                        >
                            这是 React Native SVG 文本
                        </SvgText>
                    </Svg>
                </View>
            </View>

            {/* 组合和变换 */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">5. 组合和变换</Text>
                <View className="bg-gray-100 p-4 rounded-lg">
                    <Svg width="300" height="100" viewBox="0 0 300 100">
                        <G transform="translate(50, 50)">
                            <G transform="rotate(45)">
                                <Rect x="-20" y="-20" width="40" height="40" fill="#E67E22" />
                            </G>
                        </G>
                        
                        <G transform="translate(150, 50) scale(1.5)">
                            <Circle cx="0" cy="0" r="15" fill="#9B59B6" />
                            <Circle cx="0" cy="0" r="8" fill="#FFFFFF" />
                        </G>
                        
                        <G transform="translate(250, 50) skewX(20)">
                            <Rect x="-15" y="-15" width="30" height="30" fill="#1ABC9C" />
                        </G>
                    </Svg>
                </View>
            </View>

            {/* 可复用的 SVG 组件 */}
            <View className="mb-6">
                <Text className="text-lg font-semibold mb-2">6. 可复用的 SVG 组件</Text>
                <View className="bg-gray-100 p-4 rounded-lg flex-row justify-around">
                    <StarIcon size={40} color="#F1C40F" />
                    <HeartIcon size={40} color="#E74C3C" />
                    <CheckIcon size={40} color="#27AE60" />
                </View>
            </View>
        </ScrollView>
    );
};

// 可复用的 SVG 图标组件
const StarIcon = ({ size = 24, color = "#000" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={color}
        />
    </Svg>
);

const HeartIcon = ({ size = 24, color = "#000" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.509 2.99872 7.05 2.99872C5.591 2.99872 4.1917 3.5783 3.16 4.61C2.1283 5.6417 1.54872 7.041 1.54872 8.5C1.54872 9.959 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.2225 22.4518 8.5C22.4518 7.7775 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z"
            fill={color}
        />
    </Svg>
);

const CheckIcon = ({ size = 24, color = "#000" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20 6L9 17L4 12"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default SvgExamples;
export { StarIcon, HeartIcon, CheckIcon };
