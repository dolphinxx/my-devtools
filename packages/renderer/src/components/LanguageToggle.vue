<template>
  <el-dropdown>
    <slot />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in LANGUAGES"
          :key="lang"
          :class="store.state.appConfig.language === lang ? 'active' : ''"
          @click="updateLanguage(lang)"
        >
          {{ LANGUAGE_MAP[lang] }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import {LANGUAGES, LANGUAGE_MAP} from '/@/constants';
import store from '/@/store';
import {toRaw} from 'vue';
import {useI18n} from 'vue-i18n';
const {locale} = useI18n({useScope: 'global'});

function updateLanguage(lang:string) {
  if(store.state.appConfig.language === lang) {
    return;
  }
  store.commit('updateLanguage', lang);
  locale.value = lang;
  window.systems.saveAppConfig(toRaw(store.state.appConfig));
}
</script>
