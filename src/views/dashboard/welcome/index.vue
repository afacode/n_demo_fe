<template>
  <div class="box">
    <Descriptions title="系统信息" bordered>
      <Descriptions.Item key="IP" label="IP">
        <!-- {{ loginIp }} -->loginIp
      </Descriptions.Item>
      <!-- <Descriptions.Item v-for="(value, key) in browserInfo" :key="key" :label="key">
        {{ value }}
      </Descriptions.Item>
      <Descriptions.Item label="网络状态">
        <Badge :status="online ? 'processing' : 'default'" :text="online ? '在线' : '离线'" />
      </Descriptions.Item>
      <Descriptions.Item label="WebSocket连接情况">
        <Badge :status="statusTextColor" :text="statusText" />
      </Descriptions.Item> -->
    </Descriptions>
  </div>
</template>
<script lang="ts" setup>
  import { Descriptions, Badge } from 'ant-design-vue';
  import { computed, ref, watchEffect } from 'vue';
  defineOptions({
    name: 'DashboardWelcome',
  });
</script>

<style lang="less" scoped>
  @import '@/styles/theme.less';

  .themeBgColor(box);

  .box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - 280px);
    padding: 12px;

    img {
      flex: 1;
      min-height: 0;
    }

    .ant-form {
      flex: 2;
    }
  }
</style>
