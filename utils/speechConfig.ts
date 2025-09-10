import { BaiduSpeechConfig } from './speechTypes';

// 百度语音识别 API 配置
// 注意：在生产环境中，这些密钥应该通过环境变量或安全的配置管理系统来管理
export const BAIDU_SPEECH_CONFIG: BaiduSpeechConfig = {
  // 请在百度智能云控制台获取您的 API Key 和 Secret Key
  // https://console.bce.baidu.com/ai/#/ai/speech/overview/index
  apiKey: process.env.EXPO_PUBLIC_BAIDU_API_KEY || 'YOUR_BAIDU_API_KEY',
  secretKey: process.env.EXPO_PUBLIC_BAIDU_SECRET_KEY || 'YOUR_BAIDU_SECRET_KEY',
};

// 配置验证
export function validateBaiduConfig(): boolean {
  return !!(
    BAIDU_SPEECH_CONFIG.apiKey &&
    BAIDU_SPEECH_CONFIG.apiKey !== 'YOUR_BAIDU_API_KEY' &&
    BAIDU_SPEECH_CONFIG.secretKey &&
    BAIDU_SPEECH_CONFIG.secretKey !== 'YOUR_BAIDU_SECRET_KEY'
  );
}

// 获取配置状态信息
export function getConfigStatus(): string {
  if (!BAIDU_SPEECH_CONFIG.apiKey || BAIDU_SPEECH_CONFIG.apiKey === 'YOUR_BAIDU_API_KEY') {
    return '请配置百度 API Key';
  }
  if (!BAIDU_SPEECH_CONFIG.secretKey || BAIDU_SPEECH_CONFIG.secretKey === 'YOUR_BAIDU_SECRET_KEY') {
    return '请配置百度 Secret Key';
  }
  return '配置已就绪';
}
