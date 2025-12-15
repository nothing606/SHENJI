// src/platforms/types.ts
export interface IPlatformFile {
  path: string;        // 文件路径或URL
    size: number;        // 文件大小（字节）
    type: string;        // 文件类型（MIME类型）
    name: string;        // 文件名
    lastModified: number; // 最后修改时间戳
    lastModifiedDate: Date; // 最后修改日期对象
    [key: string]: any;   // 允许其他属性，如原始文件对象
}

export interface IPlatformAdapter {
  // 存储相关
  setStorage(key: string, value: any): Promise<void>;
  getStorage<T>(key: string): Promise<T | null>;
  removeStorage(key: string): Promise<void>;
  
  // 网络请求
  request<T>(options: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
  }): Promise<T>;
  
  // 文件操作
  chooseFile(options: {
    count?: number;
    type?: 'image' | 'video' | 'all';
  }): Promise<IPlatformFile[]>;
  
  uploadFile(options: {
    url: string;
    filePath: string;
    name: string;
    formData?: Record<string, any>;
  }): Promise<any>;
  
  // 设备能力
  scanCode(): Promise<string>;
  takePhoto(): Promise<string>;
  
  // 界面交互
  showToast(options: { title: string; icon?: 'success' | 'loading' | 'none' }): void;
  showLoading(options: { title: string; mask?: boolean }): void;
  hideLoading(): void;
  showModal(options: { title: string; content: string }): Promise<boolean>;
  
  // 登录认证
  login(): Promise<{ code: string; [key: string]: any }>;
  getAuthCode(): Promise<string>;
  
  // 环境信息
  getEnv(): 'weapp' | 'h5' | 'other';
  getSystemInfo(): Promise<Record<string, any>>;
}