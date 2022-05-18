<template>
  <div
    ref="draggableRef"
    style="position: fixed;"
    :style="draggablePosition"
    v-bind="$attrs"
    data-draggable
    @mousedown="handleStartDrag"
    @touchstart="handleStartDrag"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue';
import type {PropType} from 'vue';

const props = defineProps({
  initialPosition: {
    type: Object as PropType<Position>,
    default: () => ({x: 0, y: 0}),
  },
});

const dragging = ref(false);
const dragStart = ref({x:0,y:0});
const dragOriginal = {x:0, y: 0};
const draggableRef = ref<HTMLElement>();
const draggableOffset = ref(props.initialPosition);
const draggablePosition = computed(() => ({left: `${draggableOffset.value.x}px`, top: `${draggableOffset.value.y}px`}));

function handleStartDrag(event:MouseEvent|TouchEvent) {
  const draggableAttr = (event.target as HTMLElement).getAttribute('data-draggable');
  if(draggableAttr !== 'true' && draggableAttr !== '') {
    return;
  }
  document.addEventListener('pointermove', handleDrag);
  if(event instanceof TouchEvent) {
    document.addEventListener('touchend', handleStopDrag);
    dragStart.value = {x: event.touches[0].clientX, y: event.touches[0].clientY};
  } else {
    document.addEventListener('mouseup', handleStopDrag);
    dragStart.value = {x: event.clientX, y: event.clientY};
  }
  dragOriginal.x = draggableOffset.value.x;
  dragOriginal.y = draggableOffset.value.y;
  dragging.value = true;
}

function handleDrag(event:TouchEvent|PointerEvent) {
  if(!dragging.value) {
    return;
  }
  let clientX, clientY;
  if(event instanceof TouchEvent) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }
  draggableOffset.value = {x: clientX - dragStart.value.x + dragOriginal.x, y: clientY - dragStart.value.y + dragOriginal.y};
}

function handleStopDrag() {
  dragging.value = false;
  document.removeEventListener('pointermove', handleDrag);
  document.removeEventListener('mouseup', handleStopDrag);
  document.removeEventListener('touchend', handleStopDrag);
}
</script>
