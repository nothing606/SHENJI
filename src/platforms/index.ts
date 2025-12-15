// src/platforms/index.ts
import { PlatformAdapter } from '@/utils/platform';
import { H5PlatformAdapter } from './h5/adapter';

/**
 * 创建平台适配器实例
 */
function createPlatformAdapter(): PlatformAdapter {
  // #ifdef H5
  return new H5PlatformAdapter();
  // #endif

  // 默认返回基础适配器
  return new PlatformAdapter();
}

// 导出平台适配器实例
export const platform = createPlatformAdapter();

// 导出类型
export type {
  IPlatformFile,
  IApiResponse,
  IRequestOptions,
  FileInfo,
  UploadResult,
  LoginResult
} from '@/types';