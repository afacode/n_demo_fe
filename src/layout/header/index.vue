<template>
  <Layout.Header :style="headerStyle" class="layout-header">
    Header
  </Layout.Header>
</template>

<script lang="ts" setup>
import { computed, nextTick } from 'vue';
import type { CSSProperties} from 'vue'
import { useRouter, useRoute, type RouteRecordRaw } from 'vue-router';
import {
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined,
  LockOutlined,
} from '@ant-design/icons-vue';
import {
  Layout,
  message,
  Modal,
  Dropdown,
  Menu,
  Space,
  Breadcrumb,
  Avatar,
  Tooltip,
  type MenuTheme,
} from 'ant-design-vue';

import { useLayoutSettingStore } from '@/stores/modules/layoutSetting';

defineProps({
  collapsed: {
    type: Boolean,
  },
  theme: {
    type: String as PropType<MenuTheme>,
  },
});

const layoutSettingStore = useLayoutSettingStore();
const headerStyle = computed<CSSProperties>(() => {
  const { navTheme, layout } = layoutSettingStore.layoutSetting;
  const isDark = navTheme === 'dark' && layout === 'topmenu';
  return {
    backgroundColor: navTheme === 'realDark' || isDark ? '' : 'rgba(255, 255, 255, 0.85)',
    color: isDark ? 'rgba(255, 255, 255, 0.85)' : '',
  };
});

</script>

<style lang="less" scoped>
.layout-header {
  display: flex;
  position: sticky;
  z-index: 10;
  top: 0;
  align-items: center;
  justify-content: space-between;
  height: @header-height;
  padding: 0 20px;

  * {
    cursor: pointer;
  }
}
</style>