import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import platformPlugin from './plugins/platform';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  
  app.use(pinia);
  // 使用平台插件
  app.use(platformPlugin);
  
  return {
    app,
    pinia
  };
}
