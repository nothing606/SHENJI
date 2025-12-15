// src/store/index.ts
import { platform } from '@/platforms/factory';

interface State {
  user: {
    isLoggedIn: boolean;
    info: any;
    token: string | null;
  };
  // 其他状态...
}

class Store {
  private state: State = {
    user: {
      isLoggedIn: false,
      info: null,
      token: null,
    },
  };

  // 初始化存储
  async init() {
    const token = await platform.getStorage<string>('auth_token');
    if (token) {
      this.state.user.token = token;
      this.state.user.isLoggedIn = true;
      // 可以在这里获取用户信息
    }
  }

  // 用户相关
  async login(token: string, userInfo: any) {
    await platform.setStorage('auth_token', token);
    await platform.setStorage('user_info', userInfo);
    
    this.state.user = {
      isLoggedIn: true,
      token,
      info: userInfo,
    };
  }

  async logout() {
    await platform.removeStorage('auth_token');
    await platform.removeStorage('user_info');
    
    this.state.user = {
      isLoggedIn: false,
      token: null,
      info: null,
    };
  }

  // 获取状态
  getState(): State {
    return this.state;
  }
}

export const store = new Store();

// 在应用启动时初始化
store.init();