import { Link, useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'

const Task = () => {
    const { taskId } = useLocalSearchParams()
    return (
        <View>
            <View>taskId: {taskId}</View>
            <Link href="/home">Go to home screen</Link>
            <Link href="/sidebar">Go to sidebar screen</Link>
            <Link href="/user-info">Go to user info screen</Link>
        </View>
    )
}

export default Task