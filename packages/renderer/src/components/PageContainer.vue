<template>
  <el-scrollbar
    style="flex: 1;"
    :class="scrollable === false ? 'full-page' : ''"
  >
    <div
      class="page"
      :style="pageStyle"
    >
      <slot />
    </div>
  </el-scrollbar>
</template>
<script lang="ts">
export default {
  name: 'PageContainer',
  props: {
    pageStyle: {
      type: [String, Object],
      default: '',
    },
    scrollable: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
