// src/bridge/index.ts
import { platform } from '@/platforms/factory';

interface BridgeMessage {
  type: string;
  payload: any;
  messageId?: string;
}

type MessageHandler = (payload: any) => void | Promise<void>;

export class Bridge {
  private messageHandlers = new Map<string, Set<MessageHandler>>();
  private pendingMessages = new Map<string, (value: any) => void>();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;

    if (platform.getEnv() === 'h5') {
      // H5环境监听来自小程序的消息
      window.addEventListener('message', this.handleMessage);
    } else if (platform.getEnv() === 'weapp') {
      // 小程序环境监听来自web-view的消息
      // 注意：这里需要根据实际的小程序API调整
      // @ts-ignore
      wx.onMessage?.(this.handleMessage);
    }

    this.isInitialized = true;
  }

  private handleMessage = (event: MessageEvent | any) => {
    let message: BridgeMessage;

    if (event.data && typeof event.data === 'object') {
      message = event.data;
    } else if (typeof event === 'object') {
      // 小程序环境
      message = event;
    } else {
      console.warn('Invalid message format:', event);
      return;
    }

    const { type, payload, messageId } = message;

    // 处理响应
    if (messageId && this.pendingMessages.has(messageId)) {
      const resolve = this.pendingMessages.get(messageId)!;
      this.pendingMessages.delete(messageId);
      resolve(payload);
      return;
    }

    // 处理普通消息
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  };

  // 发送消息
  public send<T = any>(type: string, payload?: any, targetOrigin = '*'): Promise<T> {
    const message: BridgeMessage = {
      type,
      payload,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    return new Promise((resolve) => {
      this.pendingMessages.set(message.messageId!, resolve);

      if (platform.getEnv() === 'h5') {
        // H5环境发送消息到小程序
        // @ts-ignore
        if (window.parent && window.parent.postMessage) {
          // @ts-ignore
          window.parent.postMessage(message, targetOrigin);
        }
      } else if (platform.getEnv() === 'weapp') {
        // 小程序环境发送消息到web-view
        // 这里需要根据实际的小程序API调整
        // @ts-ignore
        const webviewContext = wx.createWebViewContext('webview-id'); // 需要替换为实际的web-view id
        webviewContext.postMessage({ data: message });
      }
    });
  }

  // 注册消息处理器
  public on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }

    const handlers = this.messageHandlers.get(type)!;
    handlers.add(handler);

    // 返回取消监听函数
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(type);
      }
    };
  }
}

// 单例导出
export const bridge = new Bridge();