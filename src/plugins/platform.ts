// src/plugins/platform.ts
import { App } from 'vue';
import { platform } from '@/platforms/factory';
import { store } from '@/store';
import { syncManager } from '@/sync/manager';
import { bridge } from '@/bridge';

export default {
  install(app: App) {
    // 全局提供平台适配器
    app.config.globalProperties.$platform = platform;

    // 全局提供状态管理
    app.config.globalProperties.$store = store;

    // 全局提供同步管理器
    app.config.globalProperties.$sync = syncManager;

    // 全局提供桥接通信
    app.config.globalProperties.$bridge = bridge;

    // 添加平台类到HTML根元素
    const html = document.documentElement;
    html.classList.add(`platform-${platform.getEnv()}`);
  },
};