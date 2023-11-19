<template>
  <div class="tabs-view">

    <div class="tabs-view-content">
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <transition
            :name="Object.is(route.meta?.transitionName, false) ? '' : 'fade-transform'"
            mode="out-in"
            appear
          >
            <!-- <keep-alive :include="keepAliveComponents">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive> -->
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </template>
      </router-view>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, unref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Dropdown, Tabs, message, Menu } from 'ant-design-vue';
  const route = useRoute();
  const router = useRouter();
</script>

<style lang="less" scoped>
  .dark .tabs-view {
    border-top: 1px solid black;
  }

  .tabs-view {
    border-top: 1px solid #eee;

    :deep(.tabs) {
      .ant-tabs-nav {
        @apply bg-white dark:bg-black;

        margin: 0;
        padding: 4px 20px 0 10px;
        user-select: none;
      }

      .ant-tabs-tabpane {
        display: none;
      }

      .ant-tabs-tab-remove {
        display: flex;
        margin: 0;
        padding: 0;

        .anticon-close {
          padding-left: 6px;
        }
      }

      .ant-tabs-tab:not(.ant-tabs-tab-active) {
        .ant-tabs-tab-remove {
          width: 0;
        }

        .anticon-close {
          visibility: hidden;
          width: 0;
          transition: width 0.3s;
        }

        &:hover {
          .anticon-close {
            visibility: visible;
            width: 16px;
            padding-left: 6px;
          }

          .ant-tabs-tab-remove {
            width: unset;
          }
        }
      }
    }

    .tabs-view-content {
      /* height: calc(100vh - #{$header-height}); */
      height: calc(100vh - 110px);
      padding: 20px 14px 0;
      overflow: auto;
    }
  }
</style>
