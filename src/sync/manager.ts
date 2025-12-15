// src/sync/manager.ts
import { platform } from '@/platforms/factory';

interface SyncTask {
  id: string;
  action: 'create' | 'update' | 'delete';
  entityType: string;
  entityId: string;
  data: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'sync_queue';

export class SyncManager {
  private isOnline = true;
  private isSyncing = false;
  private syncInterval: number | null = null;

  constructor() {
    // 监听网络状态
    if (platform.getEnv() === 'h5') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    } else {
      // 小程序环境
      wx.onNetworkStatusChange((res: any) => {
        this.isOnline = res.isConnected;
        if (this.isOnline) {
          this.sync();
        }
      });
    }

    // 启动定时同步
    this.startAutoSync();
  }

  private async handleOnline() {
    this.isOnline = true;
    await this.sync();
  }

  private handleOffline() {
    this.isOnline = false;
  }

  private startAutoSync() {
    // 每30秒同步一次
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline) {
        this.sync();
      }
    }, 30000);
  }

  public async addToQueue(task: Omit<SyncTask, 'id' | 'timestamp' | 'status' | 'retryCount'>) {
    const tasks = await this.getQueue();
    const newTask: SyncTask = {
      ...task,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    };

    tasks.push(newTask);
    await this.saveQueue(tasks);

    if (this.isOnline) {
      this.sync();
    }
  }

  private async sync() {
    if (this.isSyncing) return;

    this.isSyncing = true;
    const tasks = await this.getQueue();
    const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'failed');

    for (const task of pendingTasks) {
      try {
        task.status = 'syncing';
        await this.saveQueue(tasks);

        // 这里调用实际的API
        // await api[`${task.entityType}`][task.action](task.data);

        task.status = 'completed';
      } catch (error) {
        console.error('Sync failed:', error);
        task.status = 'failed';
        task.retryCount += 1;

        // 如果重试次数过多，可以标记为需要人工干预
        if (task.retryCount > 3) {
          // 发送通知或记录错误
        }
      } finally {
        await this.saveQueue(tasks);
      }
    }

    // 清理已完成的任务（保留最近100条记录）
    const completedTasks = tasks
      .filter(t => t.status === 'completed')
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);

    const failedTasks = tasks.filter(t => t.status === 'failed');
    await this.saveQueue([...completedTasks, ...failedTasks]);

    this.isSyncing = false;
  }

  private async getQueue(): Promise<SyncTask[]> {
    const queue = await platform.getStorage<SyncTask[]>(SYNC_QUEUE_KEY);
    return queue || [];
  }

  private async saveQueue(tasks: SyncTask[]): Promise<void> {
    await platform.setStorage(SYNC_QUEUE_KEY, tasks);
  }
}

// 单例导出
export const syncManager = new SyncManager();