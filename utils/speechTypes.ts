// 百度语音识别 API 配置和类型定义
export interface BaiduSpeechConfig {
  apiKey: string;
  secretKey: string;
  baseUrl?: string;
}

export interface BaiduTokenResponse {
  access_token: string;
  expires_in: number;
  scope?: string;
  session_key?: string;
  session_secret?: string;
  refresh_token?: string;
}

export interface BaiduSpeechResponse {
  err_no: number;
  err_msg: string;
  corpus_no?: string;
  sn?: string;
  result?: string[];
}

export interface SpeechRecognitionOptions {
  format?: 'pcm' | 'wav' | 'opus' | 'speex' | 'amr' | 'x-flac' | 'm4a';
  rate?: number;
  channel?: number;
  cuid?: string;
  token?: string;
  lan?: 'zh' | 'en' | 'ct';
  dev_pid?: number;
}

// 默认配置
export const DEFAULT_SPEECH_CONFIG: Required<Omit<SpeechRecognitionOptions, 'token'>> = {
  format: 'm4a',
  rate: 16000,
  channel: 1,
  cuid: 'round-cast-app',
  lan: 'zh',
  dev_pid: 1537, // 普通话(支持简单的英文识别)
};

// API 端点
export const BAIDU_API_ENDPOINTS = {
  token: 'https://aip.baidubce.com/oauth/2.0/token',
  speech: 'https://vop.baidu.com/server_api',
} as const;

// 错误码映射
export const BAIDU_ERROR_CODES: Record<number, string> = {
  0: '识别成功',
  3300: 'JSON格式错误',
  3301: 'JSONRPC格式错误',
  3302: '请求参数错误',
  3303: '权限验证失败',
  3304: 'AppKey格式错误',
  3305: 'AppSecret格式错误',
  3306: '音频数据格式错误',
  3307: '音频数据过长',
  3308: '音频数据过短',
  3309: '音频数据不符合标准',
  3310: '音频数据编码错误',
  3311: '音频数据采样率错误',
  3312: '音频数据声道数错误',
  500: '服务器错误',
  501: 'API版本不支持',
  502: '未知错误',
};

// 语音识别状态类型
export type SpeechRecognitionStatus = 
  | 'idle'
  | 'recording' 
  | 'processing' 
  | 'completed'
  | 'error';

// 语音识别结果类型
export interface SpeechRecognitionResult {
  text?: string;
  confidence?: number;
  error?: string;
  status: SpeechRecognitionStatus;
}
