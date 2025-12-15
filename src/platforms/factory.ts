// src/platforms/factory.ts
import { IPlatformAdapter } from './types';
import { H5PlatformAdapter } from './h5/adapter';
import { WeappPlatformAdapter } from './weapp/adapter';

export function createPlatformAdapter(): IPlatformAdapter {
  // 更可靠的小程序环境检测
  const isWeapp =
    typeof wx !== 'undefined' &&
    typeof wx.getSystemInfoSync === 'function' &&
    typeof wx.request === 'function' &&
    typeof wx.uploadFile === 'function';

  if (isWeapp) {
    return new WeappPlatformAdapter();
  }
  return new H5PlatformAdapter();
}

// 导出单例
export const platform = createPlatformAdapter();