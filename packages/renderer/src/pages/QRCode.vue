<template>
  <page-container>
    <el-tabs v-model="tab">
      <el-tab-pane
        :label="t('ui.btn.generate')"
        name="generate"
      >
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
            <div>
              <el-button
                style="margin-top: 20px;"
                :disabled="!generated"
                @click="copyGenerated"
              >
                {{ t('ui.btn.copy') }}
              </el-button>
            </div>
          </div>
        </section>
      </el-tab-pane>
      <el-tab-pane
        :label="t('ui.btn.scan')"
        name="scan"
      >
        <div>{{ t('message.paste-or-pick-an-image') }}</div>
        <section style="display: flex;">
          <div
            ref="inputRef"
            class="preview"
            style="flex:0;"
          >
            <div>
              <el-image
                fit="contain"
                :src="inputImage"
                :class="inputImage ? '' : 'empty'"
              >
                <template #error>
                  <el-icon
                    :size="64"
                    style="margin-left: 88px;margin-top: 88px;position: relative;"
                  >
                    <div style="background-color:#000000;width: 64px;height: 12px;" />
                    <div style="background-color:#000000;width: 12px;height: 64px;position: absolute;" />
                  </el-icon>
                </template>
              </el-image>
            </div>
          </div>
          <div style="padding: 20px;flex: 1;">
            <el-input
              v-model="scanResult"
              type="textarea"
              :rows="11"
            />
          </div>
        </section>
        <div class="preview-toolbar">
          <el-button @click="clickInputFile">
            {{ t('ui.btn.pick') }}
          </el-button>
          <el-input
            ref="inputFileRef"
            v-model="inputFile"
            type="file"
            style="display: none;"
            :hidden="true"
            @change="handleInputFileSelect"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </page-container>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch} from 'vue';
import type {InputInstance, ElImage} from 'element-plus';
import type {QRCodeErrorCorrectionLevel} from 'qrcode';
import QRCode from 'qrcode';
import QrScanner from 'qr-scanner';
import {ElMessage} from 'element-plus';
import {useI18n} from 'vue-i18n';
import PageContainer from '/@/components/PageContainer.vue';

const {t} = useI18n();

const tab = ref<'generate'|'scan'>('generate');
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

const inputFileRef = ref<InputInstance>();
const inputFile = ref('');
const inputRef = ref<HTMLDivElement>();
const inputImage = ref('');
const scanResult = ref('');

onMounted(() => {
  inputRef.value?.addEventListener('paste', function(e:ClipboardEvent) {
    console.log(e);
    const items:DataTransferItem[] = [].slice.call(e.clipboardData?.items).filter((item:DataTransferItem) => item.type.indexOf('image') !== -1);
    if(items.length === 0) {
      return;
    }
    const blob = items[0].getAsFile();
    if(blob) {
      inputImage.value = URL.createObjectURL(blob);
    }
  });
});
watch(inputImage, (v) => {
  if(v) {
    QrScanner.scanImage(v, {returnDetailedScanResult: true}).then(result => scanResult.value = result.data).catch(e => {
      ElMessage({
        type: 'error',
        message: e instanceof Error ? e.message : String(e),
      });
    });
  }
});

function clickInputFile() {
  inputFileRef.value?.input?.click();
}

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

function copyGenerated() {
  canvasRef.value?.toBlob((blob) => {
    if(!blob) {
      return;
    }
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]).then(() => ElMessage({
      type: 'success',
      message: t('message.operation.success'),
    })).catch(e => ElMessage({
      type: 'error',
      message: e instanceof Error ? e.message : String(e),
    }));
  });
}

function handleInputFileSelect() {
  inputImage.value = '';
  if(inputFileRef.value?.input?.files && inputFileRef.value.input.files.length > 0) {
    const file = inputFileRef.value.input.files[0];
    inputImage.value = URL.createObjectURL(file);
    // file.arrayBuffer().then(buff => {
    //   URL.createObjectURL(new Uint8Array(buff));
    // }).catch((e) => {
    //   ElMessage({
    //     type: 'error',
    //     message: e instanceof Error ? e.message : String(e),
    //   });
    // });
  }
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
  &> * {
    width: $imageSize;
    height: $imageSize;
    box-shadow: rgba(0, 0, 0, 0.16) 0 3px 6px, rgba(0, 0, 0, 0.23) 0 3px 6px;
  }
}
.preview .el-image.empty {
  display: block;
  overflow: visible;
  width: $imageSize;
  height: $imageSize;
}
.preview {
  .el-image {
    width: $imageSize;
    height: $imageSize;
  }
}
.preview-toolbar {
  width: $imageSize + 40px;
  text-align: center;
}
</style>
