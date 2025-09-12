import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Message } from '../api/task';

// MiniMax API音频合成相关常量
const MINIMAX_GROUP_ID = process.env.EXPO_PUBLIC_MINIMAX_GROUP_ID;
const MINIMAX_TTS_URL = `https://api.minimaxi.com/v1/t2a_v2?GroupId=${MINIMAX_GROUP_ID}`;
const MINIMAX_API_KEY = process.env.EXPO_PUBLIC_MINIMAX_API_KEY;

// 队列项类型定义
interface QueueItem {
    voice_id: string;
    message: Message;
}

// 十六进制音频数据转换为Base64 Data URI (React Native 兼容)
const hexToAudioDataUri = (hexData: string): string => {
    console.log("🚀 ~ hexToAudioDataUri ~ hexData length:", hexData.length);
    try {
        if (!hexData || hexData.length === 0) {
            throw new Error('No audio data provided');
        }

        // 验证十六进制字符串的有效性
        if (hexData.length % 2 !== 0) {
            console.warn('音频数据长度不是偶数，将忽略最后一个字符');
        }

        const validHexLength = Math.floor(hexData.length / 2) * 2;
        const validHex = hexData.substring(0, validHexLength);
        
        if (!/^[0-9a-fA-F]*$/.test(validHex)) {
            throw new Error('Invalid hexadecimal audio data');
        }

        // 将十六进制转换为二进制字符串
        let binaryString = '';
        for (let i = 0; i < validHex.length; i += 2) {
            const byte = parseInt(validHex.substring(i, i + 2), 16);
            binaryString += String.fromCharCode(byte);
        }
        
        // 将二进制字符串转换为Base64
        const base64Data = btoa(binaryString);
        
        console.log(`音频数据转换完成: ${validHex.length / 2} 字节, Base64长度: ${base64Data.length}`);
        
        // 返回Data URI格式，expo-audio可以直接使用
        return `data:audio/mp3;base64,${base64Data}`;
    } catch (error) {
        console.error('转换音频数据时出错:', error);
        throw new Error(`Failed to convert audio data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// MiniMax TTS同步API调用函数
const synthesizeAudioFromVoiceId = async (voiceId: string, message: Message): Promise<string> => {
    try {
        if (!MINIMAX_API_KEY) {
            throw new Error('MiniMax API Key not found');
        }

        const requestBody = {
            model: "speech-02-turbo",
            text: message.content, // 使用message的内容作为合成文本
            stream: false, // 使用非流式请求
            language_boost: "auto",
            output_format: "hex",
            voice_setting: {
                voice_id: voiceId,
                speed: 1.1,
                vol: 1.0,
                pitch: 0,
                emotion: "happy"
            },
            audio_setting: {
                sample_rate: 32000,
                bitrate: 128000,
                format: "mp3"
            }
        };

        console.log('开始音频合成请求:', { voiceId, textLength: message.content.length });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000); // 30秒超时

        const response = await fetch(MINIMAX_TTS_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/json',
                'authorization': `Bearer ${MINIMAX_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('MiniMax API error response:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`MiniMax API error: ${response.status} - ${response.statusText}`);
        }

        // 解析JSON响应
        const data = await response.json();
        
        console.log('API响应数据:', {
            hasData: !!data.data,
            hasAudio: !!(data.data && data.data.audio),
            audioLength: data.extra_info?.audio_length,
            audioSize: data.extra_info?.audio_size,
            traceId: data.trace_id
        });

        // 检查响应格式
        if (!data.data || !data.data.audio) {
            throw new Error('Invalid response format: missing audio data');
        }

        // 检查状态
        if (data.base_resp && data.base_resp.status_code !== 0) {
            throw new Error(`API error: ${data.base_resp.status_msg || 'Unknown error'}`);
        }

        console.log(`音频合成完成，音频大小: ${data.extra_info?.audio_size} 字节`);
        
        // 直接使用返回的十六进制音频数据，转换为Data URI
        return hexToAudioDataUri(data.data.audio);

    } catch (error) {
        console.error('Error synthesizing audio:', error);
        
        // 提供更详细的错误信息
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('音频合成请求超时，请检查网络连接');
            } else if (error.message.includes('Failed to fetch')) {
                throw new Error('网络连接失败，请检查网络状态');
            }
        }
        
        throw error;
    }
};

interface AudioPlayerState {
    isPlaying: boolean;
    isLoading: boolean;
    currentMessage: Message | null;
    queue: QueueItem[];
    error: string | null;
}

interface AudioPlayerActions {
    play: () => Promise<void>;
    pause: () => Promise<void>;
    enqueue: (voiceId: string, message: Message) => void;
    enqueueMultiple: (messages: Message[]) => void;
    dequeue: () => QueueItem | undefined;
    clearQueue: () => void;
    getCurrentVoiceId: () => string | null;
}

export interface UseAudioPlayerReturn extends AudioPlayerState, AudioPlayerActions { }

