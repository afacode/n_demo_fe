<template>
  <icon-font :type="item?.icon" />
  <!-- <TitleI18n :title="item?.meta?.title" /> -->
  <span> {{ item.name }}</span>
</template>

<script lang="ts" setup>
  import type { RouteRecordRaw } from 'vue-router';
  import { IconFont } from '@/components/iconfont';
  // import { TitleI18n } from '@/components/basic/title-i18n';

  defineOptions({
    name: 'MenuItemContent',
  });

  defineProps({
    item: {
      type: Object as PropType<RouteRecordRaw>,
      default: () => ({}),
    },
  });
</script>