import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioPlayer as useExpoAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Message } from '../api/task';

interface AudioPlayerState {
    isPlaying: boolean;
    isLoading: boolean;
    currentMessage: Message | null;
    queue: string[];
    error: string | null;
}

interface AudioPlayerActions {
    play: () => Promise<void>;
    pause: () => Promise<void>;
    enqueue: (url: string) => void;
    enqueueMultiple: (messages: Message[]) => void;
    dequeue: () => string | undefined;
    clearQueue: () => void;
    getCurrentUrl: () => string | null;
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

    const currentUrlRef = useRef<string | null>(null);
    const queueRef = useRef<string[]>([]);
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
                currentUrlRef.current = null;
                return {
                    ...prev,
                    isPlaying: false,
                    isLoading: false,
                    currentMessage: null
                };
            }

            const nextUrl = prev.queue[0];
            currentUrlRef.current = nextUrl;

            // 立即出队并设置加载状态
            const newState = {
                ...prev,
                isLoading: true,
                error: null,
                queue: prev.queue.slice(1)
            };

            // 异步播放音频
            (async () => {
                try {
                    player.replace(nextUrl);
                    player.play();
                    console.log(`开始播放: ${nextUrl}`);

                    setState(current => ({
                        ...current,
                        isPlaying: true,
                        isLoading: false
                    }));

                } catch (error) {
                    console.error('Error playing audio:', error);
                    setState(current => ({
                        ...current,
                        error: 'Failed to play audio',
                        isPlaying: false,
                        isLoading: false
                    }));

                    // 如果播放失败，尝试播放下一个
                    setTimeout(() => playNext(), 1000);
                }
            })();

            return newState;
        });
    }, [player]);

    // 播放函数
    const play = useCallback(async () => {
        try {
            if (currentUrlRef.current && player.isLoaded) {
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

    // 入队单个URL
    const enqueue = useCallback((url: string) => {
        if (url && url.trim()) {
            setState(prev => ({
                ...prev,
                queue: [...prev.queue, url.trim()],
                error: null
            }));
        }
    }, []);

    // 批量入队（从Message数组）
    const enqueueMultiple = useCallback((messages: Message[]) => {
        const urls = messages
            .filter(message => message.url && message.url.trim())
            .map(message => message.url!.trim());

        if (urls.length > 0) {
            setState(prev => ({
                ...prev,
                queue: [...prev.queue, ...urls],
                error: null
            }));
        }
    }, []);

    // 出队
    const dequeue = useCallback((): string | undefined => {
        let dequeuedUrl: string | undefined;
        setState(prev => {
            if (prev.queue.length > 0) {
                dequeuedUrl = prev.queue[0];
                return { ...prev, queue: prev.queue.slice(1) };
            }
            return prev;
        });
        return dequeuedUrl;
    }, []);

    // 清空队列
    const clearQueue = useCallback(() => {
        setState(prev => ({ ...prev, queue: [] }));
        pause();
        currentUrlRef.current = null;
    }, []);

    // 获取当前播放的URL
    const getCurrentUrl = useCallback((): string | null => {
        return currentUrlRef.current;
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
            currentUrlRef.current = null;
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
        getCurrentUrl,
    };
};
