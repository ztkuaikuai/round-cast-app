import {
    BaiduSpeechConfig,
    BaiduTokenResponse,
    BaiduSpeechResponse,
    SpeechRecognitionOptions,
    SpeechRecognitionResult,
    DEFAULT_SPEECH_CONFIG,
    BAIDU_API_ENDPOINTS,
    BAIDU_ERROR_CODES,
} from './speechTypes';
import * as FileSystem from 'expo-file-system';

class BaiduSpeechRecognition {
    private config: BaiduSpeechConfig;
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;

    constructor(config: BaiduSpeechConfig) {
        this.config = {
            ...config,
            baseUrl: config.baseUrl || BAIDU_API_ENDPOINTS.speech,
        };
    }

    /**
     * 获取访问令牌
     */
    private async getAccessToken(): Promise<string> {
        const now = Date.now();

        // 如果 token 还未过期，直接返回
        if (this.accessToken && now < this.tokenExpiresAt) {
            return this.accessToken;
        }

        try {
            const params = new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.config.apiKey,
                client_secret: this.config.secretKey,
            });

            console.log('获取百度 API Token...');
            const response = await fetch(BAIDU_API_ENDPOINTS.token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            });

            const data: BaiduTokenResponse = await response.json();

            if (!data.access_token) {
                throw new Error(`获取 Token 失败: ${JSON.stringify(data)}`);
            }

            this.accessToken = data.access_token;
            // 提前 5 分钟过期，避免边界情况
            this.tokenExpiresAt = now + (data.expires_in - 300) * 1000;

            console.log('百度 API Token 获取成功', this.accessToken);
            return this.accessToken;
        } catch (error) {
            console.error('获取百度 API Token 失败:', error);
            throw new Error(`获取访问令牌失败: ${error}`);
        }
    }

    /**
     * 将音频文件转换为 Base64
     */
    private async audioFileToBase64(audioUri: string): Promise<string> {
        console.log("🚀 ~ BaiduSpeechRecognition ~ audioFileToBase64 ~ audioUri:", audioUri);
        try {
            // 检查文件是否存在
            const fileInfo = await FileSystem.getInfoAsync(audioUri);
            if (!fileInfo.exists) {
                throw new Error(`音频文件不存在: ${audioUri}`);
            }

            console.log('音频文件信息:', {
                uri: audioUri,
                size: fileInfo.size,
                exists: fileInfo.exists
            });

            // 使用 expo-file-system 读取文件并转换为 Base64
            const base64String = await FileSystem.readAsStringAsync(audioUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log('Base64转换成功，长度:', base64String.length);
            return base64String;
        } catch (error) {
            console.error('音频文件转换 Base64 失败:', error);
            throw new Error(`音频文件读取失败: ${error}`);
        }
    }

    /**
     * 获取音频文件大小（字节）
     */
    private async getAudioFileSize(audioUri: string): Promise<number> {
        try {
            const fileInfo = await FileSystem.getInfoAsync(audioUri);
            if (fileInfo.exists && fileInfo.size) {
                console.log('音频文件大小:', fileInfo.size, 'bytes');
                return fileInfo.size;
            }
            return 0;
        } catch (error) {
            console.error('获取音频文件大小失败:', error);
            return 0;
        }
    }

    /**
     * 语音识别主方法
     */
    async recognize(
        audioUri: string,
        options: Partial<SpeechRecognitionOptions> = {}
    ): Promise<SpeechRecognitionResult> {
        try {
            console.log('开始语音识别，音频URI:', audioUri);

            // 获取访问令牌
            const token = await this.getAccessToken();

            // 转换音频为 Base64
            const audioBase64 = await this.audioFileToBase64(audioUri);
            const audioLength = await this.getAudioFileSize(audioUri);

            // 合并配置
            const config = {
                ...DEFAULT_SPEECH_CONFIG,
                ...options,
                token,
            };

            console.log('发送语音识别请求，配置:', {
                ...config,
                audioLength,
            });

            // 构建请求数据
            const requestData = {
                format: config.format,
                rate: config.rate,
                channel: config.channel,
                cuid: config.cuid,
                token: config.token,
                len: audioLength,
                speech: audioBase64,
                lan: config.lan,
                dev_pid: config.dev_pid,
            };

            const response = await fetch(BAIDU_API_ENDPOINTS.speech, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const result: BaiduSpeechResponse = await response.json();

            console.log('语音识别响应:', result);

            // 处理响应
            if (result.err_no === 0 && result.result && result.result.length > 0) {
                return {
                    text: result.result[0],
                    confidence: 1, // 百度 API 不直接提供置信度
                    status: 'completed',
                };
            } else {
                const errorMsg = BAIDU_ERROR_CODES[result.err_no] || `未知错误 (${result.err_no})`;
                console.error('语音识别失败:', errorMsg, result);
                return {
                    error: `${errorMsg}: ${result.err_msg || ''}`.trim(),
                    status: 'error',
                };
            }
        } catch (error) {
            console.error('语音识别异常:', error);
            return {
                error: `语音识别失败: ${error}`,
                status: 'error',
            };
        }
    }

    /**
     * 清理资源
     */
    cleanup() {
        this.accessToken = null;
        this.tokenExpiresAt = 0;
    }
}

// 创建默认实例（需要在使用前配置 API Key）
let speechRecognitionInstance: BaiduSpeechRecognition | null = null;

/**
 * 初始化语音识别服务
 */
export function initializeSpeechRecognition(config: BaiduSpeechConfig) {
    speechRecognitionInstance = new BaiduSpeechRecognition(config);
}

/**
 * 获取语音识别实例
 */
export function getSpeechRecognitionInstance(): BaiduSpeechRecognition {
    if (!speechRecognitionInstance) {
        throw new Error('语音识别服务未初始化，请先调用 initializeSpeechRecognition');
    }
    return speechRecognitionInstance;
}

/**
 * 语音识别便捷方法
 */
export async function recognizeSpeech(
    audioUri: string,
    options?: Partial<SpeechRecognitionOptions>
): Promise<SpeechRecognitionResult> {
    const instance = getSpeechRecognitionInstance();
    return instance.recognize(audioUri, options);
}

export default BaiduSpeechRecognition;