export const useAudioPlayer = (): UseAudioPlayerReturn => {
    const [state, setState] = useState<AudioPlayerState>({
        isPlaying: false,
        isLoading: false,
        currentMessage: null,
        queue: [],
        error: null,
    });

    const currentVoiceIdRef = useRef<string | null>(null);
    const queueRef = useRef<QueueItem[]>([]);
    const player = useExpoAudioPlayer();
    const status = useAudioPlayerStatus(player);

    // 同步队列到 ref
    useEffect(() => {
        queueRef.current = state.queue;
    }, [state.queue]);

    // 播放下一个音频
    const playNext = useCallback(async () => {
        setState(prev => {
            if (prev.queue.length === 0) {
                currentVoiceIdRef.current = null;
                return {
                    ...prev,
                    isPlaying: false,
                    isLoading: false,
                    currentMessage: null
                };
            }

            const nextItem = prev.queue[0];
            currentVoiceIdRef.current = nextItem.voice_id;

            // 立即出队并设置加载状态
            const newState = {
                ...prev,
                isLoading: true,
                error: null,
                currentMessage: nextItem.message,
                queue: prev.queue.slice(1)
            };

            // 异步合成并播放音频
            (async () => {
                try {
                    console.log(`开始合成音频: ${nextItem.voice_id}, 文本: "${nextItem.message.content.substring(0, 50)}..."`);
                    
                    // 使用MiniMax API合成音频
                    const audioUrl = await synthesizeAudioFromVoiceId(nextItem.voice_id, nextItem.message);
                    
                    console.log(`音频合成成功，开始播放: ${nextItem.voice_id}`);
                    
                    player.replace(audioUrl);
                    player.play();

                    setState(current => ({
                        ...current,
                        isPlaying: true,
                        isLoading: false,
                        error: null
                    }));

                } catch (error) {
                    console.error('Error playing audio:', error);
                    
                    let errorMessage = 'Failed to play audio';
                    if (error instanceof Error) {
                        if (error.message.includes('网络')) {
                            errorMessage = '网络连接问题，请检查网络状态';
                        } else if (error.message.includes('超时')) {
                            errorMessage = '请求超时，请稍后重试';
                        } else if (error.message.includes('API')) {
                            errorMessage = 'API服务异常，请稍后重试';
                        } else {
                            errorMessage = error.message;
                        }
                    }
                    
                    setState(current => ({
                        ...current,
                        error: errorMessage,
                        isPlaying: false,
                        isLoading: false
                    }));

                    // 如果播放失败，延迟后尝试播放下一个
                    console.log('播放失败，3秒后尝试播放下一个音频');
                    setTimeout(() => {
                        console.log('开始播放下一个音频...');
                        playNext();
                    }, 3000);
                }
            })();

            return newState;
        });
    }, [player]);

    // 播放函数
    const play = useCallback(async () => {
        try {
            if (currentVoiceIdRef.current && player.isLoaded) {
                // 如果有当前音频，恢复播放
                player.play();
                setState(prev => ({ ...prev, isPlaying: true }));
            } else {
                // 开始播放队列
                await playNext();
            }
        } catch (error) {
            console.error('Error starting playback:', error);
            setState(prev => ({ ...prev, error: 'Failed to start playback' }));
        }
    }, [player, playNext]);

    // 暂停函数
    const pause = useCallback(async () => {
        try {
            player.pause();
            setState(prev => ({ ...prev, isPlaying: false }));
        } catch (error) {
            console.error('Error pausing audio:', error);
            setState(prev => ({ ...prev, error: 'Failed to pause audio' }));
        }
    }, [player]);

    // 入队单个voice_id
    const enqueue = useCallback((voiceId: string, message: Message) => {
        if (voiceId && voiceId.trim()) {
            const queueItem: QueueItem = {
                voice_id: voiceId.trim(),
                message: message
            };
            setState(prev => ({
                ...prev,
                queue: [...prev.queue, queueItem],
                error: null
            }));
        }
    }, []);

    // 批量入队（从Message数组）
    const enqueueMultiple = useCallback((messages: Message[]) => {
        const queueItems = messages
            .filter(message => message.voice_id && message.voice_id.trim())
            .map(message => ({
                voice_id: message.voice_id!.trim(),
                message: message
            }));

        if (queueItems.length > 0) {
            setState(prev => ({
                ...prev,
                queue: [...prev.queue, ...queueItems],
                error: null
            }));
        }
    }, []);

    // 出队
    const dequeue = useCallback((): QueueItem | undefined => {
        let dequeuedItem: QueueItem | undefined;
        setState(prev => {
            if (prev.queue.length > 0) {
                dequeuedItem = prev.queue[0];
                return { ...prev, queue: prev.queue.slice(1) };
            }
            return prev;
        });
        return dequeuedItem;
    }, []);

    // 清空队列
    const clearQueue = useCallback(() => {
        setState(prev => ({ ...prev, queue: [] }));
        pause();
        currentVoiceIdRef.current = null;
    }, [pause]);

    // 获取当前播放的voice_id
    const getCurrentVoiceId = useCallback((): string | null => {
        return currentVoiceIdRef.current;
    }, []);

    // 同步播放状态
    useEffect(() => {
        setState(prev => ({
            ...prev,
            isPlaying: status.playing
        }));
    }, [status.playing]);

    // 监听音频播放完成，自动播放下一个
    useEffect(() => {
        if (status.didJustFinish && queueRef.current.length > 0) {
            console.log('音频播放完成，开始播放下一个');
            // 延迟一小段时间确保状态稳定
            setTimeout(() => {
                playNext();
            }, 100);
        } else if (status.didJustFinish && queueRef.current.length === 0) {
            console.log('播放队列已完成');
            setState(prev => ({
                ...prev,
                isPlaying: false,
                currentMessage: null
            }));
            currentVoiceIdRef.current = null;
        }
    }, [status.didJustFinish, playNext]);

    return {
        // State
        isPlaying: state.isPlaying,
        isLoading: state.isLoading,
        currentMessage: state.currentMessage,
        queue: state.queue,
        error: state.error,

        // Actions
        play,
        pause,
        enqueue,
        enqueueMultiple,
        dequeue,
        clearQueue,
        getCurrentVoiceId,
    };
};
