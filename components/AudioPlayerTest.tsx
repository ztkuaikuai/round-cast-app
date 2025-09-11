import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { messageMock } from '../mock';

export function AudioPlayerTest() {
  const {
    isPlaying,
    isLoading,
    queue,
    error,
    play,
    pause,
    enqueue,
    enqueueMultiple,
    clearQueue,
    getCurrentUrl
  } = useAudioPlayer();
    console.log("🚀 ~ AudioPlayerTest ~ isPlaying:", isPlaying)

  const handlePlay = async () => {
    try {
      await play();
    } catch (err) {
      Alert.alert('播放错误', '无法开始播放');
    }
  };

  const handlePause = async () => {
    try {
      await pause();
    } catch (err) {
      Alert.alert('暂停错误', '无法暂停播放');
    }
  };

  const handleAddSample = () => {
    enqueue('https://torappu.prts.wiki/assets/audio/voice/char_002_amiya/cn_002.mp3');
  };

  const handleAddAllMessages = () => {
    enqueueMultiple(messageMock);
    Alert.alert('成功', `已添加 ${messageMock.length} 个音频到队列`);
  };

  const handleClearQueue = () => {
    clearQueue();
    pause();
    Alert.alert('成功', '队列已清空');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>音频播放器测试</Text>
      
      {/* 状态显示 */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          播放状态: {isPlaying ? '🔊 播放中' : '⏸️ 已暂停'}
        </Text>
        <Text style={styles.statusText}>
          加载状态: {isLoading ? '⏳ 加载中' : '✅ 就绪'}
        </Text>
        <Text style={styles.statusText}>
          队列长度: {queue.length}
        </Text>
        <Text style={styles.statusText} numberOfLines={1}>
          当前URL: {getCurrentUrl() || '无'}
        </Text>
        {error && (
          <Text style={styles.errorText}>❌ 错误: {error}</Text>
        )}
      </View>

      {/* 控制按钮 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePlay}
          style={[styles.button, styles.playButton, isPlaying && styles.disabledButton]}
          disabled={isPlaying}
        >
          <Text style={styles.buttonText}>▶️ 播放</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePause}
          style={[styles.button, styles.pauseButton]}
        >
          <Text style={styles.buttonText}>⏸️ 暂停</Text>
        </TouchableOpacity>
      </View>

      {/* 队列管理按钮 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleAddSample}
          style={[styles.button, styles.addButton]}
        >
          <Text style={styles.buttonText}>➕ 添加示例</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAddAllMessages}
          style={[styles.button, styles.addAllButton]}
        >
          <Text style={styles.buttonText}>📝 添加全部消息</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClearQueue}
          style={[styles.button, styles.clearButton]}
        >
          <Text style={styles.buttonText}>🗑️ 清空队列</Text>
        </TouchableOpacity>
      </View>

      {/* 队列列表 */}
      <View style={styles.queueContainer}>
        <Text style={styles.queueTitle}>播放队列:</Text>
        <FlatList
          data={queue}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.queueItem}>
              <Text style={styles.queueIndex}>{index + 1}</Text>
              <Text style={styles.queueUrl} numberOfLines={1}>{item}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>队列为空，请添加音频文件</Text>
          }
          style={styles.queueList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#ff3b30',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#34c759',
  },
  pauseButton: {
    backgroundColor: '#ff3b30',
  },
  addButton: {
    backgroundColor: '#007aff',
  },
  addAllButton: {
    backgroundColor: '#5856d6',
  },
  clearButton: {
    backgroundColor: '#ff9500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  queueContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  queueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  queueList: {
    flex: 1,
  },
  queueItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  queueIndex: {
    width: 30,
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  queueUrl: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  },
});
