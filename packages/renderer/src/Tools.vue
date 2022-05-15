<template>
  <div style="position: fixed;top:0;left:0;right:0;bottom:0;user-select: none;">
    <clip-panel v-if="clipping" />
    <div
      ref="verticalToolbarRef"
      class="vertical-toolbar"
      :class="showingToolbar ? '' : 'hidden'"
      :style="toolbarPosition"
      @mousedown="handleStartDrag"
      @touchstart="handleStartDrag"
    >
      <el-icon
        :title="t('tools.clipScreen')"
        @click="startClipping"
      >
        <icon-scissor />
      </el-icon>
      <el-icon
        :title="t('tools.captureFullScreen')"
        @click="captureFullScreen"
      >
        <icon-camera />
      </el-icon>
      <el-icon
        :title="t('tools.exit')"
        @click="exit()"
      >
        <icon-close />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>

import {computed, ref, onMounted, onUnmounted, nextTick} from 'vue';
import {Scissor as IconScissor, Close as IconClose, Camera as IconCamera} from '@element-plus/icons-vue';
import ClipPanel from '/@/components/tools/ClipPanel.vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

const toolbarOffset = ref({x: window.innerWidth - 100, y: 100});
const verticalToolbarRef = ref<HTMLElement>();
const dragging = ref<''|'toolbar'>('');
const dragStart = ref({x:0,y:0});
const dragOriginal = {x:0, y: 0};
const clipping = ref(false);
const showingToolbar = ref(true);

const toolbarPosition = computed(() => ({left: `${toolbarOffset.value.x}px`, top: `${toolbarOffset.value.y}px`}));
window.emitter.on('tools:shortcut', (data) => {
  if(data === 'Alt+CommandOrControl+A') {
    startClipping();
    return;
  }
  if(data === 'PrintScreen') {
    captureFullScreen();
    return;
  }
  // if(data === 'Escape') {
  //   if(capturing.value) {
  //     capturing.value = false;
  //     return;
  //   }
  //   window.tools.exitToolsWindow();
  //   return;
  // }
});
window.emitter.on('clip:exit', () => {
  clipping.value = false;
  showingToolbar.value = true;
});
onMounted(() => {
  document.addEventListener('pointermove', handleDrag);
  document.addEventListener('mouseup', handleStopDrag);
  document.addEventListener('touchend', handleStopDrag);
});
onUnmounted(() => {
  document.removeEventListener('pointermove', handleDrag);
  document.removeEventListener('mouseup', handleStopDrag);
  document.removeEventListener('touchend', handleStopDrag);
});

function handleStartDrag(event:MouseEvent|TouchEvent) {
  console.log(event);
  if(event instanceof TouchEvent) {
    dragStart.value = {x: event.touches[0].clientX, y: event.touches[0].clientY};
  } else {
    dragStart.value = {x: event.clientX, y: event.clientY};
  }
  if(event.target === verticalToolbarRef.value) {
    dragOriginal.x = toolbarOffset.value.x;
    dragOriginal.y = toolbarOffset.value.y;
    dragging.value = 'toolbar';
  }
}

function handleDrag(event:TouchEvent|PointerEvent) {
  if(dragging.value === 'toolbar') {
    let clientX, clientY;
    if(event instanceof TouchEvent) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    toolbarOffset.value = {x: clientX - dragStart.value.x + dragOriginal.x, y: clientY - dragStart.value.y + dragOriginal.y};
  }
}

function handleStopDrag() {
  dragging.value = '';
}

function startClipping() {
  clipping.value = true;
  showingToolbar.value = false;
  window.emitter.emit('clip:startSelect');
}

function captureFullScreen() {
  showingToolbar.value = false;
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    window.tools.captureScreen();
    showingToolbar.value = true;
  }));
}

function exit() {
  window.tools.exitToolsWindow();
}
</script>
<style lang="scss" scoped>
.vertical-toolbar {
  $iconSize: 32px;
  position: fixed;
  width: $iconSize + 6px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0.15) 0 3px 3px 0;
  cursor: move;
  padding: 3px;
  display: flex;
  flex-direction: column;
  .el-icon {
    width: $iconSize;
    height: $iconSize;
    cursor: pointer;
    border-radius: 3px;
    &:hover {
      background-color: var(--button-hover-bg-color);
    }
  }
}
</style>
