import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatSession {
  id: string;
  title: string;
  date: string;
  colorIndex: number;
}

const CHAT_SESSIONS_KEY = 'chat_sessions';

// 预定义的颜色索引循环
const COLOR_INDICES = [0, 1, 2, 3];

export class ChatSessionStorage {
  // 获取所有聊天会话
  static async getSessions(): Promise<ChatSession[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(CHAT_SESSIONS_KEY);
      if (!sessionsJson) {
        return [];
      }
      const sessions = JSON.parse(sessionsJson);
      // 按日期倒序排列，最新的在前面
      return sessions.sort(
        (a: ChatSession, b: ChatSession) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  }

  // 添加新的聊天会话
  static async addSession(id: string, userQuery: string): Promise<void> {
    try {
      const existingSessions = await this.getSessions();

      // 检查是否已存在相同ID的会话
      const existingSession = existingSessions.find((session) => session.id === id);
      if (existingSession) {
        console.log('Session already exists:', id);
        return;
      }

      // 计算颜色索引（循环使用）
      const colorIndex = COLOR_INDICES[existingSessions.length % COLOR_INDICES.length];

      const newSession: ChatSession = {
        id,
        title: userQuery,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD 格式
        colorIndex,
      };

      const updatedSessions = [newSession, ...existingSessions];
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error adding chat session:', error);
    }
  }

  // 删除聊天会话
  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const existingSessions = await this.getSessions();
      const updatedSessions = existingSessions.filter((session) => session.id !== sessionId);
      await AsyncStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Error deleting chat session:', error);
    }
  }

  // 清除所有聊天会话
  static async clearAllSessions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_SESSIONS_KEY);
    } catch (error) {
      console.error('Error clearing chat sessions:', error);
    }
  }

  // 获取特定会话
  static async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find((session) => session.id === sessionId) || null;
    } catch (error) {
      console.error('Error getting specific session:', error);
      return null;
    }
  }
}
