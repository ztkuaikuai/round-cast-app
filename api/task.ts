import { messageMock } from '../mock';

// 定义消息类型
export interface Message {
  chunk_id: number;
  speaker_name: string;
  content: string;
  url?: string;
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

// 模拟获取任务对话信息的接口
export async function getTaskConversation(params: TaskRequest): Promise<TaskResponse> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { task_id, topic, context } = params;

  // 从mock数据中获取下一条消息
  const nextMessageIndex = context.length;

  // 检查是否还有更多消息
  if (nextMessageIndex >= messageMock.length) {
    // 没有更多消息，返回完成状态
    return {
      task_id,
      status: 0, // 已完成
      context,
    };
  }

  // 获取下一条消息并添加到context中
  const nextMessage = messageMock[nextMessageIndex];
  const newContext = [...context, nextMessage];

  // 判断是否为最后一条消息
  const isLastMessage = nextMessageIndex === messageMock.length - 1;

  return {
    task_id,
    status: isLastMessage ? 0 : 1, // 如果是最后一条消息则状态为完成，否则为进行中
    context: newContext,
  };
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
