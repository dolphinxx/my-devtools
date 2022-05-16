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
<script lang="ts" setup>
import {defineProps} from 'vue';

defineProps({
  pageStyle: {
    type: [String, Object],
    default: '',
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
});
</script>
