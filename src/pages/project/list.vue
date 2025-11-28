<template>
  <view class="page">
    <view class="search-bar">
      <input v-model="searchKeyword" placeholder="搜索项目" @confirm="handleSearch" />
    </view>

    <view class="project-list">
      <view 
        class="project-item" 
        v-for="project in filteredProjects" 
        :key="project.id"
        @click="goDetail(project.id)"
      >
        <view class="project-header">
          <text class="project-name">{{ project.name }}</text>
          <view class="project-status" :class="'status-' + project.status">
            {{ getStatusText(project.status) }}
          </view>
        </view>
        <text class="project-client">{{ project.client }}</text>
        <view class="project-footer">
          <text class="time">{{ project.createTime }}</text>
          <text class="progress">进度: {{ project.progress }}%</text>
        </view>
      </view>
    </view>

    <view class="fab" @click="createProject">
      <text>+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PlatformAdapter } from '@/utils/platform';

const searchKeyword = ref('');
const projects = ref<any[]>([]);

const filteredProjects = computed(() => {
  if (!searchKeyword.value) return projects.value;
  return projects.value.filter(p => 
    p.name.includes(searchKeyword.value) || 
    p.client.includes(searchKeyword.value)
  );
});

onMounted(() => {
  loadProjects();
});

async function loadProjects() {
  // TODO: 调用API加载项目列表
  projects.value = [
    {
      id: '1',
      name: 'ABC公司2024年审',
      client: 'ABC科技有限公司',
      status: 'in_progress',
      progress: 65,
      createTime: '2024-11-01'
    },
    {
      id: '2',
      name: 'XYZ集团专项审计',
      client: 'XYZ集团股份有限公司',
      status: 'review',
      progress: 90,
      createTime: '2024-10-15'
    }
  ];
}

function handleSearch() {
  // 搜索逻辑已在 computed 中实现
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    draft: '草稿',
    in_progress: '进行中',
    review: '待审核',
    approved: '已批准',
    completed: '已完成'
  };
  return map[status] || status;
}

function goDetail(id: string) {
  PlatformAdapter.navigateTo(`/pages/project/detail?id=${id}`);
}

function createProject() {
  PlatformAdapter.navigateTo('/pages/project/detail?action=create');
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f8f8f8;
  padding-bottom: 100rpx;
}

.search-bar {
  padding: 20rpx 30rpx;
  background: #fff;

  input {
    height: 70rpx;
    padding: 0 30rpx;
    background: #f5f5f5;
    border-radius: 35rpx;
    font-size: 28rpx;
  }
}

.project-list {
  padding: 20rpx 30rpx;

  .project-item {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background: #fff;
    border-radius: 16rpx;

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15rpx;

      .project-name {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        flex: 1;
      }

      .project-status {
        padding: 6rpx 16rpx;
        border-radius: 16rpx;
        font-size: 22rpx;

        &.status-in_progress {
          background: #e6f7ff;
          color: #1890ff;
        }

        &.status-review {
          background: #fff7e6;
          color: #faad14;
        }
      }
    }

    .project-client {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 20rpx;
    }

    .project-footer {
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
      color: #999;
    }
  }
}

.fab {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #1890ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60rpx;
  box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.4);
}
</style>
