import { Link, useLocalSearchParams } from 'expo-router'
import { Text, View } from 'react-native'

const Task = () => {
    const { taskId } = useLocalSearchParams()
    console.log("🚀 ~ Task ~ taskId:", taskId)
    return (
        <View>
            <Text>taskId: {taskId}</Text>
            <Link href="/home">Go to home screen</Link>
            <Link href="/sidebar">Go to sidebar screen</Link>
            <Link href="/user-info">Go to user info screen</Link>
        </View>
    )
}

export default Task