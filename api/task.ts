import { messageMock } from '../mock';

// 定义消息类型
export interface Message {
  chunk_id: number;
  speaker_name: string;
  content: string;
  voice_id?: string;
}

// 任务请求参数
export interface TaskRequest {
  task_id: string;
  topic: string;
  context: Message[];
}

// 任务响应
export interface TaskResponse {
  task_id: string;
  status: 1 | 0; // 1-进行中, 0-已完成
  context: Message[];
}

// 获取任务对话信息
export async function getTaskConversation(params: TaskRequest, signal?: AbortSignal): Promise<TaskResponse> {
  try {
    // console.log("🚀 ~ 获取任务对话信息 getTaskConversation ~ params:", params)
    const response = await fetch('http://10.143.161.42:8111/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive',
      },
      body: JSON.stringify(params),
      signal, // 添加 AbortSignal 支持
    });
    // console.log("🚀 ~ 获取任务对话信息 getTaskConversation ~ response:", response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TaskResponse = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching task conversation:', error);
    // 发生错误时返回错误状态
    throw new Error(`Failed to fetch task conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 获取任务历史信息的接口
export async function getHistoryConversation(taskId: TaskRequest['task_id']): Promise<TaskResponse> {
  try {
    console.log("🚀 ~ 获取任务历史信息 getHistoryConversation ~ taskId:", taskId);
    const response = await fetch('http://10.143.161.42:8111/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Connection': 'keep-alive',
      },
      body: JSON.stringify({
        task_id: taskId,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TaskResponse = await response.json();
    console.log("🚀 ~ 获取任务历史信息 getHistoryConversation ~ data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching history conversation:', error);
    // 发生错误时抛出异常
    throw new Error(`Failed to fetch history conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 模拟发送用户消息的接口
export async function sendUserMessage(
  task_id: string,
  message: string,
  context: Message[]
): Promise<TaskResponse> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 创建用户消息
  const userMessage: Message = {
    chunk_id: context.length + 1,
    speaker_name: 'user',
    content: message,
    // 用户消息没有url
  };

  // 将用户消息添加到context中
  const newContext = [...context, userMessage];

  return {
    task_id,
    status: 1, // 进行中
    context: newContext,
  };
}
