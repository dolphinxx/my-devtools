<template>
  <div>
    <canvas id="canvas" />
    <div
      v-if="!selecting && hasSelection"
      class="clip-toolbar"
      :style="clipToolbarPosition"
    >
      <el-icon :title="t('tools.ok')">
        <icon-check @click="copyToClipboard" />
      </el-icon>
      <el-icon :title="t('tools.cancel')">
        <icon-close @click="cancelSelection" />
      </el-icon>
      <el-icon :title="t('tools.exit')">
        <i-uicons-backward @click="exitClipping" />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {fabric} from 'fabric';
import type {Canvas, Rect, IEvent} from 'fabric/fabric-impl';
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {Close as IconClose, Check as IconCheck} from '@element-plus/icons-vue';
// import IconCancel from '~icons/system-uicons/backward';
import {useI18n} from 'vue-i18n';
const {t} = useI18n();

let canvas: Canvas|null = null;
let selectionRect: Rect|null = null;
const hasSelection = ref(false);
const selecting = ref(false);
let selectionOrigin:Position = {x: 0, y: 0};
const clipToolbarOffset = ref({x: 0, y: 0});
const clipToolbarPosition = computed(() => ({left: `${clipToolbarOffset.value.x}px`, top: `${clipToolbarOffset.value.y}px`}));

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  canvas = new fabric.Canvas('canvas', {
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  });
  initSelection();
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  selectionRect = null;
  try {
    canvas?.dispose();
  } catch (e) {
    // ignore
  }
  canvas = null;
});

function handleKeyDown(event:KeyboardEvent) {
  if(event.key === 'Escape') {
    exitClipping();
  }
}

function initSelection() {
  if(!canvas) {
    return;
  }
  fabric.util.addListener(canvas.upperCanvasEl, 'dblclick', function (e:Event) {
    if(canvas?.findTarget(e, false) === selectionRect) {
      copyToClipboard();
    }
  });
  canvas.on('mouse:down', function (options) {
    if (!canvas || canvas.getActiveObject()) {
      return;
    }
    if (selectionRect) {
      canvas.remove(selectionRect);
    }
    selecting.value = true;
    selectionOrigin = {x: options.e.clientX, y: options.e.clientY};
    selectionRect = new fabric.Rect({
      width: 0,
      height: 0,
      left: selectionOrigin.x,
      top: selectionOrigin.y,
      fill: 'transparent',
      selectionBackgroundColor: 'transparent',
      hasControls: true,
      hasBorders: true,
      lockRotation: true,
      lockSkewingX: true,
      lockSkewingY: true,
      transparentCorners: false,
      cornerColor: 'rgb(64, 158, 255)',
      cornerSize: 8,
    });
    hasSelection.value = true;
    selectionRect.setControlsVisibility({mtr: false});
    canvas.add(selectionRect);
    canvas.setActiveObject(selectionRect);
  });
  canvas.on('mouse:move', function (options) {
    if (!canvas || !selecting.value || !selectionRect) {
      return false;
    }

    const pointer = canvas.getPointer(options.e);
    if (selectionOrigin.x > pointer.x) {
      selectionRect.set({left: Math.abs(pointer.x)});
    }
    if (selectionOrigin.y > pointer.y) {
      selectionRect.set({top: Math.abs(pointer.y)});
    }
    selectionRect.set({
      width: Math.abs(options.e.clientX - selectionOrigin.x),
      height: Math.abs(options.e.clientY - selectionOrigin.y),
    });
    canvas.renderAll();
  });
  canvas.on('mouse:up', function () {
    if(!canvas) {
      return;
    }
    if (selectionRect && (selectionRect.width === 0 || selectionRect.height === 0)) {
      canvas.remove(selectionRect);
      selectionRect = null;
      hasSelection.value = false;
    }
    selecting.value = false;
    if(selectionRect) {
      confirmObjectBoundary(selectionRect);
      updateClipToolbarPosition();
    }
  });
  canvas.on('after:render', function () {
    if (!canvas || canvas.width === undefined || canvas.height === undefined || !selectionRect) {
      return;
    }
    const ctx = canvas.getContext();
    //set the fill color of the overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    const bound = selectionRect.getBoundingRect();
    ctx.beginPath();
    //draw rectangle to the left of the selection
    ctx.rect(0, 0, bound.left, canvas.height);
    //draw rectangle to the right of the selection
    ctx.rect(bound.left + bound.width, 0, canvas.width - bound.left - bound.width, canvas.height);
    //draw rectangle above the selection
    ctx.rect(bound.left, 0, bound.width, bound.top);
    //draw rectangle below the selection
    ctx.rect(bound.left, bound.top + bound.height, bound.width, canvas.height - bound.top - bound.height);
    ctx.fill();
  });
  canvas.on('object:moving', function (event:IEvent) {
    const obj = event.target;

    // if object is too big, ignore
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!obj || !obj.canvas || obj.width! > obj.canvas.height! || obj.height! > obj.canvas.width!) {
      return;
    }


    confirmObjectBoundary(obj);
    if(obj === selectionRect) {
      updateClipToolbarPosition();
    }
  });
}

function cancelSelection() {
  if(!canvas) {
    return;
  }
  if(selectionRect) {
    canvas.remove(selectionRect);
    selectionRect = null;
  }
  hasSelection.value = false;
}

function copyToClipboard() {
  if(!canvas || !selectionRect) {
    return;
  }
  const boundingRect = selectionRect.getBoundingRect();
  cancelSelection();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  canvas.setBackgroundColor('transparent', () => {});
  window.tools.captureScreen({x: boundingRect.left, y: boundingRect.top, width: boundingRect.width, height: boundingRect.height});
  hasSelection.value = false;
  exitClipping();
}

function exitClipping() {
  window.emitter.emit('clip:exit');
}

function confirmObjectBoundary(obj:fabric.Object) {
  obj.setCoords();
  const canvasWidth = obj.canvas?.width??0;
  const canvasHeight = obj.canvas?.height??0;
  const boundingRect = obj.getBoundingRect();
  if (boundingRect.top < 0) {
    obj.top = 0;
  }
  if(boundingRect.left < 0) {
    obj.left = 0;
  }
  if (boundingRect.top + boundingRect.height > canvasHeight) {
    obj.top = canvasHeight - boundingRect.height;
  }
  if (boundingRect.left + boundingRect.width > canvasWidth) {
    obj.left = canvasWidth - boundingRect.width;
  }
}

function updateClipToolbarPosition() {
  if(selecting.value || !selectionRect || !selectionRect.canvas) {
    return;
  }
  const boundingRect = selectionRect.getBoundingRect();
  clipToolbarOffset.value = {
    x: Math.min(Math.max(0, boundingRect.left), selectionRect.canvas.width??0 - 60),
    y: Math.min(Math.max(0, boundingRect.top + boundingRect.height + 20), selectionRect.canvas.height??0 - 64),
  };
}
</script>
<style lang="scss">
.canvas-container {
  background-color: transparent;
}

#canvas {
  background-color: transparent;
}
.clip-toolbar {
  $iconSize: 32px;
  position: fixed;
  display: flex;
  flex-direction: row;
  height: $iconSize + 6px;
  background-color: white;
  border-radius: 3px;
  padding: 3px;
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
