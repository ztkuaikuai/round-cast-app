import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';
import { useEffect, useState, useCallback } from 'react';

export interface AudioRecordingState {
  isRecording: boolean;
  duration: number;
  audioUri?: string;
  audioLevels: number[];
  error?: string;
}

export interface UseAudioRecordingProps {
  onRecordingComplete?: (audioUri: string, duration: number) => void;
  onRecordingError?: (error: string) => void;
  maxDuration?: number; // 最大录音时长（毫秒）
  enableMetering?: boolean; // 是否启用音量检测
}

/**
 * 自定义 Hook：音频录制功能
 */
export function useAudioRecording({
  onRecordingComplete,
  onRecordingError,
  maxDuration = 60000, // 默认 60 秒
  enableMetering = true,
}: UseAudioRecordingProps = {}) {
  
  const [recordingState, setRecordingState] = useState<AudioRecordingState>({
    isRecording: false,
    duration: 0,
    audioLevels: [],
  });

  // 使用 expo-audio 的 hooks
  const recorder = useAudioRecorder(
    RecordingPresets.HIGH_QUALITY,
    (status) => {
      // 录音状态变化回调
      console.log('Recording status:', status);
      
      // 如果 status 有时长信息，更新状态
      // 注意：这里需要根据实际的 RecordingStatus 类型来访问属性
      if ((status as any).durationMillis !== undefined) {
        setRecordingState(prev => ({
          ...prev,
          duration: (status as any).durationMillis || 0,
        }));
      }

      // 更新音量级别（如果支持）
      if (enableMetering && (status as any).metering !== undefined) {
        const normalizedLevel = Math.max(0, Math.min(1, ((status as any).metering + 60) / 60));
        setRecordingState(prev => ({
          ...prev,
          audioLevels: [...prev.audioLevels.slice(-39), normalizedLevel],
        }));
      }

      // 检查是否达到最大时长
      if ((status as any).durationMillis && (status as any).durationMillis >= maxDuration) {
        stopRecording();
      }
    }
  );

  const recorderState = useAudioRecorderState(recorder);

  // 初始化音频会话
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
      } catch (error) {
        console.error('初始化音频会话失败:', error);
        setRecordingState(prev => ({
          ...prev,
          error: '音频初始化失败',
        }));
      }
    };

    initializeAudio();
  }, []);

  // 生成模拟音量波动（当真实音量检测不可用时）
  const generateMockAudioLevels = useCallback(() => {
    const levels = Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.2);
    setRecordingState(prev => ({
      ...prev,
      audioLevels: levels,
    }));
  }, []);

  // 开始录音
  const startRecording = useCallback(async () => {
    try {
      console.log('开始录音...');
      
      // 检查权限
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        const error = '录音权限被拒绝';
        console.error(error);
        onRecordingError?.(error);
        setRecordingState(prev => ({
          ...prev,
          error,
        }));
        return false;
      }

      // 准备并开始录音
      await recorder.prepareToRecordAsync();
      await recorder.record();
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0,
        audioUri: undefined,
        audioLevels: [],
        error: undefined,
      }));

      // 如果不支持真实音量检测，使用模拟数据
      if (!enableMetering) {
        const mockLevelsInterval = setInterval(() => {
          generateMockAudioLevels();
        }, 100);

        // 存储定时器引用以便清理
        (setRecordingState as any)._mockInterval = mockLevelsInterval;
      }

      console.log('录音开始成功');
      return true;
    } catch (error) {
      console.error('开始录音失败:', error);
      const errorMsg = `录音启动失败: ${error}`;
      onRecordingError?.(errorMsg);
      setRecordingState(prev => ({
        ...prev,
        error: errorMsg,
      }));
      return false;
    }
  }, [recorder, enableMetering, generateMockAudioLevels, onRecordingError]);

  // 停止录音
  const stopRecording = useCallback(async () => {
    try {
      console.log('停止录音...');
      
      // 清理模拟音量定时器
      const mockInterval = (setRecordingState as any)._mockInterval;
      if (mockInterval) {
        clearInterval(mockInterval);
        (setRecordingState as any)._mockInterval = null;
      }

      await recorder.stop();
      console.log('录音已停止');

      const finalDuration = recordingState.duration;
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        audioLevels: [],
      }));

      // 从录音器状态中获取真实的音频文件URI
      const recordingUri = recorder.uri;
      if (recordingUri) {
        console.log('录音文件保存路径:', recordingUri);
        onRecordingComplete?.(recordingUri, finalDuration);
        return recordingUri;
      } else {
        // 如果无法获取真实URI，返回错误
        const errorMsg = '无法获取录音文件路径';
        onRecordingError?.(errorMsg);
        setRecordingState(prev => ({
          ...prev,
          error: errorMsg,
        }));
        return null;
      }
    } catch (error) {
      console.error('停止录音失败:', error);
      const errorMsg = `录音保存失败: ${error}`;
      onRecordingError?.(errorMsg);
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        error: errorMsg,
      }));
      return null;
    }
  }, [recorder, recordingState.duration, onRecordingComplete, onRecordingError]);

  // 取消录音
  const cancelRecording = useCallback(async () => {
    try {
      console.log('取消录音...');
      
      // 清理模拟音量定时器
      const mockInterval = (setRecordingState as any)._mockInterval;
      if (mockInterval) {
        clearInterval(mockInterval);
        (setRecordingState as any)._mockInterval = null;
      }

      await recorder.stop();

      setRecordingState({
        isRecording: false,
        duration: 0,
        audioLevels: [],
      });

      console.log('录音已取消');
    } catch (error) {
      console.error('取消录音失败:', error);
    }
  }, [recorder]);

  // 清理资源
  useEffect(() => {
    return () => {
      const mockInterval = (setRecordingState as any)._mockInterval;
      if (mockInterval) {
        clearInterval(mockInterval);
      }
    };
  }, []);

  return {
    recordingState,
    recorderState,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}

/**
 * 格式化录音时长为可读格式
 */
export function formatRecordingDuration(durationMs: number): string {
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${remainingSeconds}s`;
  }
}

/**
 * 检查录音权限
 */
export async function checkRecordingPermission(): Promise<boolean> {
  try {
    const permission = await AudioModule.getRecordingPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('检查录音权限失败:', error);
    return false;
  }
}

/**
 * 请求录音权限
 */
export async function requestRecordingPermission(): Promise<boolean> {
  try {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    return permission.granted;
  } catch (error) {
    console.error('请求录音权限失败:', error);
    return false;
  }
}
