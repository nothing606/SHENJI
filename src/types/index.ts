// src/types/index.ts

/**
 * 平台文件接口
 * 扩展了标准 File 接口，添加了小程序和 H5 特有的属性
 */
export interface IPlatformFile extends File {
  /** 文件路径（小程序中特有） */
  path?: string;
  /** 最后修改日期 */
  lastModifiedDate?: Date;
  /** 媒体源缓冲区 */
  activeSourceBuffers?: any;
  /** 媒体时长（秒） */
  duration?: number;
  /** 源关闭事件 */
  onsourceclose?: () => void;
  /** 源结束事件 */
  onsourceended?: () => void;
}

/**
 * 文件信息
 */
export interface FileInfo {
  /** 文件路径 */
  path?: string;
  /** 文件名 */
  name: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件类型 */
  type: string;
  /** 文件对象（H5） */
  file?: File;
}

/**
 * 上传结果
 */
export interface UploadResult {
  /** 文件访问地址 */
  url: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件哈希值（可选） */
  sha256?: string;
  /** 文件ID */
  fileId: string;
}

/**
 * API 响应格式
 */
export interface IApiResponse<T = any> {
  /** 状态码 */
  code: number;
  /** 消息 */
  message: string;
  /** 响应数据 */
  data: T;
}

/**
 * 请求配置
 */
export interface IRequestOptions {
  /** 请求地址 */
  url: string;
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** 请求数据 */
  data?: any;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** 是否显示加载提示 */
  showLoading?: boolean;
  /** 加载提示文字 */
  loadingText?: string;
}

/**
 * 登录结果
 */
export interface LoginResult {
  /** 用户ID */
  userId: string;
  /** 访问令牌 */
  token: string;
  /** 刷新令牌 */
  refreshToken?: string;
  /** 过期时间（秒） */
  expiresIn?: number;
  /** 用户信息 */
  userInfo?: Record<string, any>;
}