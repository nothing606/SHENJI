<template>
  <view class="data-sync-example">
    <view class="status-bar">
      <view class="status" :class="{ online: isOnline }">
        {{ isOnline ? '在线' : '离线' }}
      </view>
    </view>

    <view class="card">
      <view class="card-title">文件上传</view>
      <button class="btn" @click="handleUpload">选择并上传文件</button>
      <view v-if="uploadProgress > 0" class="progress-container">
        <progress :percent="uploadProgress" show-info stroke-width="3" />
      </view>
    </view>

    <view class="card">
      <view class="card-title">数据同步</view>
      <button class="btn" :disabled="!isOnline" @click="syncData">
        {{ isSyncing ? '同步中...' : '立即同步' }}
      </button>
      <view v-if="lastSyncTime" class="sync-time">
        最后同步: {{ formatTime(lastSyncTime) }}
      </view>
    </view>

    <view class="card">
      <view class="card-title">跨端消息</view>
      <input
        v-model="message"
        class="message-input"
        placeholder="输入要发送的消息"
      />
      <button class="btn" @click="sendMessage">发送到另一端</button>
      <view class="message-log">
        <view v-for="(msg, index) in messageLog" :key="index" class="message-item">
          {{ msg }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { bridge } from '@/bridge';
import { store } from '@/store';
import { platform } from '@/platforms/factory';

export default defineComponent({
  name: 'DataSyncExample',

  setup() {
    const isOnline = ref(navigator.onLine);
    const uploadProgress = ref(0);
    const isSyncing = ref(false);
    const lastSyncTime = ref<number | null>(null);
    const message = ref('');
    const messageLog = ref<string[]>([]);

    // 更新网络状态
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
      addMessage(`网络状态: ${isOnline.value ? '在线' : '离线'}`);
    };

    // 添加消息到日志
    const addMessage = (msg: string) => {
      messageLog.value.unshift(`[${new Date().toLocaleTimeString()}] ${msg}`);
      // 限制日志条数
      if (messageLog.value.length > 50) {
        messageLog.value.pop();
      }
    };

    // 格式化时间
    const formatTime = (timestamp: number) => {
      return new Date(timestamp).toLocaleString();
    };

    // 上传文件
    const handleUpload = async () => {
      try {
        addMessage('开始选择文件...');
        const files = await platform.chooseFile({
          type: 'all',
          count: 1,
        });

        if (files.length > 0) {
          addMessage(`已选择文件: ${files[0].name}`);

          uploadProgress.value = 0;
          const onProgress = (progress: number) => {
            uploadProgress.value = progress;
          };

          const result = await platform.uploadFile({
            url: '/api/upload',
            filePath: files[0].path,
            name: 'file',
            onProgress,
          });

          addMessage(`文件上传成功: ${result.url}`);
          uploadProgress.value = 100;

          // 更新本地存储
          await store.updateFileList([...store.getState().fileList, result]);
        }
      } catch (error) {
        addMessage(`上传失败: ${error.message}`);
        console.error('Upload failed:', error);
        platform.showToast({
          title: '上传失败',
          icon: 'none',
        });
      } finally {
        setTimeout(() => {
          uploadProgress.value = 0;
        }, 2000);
      }
    };

    // 同步数据
    const syncData = async () => {
      if (isSyncing.value) return;

      try {
        isSyncing.value = true;
        addMessage('开始同步数据...');

        // 发送同步请求
        const response = await bridge.send('syncRequest', {
          lastSyncTime: lastSyncTime.value,
          userId: store.getState().user?.id,
        });

        // 处理同步结果
        if (response.success) {
          lastSyncTime.value = Date.now();
          addMessage(`同步成功: ${response.data.updatedCount} 条数据已更新`);
          platform.showToast({
            title: '同步成功',
            icon: 'success',
          });
        } else {
          throw new Error(response.message || '同步失败');
        }
      } catch (error) {
        addMessage(`同步失败: ${error.message}`);
        console.error('Sync failed:', error);
        platform.showToast({
          title: '同步失败',
          icon: 'none',
        });
      } finally {
        isSyncing.value = false;
      }
    };

    // 发送消息到另一端
    const sendMessage = async () => {
      if (!message.value.trim()) {
        platform.showToast({
          title: '消息不能为空',
          icon: 'none',
        });
        return;
      }

      try {
        addMessage(`发送: ${message.value}`);
        const response = await bridge.send('message', {
          text: message.value,
          timestamp: Date.now(),
          from: 'H5',
        });

        addMessage(`收到回复: ${response.reply}`);
        message.value = '';
      } catch (error) {
        addMessage(`发送失败: ${error.message}`);
        console.error('Send message failed:', error);
      }
    };

    // 初始化
    onMounted(() => {
      // 监听网络状态变化
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);

      // 监听来自其他端的消息
      const unlisten = bridge.on('message', (payload) => {
        const msg = `收到消息[${payload.from}]: ${payload.text}`;
        addMessage(msg);

        // 自动回复
        if (payload.needReply) {
          bridge.send('message', {
            text: `已收到您的消息: ${payload.text}`,
            timestamp: Date.now(),
            from: platform.getEnv() === 'h5' ? 'H5' : '小程序',
            replyTo: payload.messageId,
          });
        }
      });

      // 加载最后同步时间
      if (store.getState().lastSyncTime) {
        lastSyncTime.value = store.getState().lastSyncTime;
      }

      // 返回清理函数
      return () => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
        unlisten();
      };
    });

    return {
      isOnline,
      uploadProgress,
      isSyncing,
      lastSyncTime,
      message,
      messageLog,
      handleUpload,
      syncData,
      sendMessage,
      formatTime,
    };
  },
});
</script>

<style scoped>
.data-sync-example {
  padding: 20rpx;
  max-width: 800px;
  margin: 0 auto;
}

.status-bar {
  margin-bottom: 30rpx;
  text-align: right;
}

.status {
  display: inline-block;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  background-color: #f0f0f0;
}

.status.online {
  background-color: #e1f5e1;
  color: #2e7d32;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.btn {
  margin: 20rpx 0;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
}

.btn:disabled {
  background-color: #cccccc;
  opacity: 0.7;
}

.progress-container {
  margin-top: 20rpx;
}

.sync-time {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  margin-top: 10rpx;
}

.message-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #ddd;
  border-radius: 8rpx;
  padding: 0 20rpx;
  margin: 20rpx 0;
  font-size: 28rpx;
}

.message-log {
  margin-top: 20rpx;
  max-height: 300rpx;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8rpx;
  padding: 10rpx;
  background-color: #f9f9f9;
}

.message-item {
  padding: 10rpx;
  font-size: 24rpx;
  border-bottom: 1px solid #eee;
  word-break: break-all;
}

.message-item:last-child {
  border-bottom: none;
}
</style>