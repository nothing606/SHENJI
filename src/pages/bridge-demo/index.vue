<template>
  <view class="bridge-demo">
    <view class="bridge-demo__content">
      <button 
        type="default" 
        @tap="handleOpenH5"
        style="width: 200px; margin-bottom: 20rpx;"
      >
        打开 H5 页面
      </button>
      <button 
        type="primary" 
        @tap="handleOpenWebView"
        style="width: 200px;"
      >
        在小程序中打开 H5
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      h5Url: 'https://your-h5-domain.com/path' // 替换为你的 H5 地址
    };
  },
  methods: {
    handleOpenH5() {
      // 在 H5 环境中直接跳转
      if (process.env.UNI_PLATFORM === 'h5') {
        window.location.href = this.h5Url;
      } else {
        uni.showToast({
          title: '请在 H5 环境中测试',
          icon: 'none'
        });
      }
    },
    handleOpenWebView() {
      // 在小程序中使用 web-view 打开
      if (process.env.UNI_PLATFORM === 'mp-weixin') {
        uni.navigateTo({
          url: `/pages/webview/index?url=${encodeURIComponent(this.h5Url)}`
        });
      } else {
        uni.showToast({
          title: '请在小程序中测试',
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style scoped>
.bridge-demo {
  padding: 40rpx;
}

.bridge-demo__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  gap: 20rpx;
}
</style>