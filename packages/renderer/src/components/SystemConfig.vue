<template>
  <el-dialog
    v-model="modalVal"
    :close-on-click-modal="false"
    :title="t('ui.title.systemConfig')"
    @open="onOpen"
  >
    <el-form
      :model="editingConfig"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="t('ui.label.appDir')">
            <el-input
              v-model.trim="editingConfig.appDir"
              :disabled="true"
              @click="selectDir"
            >
              <template #append>
                <el-button @click="selectDir">
                  {{ t('ui.btn.pick') }}
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="modalVal = false">{{ t('ui.btn.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="saveConfig"
        >{{ t('ui.btn.save') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {computed, ref, toRaw} from 'vue';
import {useI18n} from 'vue-i18n';
import {ElMessage} from 'element-plus';
import store from '/@/store';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const {t} = useI18n();

const editingConfig = ref<SystemConfig>({appDir: ''});
const modalVal = computed<boolean>({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
function selectDir() {
  const dir = window.systems.selectFolder(editingConfig.value.appDir);
  if(dir) {
    editingConfig.value.appDir = dir;
  }
}

function onOpen() {
  editingConfig.value = {...store.state.systemConfig};
}

function saveConfig() {
  if(JSON.stringify(store.state.systemConfig) === JSON.stringify(editingConfig.value)) {
    modalVal.value = false;
    return;
  }
  if(window.systems.saveSystemConfig(toRaw(editingConfig.value))) {
    store.commit('updateSystemConfig', editingConfig.value);
    ElMessage({
      type: 'success',
      message: t('message.operation.success'),
    });
    modalVal.value = false;
  } else {
    ElMessage({
      type: 'error',
      message: t('message.operation.failed'),
    });
  }
}
</script>
