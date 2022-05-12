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
                v-for="lang in LANGUAGES"
                :key="lang"
                :label="LANGUAGE_MAP[lang]"
                :value="lang"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('ui.label.darkMode')">
            <el-radio-group
              v-model="appConfig.darkMode"
              @change="updateDarkMode"
            >
              <el-radio label="system">
                {{ t('ui.label.darkModes.system') }}
              </el-radio>
              <el-radio label="light">
                {{ t('ui.label.darkModes.light') }}
              </el-radio>
              <el-radio label="dark">
                {{ t('ui.label.darkModes.dark') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
import {toRaw, computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {applyDarkMode} from '/@/global';
import store from '/@/store';
import {LANGUAGES, LANGUAGE_MAP} from '/@/constants';

const {t, locale} = useI18n({useScope: 'global'});

const appConfig = computed({
  get() {
    return store.state.appConfig;
  },
  set(val) {
    store.commit('updateAppConfig', val);
  },
});

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

function updateDarkMode() {
  saveConfig();
  applyDarkMode();
}

function saveConfig() {
  store.commit('updateAppConfig', appConfig.value);
  window.systems.saveAppConfig(toRaw(appConfig.value));
}
</script>
