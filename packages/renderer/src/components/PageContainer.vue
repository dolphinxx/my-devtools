<template>
  <el-scrollbar style="flex: 1;">
    <div style="padding: 12px;">
      <div
        class="page"
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
