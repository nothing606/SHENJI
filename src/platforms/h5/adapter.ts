// src/platforms/h5/adapter.ts
import { PlatformAdapter } from '@/utils/platform';
import { FileInfo, UploadResult } from '@/types';

/**
 * H5 平台适配器
 * 提供 H5 特定的实现
 */
export class H5PlatformAdapter extends PlatformAdapter {
  token: string;
  constructor() {
    super();
    // 初始化 token
    this.token = '';
  }

  /**
   * 选择文件
   */
  async chooseFile(options: {
    count?: number;
    type?: 'image' | 'video' | 'file';
    accept?: string;
  }): Promise<FileInfo[]> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = options.count !== 1;

      // 设置接受的文件类型
      if (options.type === 'image') {
        input.accept = 'image/*';
      } else if (options.type === 'video') {
        input.accept = 'video/*';
      } else if (options.accept) {
        input.accept = options.accept;
      } else {
        input.accept = '*/*';
      }

      input.onchange = (e: Event) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        const result: FileInfo[] = files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          path: URL.createObjectURL(file)
        }));
        resolve(result);
      };

      input.click();
    });
  }

  /**
   * 上传文件
   */
  async uploadFile(fileInfo: FileInfo): Promise<UploadResult> {
    if (!fileInfo.file) {
      throw new Error('文件不存在');
    }

    const formData = new FormData();
    formData.append('file', fileInfo.file);

    try {
      // 修正：直接使用 PlatformAdapter.API_BASE 访问静态属性
      const response = await fetch(`${PlatformAdapter.API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': this.token ? `Bearer ${this.token}` : ''
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`上传失败: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        url: result.url || '',
        size: fileInfo.size,
        sha256: result.sha256,
        fileId: result.fileId || Date.now().toString()
      };
    } catch (error) {
      console.error('文件上传失败:', error);
      throw error;
    }
  }

  /**
   * 拍照
   */
  async takePhoto(): Promise<string> {
    const files = await this.chooseFile({
      type: 'image',
      count: 1
    });

    if (files.length === 0 || !files[0].path) {
      throw new Error('未选择图片或获取图片路径失败');
    }

    return files[0].path;
  }

  /**
   * 扫码
   */
  async scanCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      const code = prompt('请扫码或手动输入条码/二维码内容');
      if (code) {
        resolve(code);
      } else {
        reject(new Error('用户取消输入'));
      }
    });
  }
}

// 导出 H5 平台适配器实例
export const platform = new H5PlatformAdapter();