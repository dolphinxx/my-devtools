<template>
  <el-scrollbar style="flex: 1;">
    <div style="">
      <div
        class="page"
        v-bind="$attrs"
      >
        <slot />
      </div>
    </div>
  </el-scrollbar>
</template>
<script lang="ts">
export default {
  name: 'PageContainer',
};
</script>
