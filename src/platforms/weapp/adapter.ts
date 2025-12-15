// src/platforms/weapp/adapter.ts
import { IPlatformAdapter, IPlatformFile } from '../types';

declare const wx: any;

export class WeappPlatformAdapter implements IPlatformAdapter {
  // 存储相关
  async setStorage(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data: value,
        success: resolve,
        fail: reject,
      });
    });
  }

  async getStorage<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
      wx.getStorage({
        key,
        success: (res: any) => resolve(res.data),
        fail: () => resolve(null),
      });
    });
  }

  async removeStorage(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key,
        success: resolve,
        fail: reject,
      });
    });
  }

  // 网络请求
  async request<T>(options: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    headers?: Record<string, string>;
  }): Promise<T> {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        header: options.headers,
        success: (res: any) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject(new Error(`Request failed with status code ${res.statusCode}`));
          }
        },
        fail: reject,
      });
    });
  }

  // 文件操作
  async chooseFile(options: {
    count?: number;
    type?: 'image' | 'video' | 'all';
  }): Promise<IPlatformFile[]> {
    return new Promise((resolve, reject) => {
      wx.chooseMedia({
        count: options.count || 9,
        mediaType: options.type === 'image' ? ['image'] :
                  options.type === 'video' ? ['video'] :
                  ['image', 'video'],
        success: (res: any) => {
          const files: IPlatformFile[] = res.tempFiles.map((file: any) => ({
            path: file.tempFilePath,
            size: file.size,
            type: file.fileType || 'unknown',
            name: file.tempFilePath.split('/').pop() || 'unknown',
            lastModified: file.lastModified || Date.now(),
            lastModifiedDate: new Date(file.lastModified || Date.now()),
            originalFile: file // 可选：保留原始文件对象
          }));
          resolve(files);
        },
        fail: reject,
      });
    });
  }

  async uploadFile(options: {
    url: string;
    filePath: string;
    name: string;
    formData?: Record<string, any>;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: options.url,
        filePath: options.filePath,
        name: options.name,
        formData: options.formData,
        success: (res: any) => {
          try {
            const data = JSON.parse(res.data);
            resolve(data);
          } catch (e) {
            resolve(res.data);
          }
        },
        fail: reject,
      });
    });
  }

  // 设备能力
  async scanCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        success: (res: any) => resolve(res.result),
        fail: reject,
      });
    });
  }

  async takePhoto(): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success: (res: any) => resolve(res.tempFilePaths[0]),
        fail: reject,
      });
    });
  }

  // 界面交互
  showToast(options: { title: string; icon?: 'success' | 'loading' | 'none' }): void {
    wx.showToast({
      title: options.title,
      icon: options.icon || 'none',
      duration: 2000,
    });
  }

  showLoading(options: { title: string; mask?: boolean }): void {
    wx.showLoading({
      title: options.title,
      mask: options.mask || false,
    });
  }

  hideLoading(): void {
    wx.hideLoading();
  }

  async showModal(options: { title: string; content: string }): Promise<boolean> {
    return new Promise((resolve) => {
      wx.showModal({
        title: options.title,
        content: options.content,
        success: (res: any) => resolve(res.confirm),
        fail: () => resolve(false),
      });
    });
  }

  // 登录认证
  async login(): Promise<{ code: string; [key: string]: any }> {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res: any) => {
          if (res.code) {
            resolve({
              code: res.code,
              ...res,
            });
          } else {
            reject(new Error('登录失败：' + res.errMsg));
          }
        },
        fail: reject,
      });
    });
  }

  async getAuthCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res: any) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (userInfoRes: any) => {
                resolve(userInfoRes.encryptedData);
              },
              fail: reject,
            });
          } else {
            reject(new Error('用户未授权'));
          }
        },
        fail: reject,
      });
    });
  }

  // 环境信息
  getEnv(): 'h5' | 'weapp' | 'other' {
    return 'weapp';
  }

  async getSystemInfo(): Promise<Record<string, any>> {
    return new Promise((resolve) => {
      wx.getSystemInfo({
        success: (res: any) => resolve(res),
        fail: () => resolve({}),
      });
    });
  }
}