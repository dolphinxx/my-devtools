<template>
  <div style="position: fixed;top:0;left:0;right:0;bottom:0;user-select: none;">
    <clip-panel v-if="clipping" />
    <draggable-widget
      :class="showingToolbar ? '' : 'hidden'"
      :initial-position="verticalToolbarInitialPosition"
    >
      <div
        class="vertical-toolbar tools-window"
        data-draggable
      >
        <el-icon
          :title="t('tools.clipScreen')"
          @click.prevent="startClipping"
        >
          <icon-scissor />
        </el-icon>
        <el-icon
          :title="t('tools.captureFullScreen')"
          @click.prevent="captureFullScreen"
        >
          <icon-camera />
        </el-icon>
        <el-icon
          :title="t('tools.recognizeText')"
          @click.prevent="triggerSelectFileInputClick"
        >
          <i-mdi-ocr />
          <input
            ref="ocrFileInputRef"
            type="file"
            style="display: none;visibility: hidden;"
            @change="recognizeTextInImage"
          >
        </el-icon>
        <el-icon
          :title="t('tools.exit')"
          @click.prevent="exit()"
        >
          <icon-close />
        </el-icon>
      </div>
    </draggable-widget>
    <recognize-text-result
      v-if="showingOcrResult"
      :image="ocrResultImage"
      :text="ocrResultText"
      :words="ocrResultWords"
      @close="showingOcrResult = false"
    />
  </div>
</template>
<script lang="ts" setup>

import {ref} from 'vue';
import {Scissor as IconScissor, Close as IconClose, Camera as IconCamera} from '@element-plus/icons-vue';
import ClipPanel from '/@/components/tools/ClipPanel.vue';
import {useI18n} from 'vue-i18n';
import {ElMessage} from 'element-plus';
import DraggableWidget from '/@/components/DraggableWidget.vue';
import RecognizeTextResult from '/@/components/tools/RecognizeTextResult.vue';
import type {Word, RecognizeResult} from 'tesseract.js';

const {t} = useI18n();

const verticalToolbarInitialPosition = ref({x: window.innerWidth - 100, y: 100});

const clipping = ref(false);
const showingToolbar = ref(true);


// recognize text
const ocrLang = ref<TessLangCode>('eng');
const ocrFileInputRef = ref<HTMLInputElement>();
const showingOcrResult = ref(false);
const ocrResultImage = ref('');
const ocrResultText = ref('');
const ocrResultWords = ref<Word[]>([]);

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
window.emitter.on('tools:message', ({message, type}) => {
  ElMessage({
    message,
    type,
  });
});
window.emitter.on('tools:recognizeText:success', (data:{image:string, result: RecognizeResult}) => {
  console.log(data);
  ocrResultImage.value = data.image;
  ocrResultText.value = data.result.data.text;
  ocrResultWords.value = data.result.data.words;
  showingOcrResult.value = true;
});

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

function triggerSelectFileInputClick() {
  ocrFileInputRef.value?.click();
}

function recognizeTextInImage() {
  if(ocrFileInputRef.value && ocrFileInputRef.value.files && ocrFileInputRef.value.files.length > 0) {
    ocrFileInputRef.value.files[0].arrayBuffer().then(buf => {
      if(ocrFileInputRef.value) {
        ocrFileInputRef.value.value = '';
      }
      window.tools.recognizeText({image: buf, lang: ocrLang.value});
    });
  }
}

function exit() {
  window.tools.exitToolsWindow();
}
</script>
<style lang="scss" scoped>
.vertical-toolbar {
  $iconSize: 32px;
  height: 400px;
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
