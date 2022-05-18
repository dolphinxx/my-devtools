<template>
  <draggable-widget>
    <div
      class="tools-window"
      data-draggable
    >
      <div style="position: relative;overflow: hidden;">
        <img
          ref="imageRef"
          :src="image"
          draggable="false"
          class="no-drag"
        >
        <canvas
          ref="canvasRef"
          :class="showingMarksOverlay ? '' : 'invisible'"
          style="position: absolute; left:0;top:0;"
        />
        <el-input
          v-model="_text"
          type="textarea"
          :class="showingTextOverlay ? '' : 'invisible'"
          class="match-parent"
          style="position: absolute;top:0;left:0;width: 100%;height: 100%;"
        />
      </div>
      <div data-draggable>
        <el-checkbox
          v-model="showingMarksOverlay"
          :label="t('tools.marks')"
        />
        <el-checkbox
          v-model="showingTextOverlay"
          :label="t('tools.text')"
        />
        <el-button @click="emit('close')">
          {{ t('tools.close') }}
        </el-button>
      </div>
    </div>
  </draggable-widget>
</template>

<script lang="ts" setup>
import DraggableWidget from '/@/components/DraggableWidget.vue';
import {watch, ref} from 'vue';
import type {PropType} from 'vue';
import {useI18n} from 'vue-i18n';
import type {Word} from 'tesseract.js';
const {t} = useI18n();

const emit = defineEmits(['close']);
const props = defineProps({
  image: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  words: {
    type: Array as PropType<Word[]>,
    required: true,
  },
});

const _text = ref(props.text);
const showingMarksOverlay = ref(false);
const showingTextOverlay = ref(true);
const canvasRef = ref<HTMLCanvasElement>();
const imageRef = ref<HTMLImageElement>();

watch(showingMarksOverlay, (val) => {
  if(val) {
    renderRecognizeOverlay();
  }
});

function renderRecognizeOverlay() {
  const canvas = canvasRef.value;
  if(!canvas || !imageRef.value) {
    return;
  }
  const width = imageRef.value.naturalWidth;
  const height = imageRef.value.naturalHeight;
  const ioctx = canvas.getContext('2d');
  if(!ioctx) {
    return;
  }
  canvas.width = width;
  canvas.height = height;
  ioctx.clearRect(0, 0, width, height);
  props.words.forEach((w:Word) => {
    const b = w.bbox;

    ioctx.lineWidth = 1;

    ioctx.strokeStyle = 'red';
    ioctx.strokeRect(b.x0, b.y0, b.x1-b.x0, b.y1-b.y0);
    ioctx.beginPath();
    ioctx.moveTo(w.baseline.x0, w.baseline.y0);
    ioctx.lineTo(w.baseline.x1, w.baseline.y1);
    ioctx.strokeStyle = 'green';
    ioctx.stroke();
  });
}
</script>
