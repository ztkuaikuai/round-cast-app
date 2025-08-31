import { View, Text, TouchableOpacity } from "react-native";
import Svg, { Path } from 'react-native-svg';
import { useResponsive } from "utils/responsive";
import { useRouter } from "expo-router";

interface TaskHeaderProps {
    title: string;
}

const TaskHeader = ({ title }: TaskHeaderProps) => {
    const { scale, verticalScale } = useResponsive();
    const router = useRouter();

    const handleBackPress = () => {
        router.back();
    };

    return (
        <View 
            className="flex-row items-center justify-between"
            style={{
                paddingTop: verticalScale(8),
                paddingBottom: verticalScale(12),
                paddingHorizontal: scale(16),
            }}
        >
            {/* 返回按钮 */}
            <TouchableOpacity
                onPress={handleBackPress}
                style={{
                    width: scale(35.67),
                    height: scale(36.09),
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Svg width="100%" height="100%" viewBox="0 0 36 37" fill="none">
                    <Path 
                        d="M22.5 9.125L13.5 18.125L22.5 27.125" 
                        stroke="#403284" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </Svg>
            </TouchableOpacity>

            {/* 标题 */}
            <View className="flex-1 items-center" style={{ marginHorizontal: scale(20) }}>
                <Text
                    className="text-[#1E0F59] text-center"
                    style={{
                        // fontFamily: "Anton-Regular",
                        fontSize: scale(24),
                        lineHeight: verticalScale(36),
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>
            </View>

            {/* 分享/更多操作按钮 */}
            <TouchableOpacity
                onPress={() => {
                    console.log('Share/More actions pressed');
                    // TODO: 实现分享或更多操作功能
                }}
                style={{
                    width: scale(28),
                    height: scale(28),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                hitSlop={10}
            >
                <Svg width="100%" height="100%" viewBox="0 0 31 34" fill="none">
                    <Path 
                        d="M29.383 2.59757L15.4542 19.6266M29.383 2.59757L2.99996 15.8992L15.4542 19.6266M29.383 2.59757L21.577 31.0943L15.4542 19.6266" 
                        stroke="#1E0F59" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                    />
                </Svg>
            </TouchableOpacity>
        </View>
    );
};

export default TaskHeader;
