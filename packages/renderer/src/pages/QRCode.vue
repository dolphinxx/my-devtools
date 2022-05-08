<template>
  <page-container>
    <section style="display: flex;">
      <div style="flex: 1;">
        <div class="form-group">
          <label for="text">{{ t('ui.label.text') }}</label>
          <el-input
            id="text"
            v-model="text"
            type="textarea"
            :autosize="{minRows: 1, maxRows: 4}"
            @change="generate"
          />
        </div>
        <el-row :gutter="20">
          <el-col
            :lg="12"
            :md="24"
            class="form-gutter"
          >
            <label for="icon">{{ t('ui.label.icon') }}</label>
            <el-input
              id="icon"
              ref="iconRef"
              v-model="icon"
              type="file"
              @change="generate"
            />
          </el-col>
          <el-col
            :lg="12"
            :md="24"
            class="form-gutter"
          >
            <label>{{ t('ui.label.errorCorrectionLevel') }}</label>
            <el-radio-group
              v-model="errorCorrectionLevel"
              @change="generate"
            >
              <el-radio label="L">
                {{ t('ui.level.low') }} ~7%
              </el-radio>
              <el-radio label="M">
                {{ t('ui.level.medium') }} ~15%
              </el-radio>
              <el-radio label="Q">
                {{ t('ui.level.quartile') }} ~25%
              </el-radio>
              <el-radio label="H">
                {{ t('ui.level.high') }} ~30%
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!--            <el-col-->
          <!--              :lg="12"-->
          <!--              :md="24"-->
          <!--            >-->
          <!--              <label>{{ t('ui.label.imageQuality') }}</label>-->
          <!--              <el-input-number-->
          <!--                v-model="optQuality"-->
          <!--                :min="0"-->
          <!--                :max="1"-->
          <!--                :precision="2"-->
          <!--                :step="0.01"-->
          <!--                style="display: block;"-->
          <!--                @change="generate"-->
          <!--              />-->
          <!--            </el-col>-->
          <el-col
            :lg="12"
            :md="24"
            class="form-gutter"
          >
            <label>{{ t('ui.label.imageMargin') }}</label>
            <el-input-number
              v-model="optMargin"
              :min="0"
              :max="20"
              :precision="1"
              :step="0.5"
              style="display: block;"
              @change="generate"
            />
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col
            :lg="6"
            :sm="12"
            class="form-gutter"
          >
            <label>{{ t('ui.label.dotColor') }}</label>
            <el-color-picker
              v-model="optDark"
              show-alpha
              color-format="hex"
              @change="generate"
            />
          </el-col>
          <el-col
            :lg="6"
            :sm="12"
            class="form-gutter"
          >
            <label>{{ t('ui.label.backgroundColor') }}</label>
            <el-color-picker
              v-model="optLight"
              show-alpha
              color-format="hex"
              @change="generate"
            />
          </el-col>
        </el-row>
        <div class="form-gutter">
          <el-button @click="generate">
            {{ t('ui.btn.generate') }}
          </el-button>
        </div>
      </div>
      <div class="preview-panel">
        <div class="preview">
          <canvas
            ref="canvasRef"
          />
        </div>
        <div>
          <el-button
            :disabled="!generated"
            @click="save"
          >
            {{ t('ui.btn.save') }}
          </el-button>
        </div>
      </div>
    </section>
  </page-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import type {InputInstance} from 'element-plus';
import type {QRCodeErrorCorrectionLevel} from 'qrcode';
import QRCode from 'qrcode';
import {ElMessage} from 'element-plus';
import {useI18n} from 'vue-i18n';
import PageContainer from '/@/components/PageContainer.vue';

const {t} = useI18n();

const text = ref('');
const icon = ref('');
const iconRef = ref<InputInstance>();
const generated = ref(false);
const canvasRef = ref<HTMLCanvasElement>();
const errorCorrectionLevel = ref<QRCodeErrorCorrectionLevel>('H');
// const optQuality = ref(0.92);
const optMargin = ref(1);
const optDark = ref('#010101FF');
const optLight = ref('#FFFFFFFF');
const imageSize = 240;
const iconSize = 36;

function generate() {
  generated.value = false;
  if(!text.value || !canvasRef.value) {
    return;
  }
  QRCode.toCanvas(canvasRef.value, text.value, {
    width: imageSize,
    errorCorrectionLevel: errorCorrectionLevel.value,
    // quality: optQuality.value,
    margin: optMargin.value,
    color: {
      dark: optDark.value,
      light: optLight.value,
    },
  }, function (error:Error) {
    if (error) {
      ElMessage({
        message: error.message,
        type: 'error',
      });
      return;
    }
    if(icon.value && iconRef.value?.input?.files && iconRef.value.input.files.length > 0) {
      const ctx = canvasRef.value?.getContext('2d');
      if(!ctx) {
        return;
      }
      const img = new Image();
      img.onload = function() {
        const offset = (imageSize - iconSize) / 2;
        ctx.drawImage(img, offset,offset, iconSize, iconSize);
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(offset, offset, iconSize, iconSize);
      };
      img.src = URL.createObjectURL(iconRef.value.input.files[0]);
    }
    generated.value = true;
  });
}
function save() {
  canvasRef.value?.toBlob((blob) => {
    blob?.arrayBuffer().then(buff => window.systems.saveFile(buff, `qrcode.${Date.now()}.png`)).catch(e => ElMessage({
      message: e instanceof Error ? e.message : String(e),
      type: 'error',
    }));
  });
}
</script>

<style lang="scss" scoped>
$imageSize: 240px;
.preview-panel {
  flex-grow: 0;
  flex-shrink: 0;
  width: $imageSize + 80px;
  text-align: center;
  &>* {
    width: $imageSize + 40px;
    margin: 0 auto;
  }
}
.preview {
  width: $imageSize + 40px;
  height: $imageSize + 40px;
  padding: 20px;
  > canvas {
    width: $imageSize;
    height: $imageSize;
    box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px, rgba(0, 0, 0, 0.23) 0 3px 6px;
  }
}
</style>
