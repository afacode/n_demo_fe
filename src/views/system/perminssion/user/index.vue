<template>
  <SplitContent>
    <template #left-content>
      <div class="flex justify-between">
        <div>组织架构</div>
        <Space>
          <Tooltip placement="top">
            <template #title>新增部门</template>
            <PlusOutlined @click="openDeptModal()" />
          </Tooltip>
          <Tooltip placement="top">
            <template #title>刷新 </template>
            <SyncOutlined :spin="deptListLoading" @click="fetchDeptList" />
          </Tooltip>
        </Space>

      </div>
    </template>
    <template #right-content>
      用户管理
    </template>
  </SplitContent>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
  import {
    SyncOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    SwapOutlined,
  } from '@ant-design/icons-vue';
  import { Tree, Dropdown, Space, Tooltip, Modal, Alert, Menu } from 'ant-design-vue';
  defineOptions({
    name: 'SystemUser',
  });

  const deptListLoading = ref(false);
  const openDeptModal = () => {}
  const fetchDeptList = () => {}

</script>

<style lang="less">
</style>
