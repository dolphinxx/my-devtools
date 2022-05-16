<template>
  <component
    :is="m.children ? 'ElSubMenu' : 'ElMenuItem'"
    v-for="(m, i) in data"
    :key="i"
    :index="`${index}${i}`"
    :route="m.route"
    :title="t(m.name)"
  >
    <el-icon v-if="m.icon && !m.children">
      <component :is="m.icon" />
    </el-icon>
    <template #title>
      <el-icon v-if="m.icon && m.children">
        <component :is="m.icon" />
      </el-icon>
      <span>{{ t(m.name) }}</span>
    </template>
    <menu-items
      v-if="m.children"
      :data="m.children"
      :index="`${index}-${i}-`"
    />
  </component>
</template>
<script lang="ts" setup>
import type {PropType} from 'vue';
import {useI18n} from 'vue-i18n';

defineProps({
  data: {
    type: Array as PropType<MenuDefinition[]>,
    required: true,
  },
  index: {
    type: String,
    required: true,
  },
});

const {t} = useI18n();
</script>
