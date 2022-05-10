<template>
  <page-container>
    <el-form
      :model="appConfig"
      label-position="top"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="t('ui.label.language')">
            <el-select
              v-model="appConfig.language"
              @change="updateLocale"
            >
              <el-option
                label="English"
                value="en"
              />
              <el-option
                label="中文"
                value="cn"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('ui.label.articleDir')">
            <el-input
              v-model="appConfig.articleDir"
              :disabled="true"
              @change="saveConfig"
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
  </page-container>
</template>
<script lang="ts" setup>
import PageContainer from '/@/components/PageContainer.vue';
import {ref, toRaw} from 'vue';
import {useI18n} from 'vue-i18n';
const {t, locale} = useI18n({useScope: 'global'});

const appConfig = ref<AppConfig>(window.systems.loadAppConfig());

function selectDir() {
  const dir = window.systems.selectFolder(appConfig.value.appDir);
  if(dir) {
    appConfig.value.appDir = dir;
  }
}

function updateLocale() {
  locale.value = appConfig.value.language;
  saveConfig();
}

function saveConfig() {
  window.systems.saveAppConfig(toRaw(appConfig.value));
}
</script>
