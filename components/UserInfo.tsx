import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import { useResponsive } from 'utils/responsive'
import Svg, { Path } from 'react-native-svg'
import { useRouter } from 'expo-router'

interface UserInfoProps {
    avatar: string
    name: string
    id: string
    tags: string[]
}

const UserInfo = ({ avatar, name, id, tags }: UserInfoProps) => {
    const { scale, verticalScale } = useResponsive()
    const router = useRouter()

    const handleBackPress = () => {
        router.back()
    }

    return (
        <View style={{ paddingVertical: verticalScale(20), position: 'relative' }}>
            {/* 右上角操作按钮 */}
            <View style={{
                position: 'absolute',
                right: scale(20),
                top: verticalScale(4),
                flexDirection: 'row',
                gap: scale(12)
            }}>
                {/* 返回按钮 */}
                <TouchableOpacity
                    style={{
                        width: scale(44),
                        height: scale(44),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={handleBackPress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Svg width={scale(14)} height={scale(22)} viewBox="0 0 14 22" fill="none">
                        <Path d="M2 2L11 11L2 20" stroke="#403284" strokeWidth="3" />
                    </Svg>
                </TouchableOpacity>
            </View>

            {/* 用户信息居中区域 */}
            <View style={{ alignItems: 'center' }}>
                {/* 头像 */}
                <View
                    style={{
                        width: scale(93),
                        height: scale(93),
                        borderRadius: scale(46.5),
                        borderWidth: 3,
                        borderColor: '#403284',
                        marginBottom: verticalScale(8),
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        source={{ uri: avatar }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                    />
                </View>

                {/* 用户名 */}
                <Text
                    style={{
                        fontFamily: 'Anton-Regular',
                        fontSize: scale(24),
                        color: '#1E0F59',
                        textAlign: 'center',
                        marginBottom: verticalScale(4)
                    }}
                >
                    {name}
                </Text>

                {/* ID */}
                <Text
                    style={{
                        fontFamily: 'Montserrat',
                        fontWeight: Platform.OS === 'ios' ? '400' : '700',
                        fontSize: scale(12),
                        color: '#1E0F59',
                        textAlign: 'center',
                        marginBottom: verticalScale(12)
                    }}
                >
                    ID : {id}
                </Text>

                {/* 标签区域 */}
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingHorizontal: scale(40),
                        gap: scale(8)
                    }}
                >
                    {tags.map((tag, index) => (
                        <TagItem key={index} text={tag} />
                    ))}
                </View>
            </View>
        </View>
    )
}

interface TagItemProps {
    text: string
}

const TagItem = ({ text }: TagItemProps) => {
    const { scale, verticalScale } = useResponsive()

    // 根据标签内容选择不同的背景色
    const getBackgroundColor = (tag: string) => {
        switch (tag.toLowerCase()) {
            case 'tech enthusiast':
                return '#D6DD18'
            case 'cat mom':
                return '#FED25C'
            case 'pm':
                return '#FD7416'
            default:
                return '#00C4FF'
        }
    }

    return (
        <View
            style={{
                backgroundColor: getBackgroundColor(text),
                borderRadius: 12,
                paddingHorizontal: scale(16),
                paddingVertical: verticalScale(8)
            }}
        >
            <Text
                style={{
                    fontFamily: 'Montserrat',
                    fontWeight: Platform.OS === 'ios' ? '400' : '700',
                    fontSize: scale(16),
                    color: '#1E0F59',
                    textAlign: 'center'
                }}
            >
                {text}
            </Text>
        </View>
    )
}

export default UserInfo