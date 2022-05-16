<template>
  <div class="title-bar">
    <i
      class="menu-toggle"
      @click="value=!value"
    >
      <icon-d-arrow-right v-if="value" />
      <icon-d-arrow-left v-if="!value" />
    </i>
    <h1>{{ t($route.meta.title||'') }}</h1>
    <div class="title-bar-icon">
      <el-icon
        :title="t('tools.title')"
        @click="openToolsWindow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 16 16"
        ><path
          fill="currentColor"
          d="M5.007 4.5V5H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-.993v-.5a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5Zm1.5-.5h3a.5.5 0 0 1 .5.5V5h-4v-.5a.5.5 0 0 1 .5-.5ZM4 6h8a1 1 0 0 1 1 1v1h-2v-.5a.5.5 0 0 0-1 0V8H6v-.5a.5.5 0 0 0-1 0V8H3V7a1 1 0 0 1 1-1Zm6 3v.5a.5.5 0 0 0 1 0V9h2v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9h2v.503a.5.5 0 0 0 1 0V9h4Z"
        /></svg>
      </el-icon>
    </div>
    <div class="title-bar-item">
      <el-switch
        v-model="darkMode"
        :inline-prompt="true"
        :active-value="true"
        :inactive-value="false"
        :active-icon="IconMoon"
        :inactive-icon="IconSunny"
        size="small"
      />
    </div>
    <language-toggle>
      <div
        class="title-bar-icon"
        style="font-size: 18px;"
      >
        <el-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="1.25em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 640 512"
          ><path
            fill="currentColor"
            d="M448 164c11 0 20 8.1 20 20v4h60c11 0 20 8.1 20 20c0 11-9 20-20 20h-2l-1.6 4.5c-8.9 23.6-22.5 46.6-39.7 65.4c.9.5 1.8.2 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.8 27.5c-5.6 9.5-17.9 12.5-27.4 6.8l-18.9-11.3c-4.4-2.7-9.7-5.5-13.1-8.5c-10.5 7.5-21.9 14-33.9 19.4l-3.7 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-7 18.5-9.8l-12.1-12.2c-7.9-7.8-7.9-20.4 0-28.2c7.8-7.9 20.4-7.9 28.2 0l14.6 14.5l.6-.3c12.4-12.2 22.5-27.4 29.8-45H376c-11.9 0-20-8.1-20-20c0-11 8.1-20 20-20h52v-4c0-11 8.1-20 20-20v.9zm-288 69.2l19 42.8h-38.9l19.9-42.8zM0 128c0-35.35 28.65-64 64-64h512c35.3 0 64 28.65 64 64v256c0 35.3-28.7 64-64 64H64c-35.35 0-64-28.7-64-64V128zm320 256h256V128H320v256zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-63.98 144c-4.48 9.2.06 21.9 10.16 26.4c10.09 4.5 21.92-.1 26.42-10.2l8.9-21h73.6l8.9 21c4.5 10.1 16.3 14.7 26.4 10.2c10.1-4.5 14.7-17.2 10.2-26.4l-64-144z"
          /></svg>
        </el-icon>
      </div>
    </language-toggle>
    <div class="title-bar-traffic-lights">
      <el-icon
        class="minimize-btn"
        @click="minimize"
      >
        <icon-chrome-minimize />
      </el-icon>
      <el-icon
        class="maximize-btn"
        @click="maximize"
      >
        <icon-chrome-maximize v-if="!store.state.maximized" />
        <icon-chrome-restore v-if="store.state.maximized" />
      </el-icon>
      <el-icon
        class="close-btn"
        @click="exit"
      >
        <icon-chrome-close />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  DArrowLeft as IconDArrowLeft, DArrowRight as IconDArrowRight,
  Sunny as IconSunny,
  Moon as IconMoon,
} from '@element-plus/icons-vue';

import {useI18n} from 'vue-i18n';
import {computed, toRaw} from 'vue';
import LanguageToggle from '/@/components/LanguageToggle.vue';
import store from '/@/store';
import {applyDarkMode} from '/@/global';
import IconChromeMinimize from '~icons/codicon/chrome-minimize';
import IconChromeMaximize from '~icons/codicon/chrome-maximize';
import IconChromeRestore from '~icons/codicon/chrome-restore';
import IconChromeClose from '~icons/codicon/chrome-close';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);

const {t} = useI18n({
  useScope: 'global',
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(v) {
    emit('update:modelValue', v);
  },
});

const darkMode = computed<boolean>({
  get() {
    return store.state.appConfig.darkMode === 'dark';
  },
  set(val:boolean) {
    store.commit('updateDark', val ? 'dark' : 'light');
    window.systems.saveAppConfig(toRaw(store.state.appConfig));
    applyDarkMode();
  },
});

function exit() {
  window.systems.exit();
}

function minimize() {
  window.systems.minimize();
}

function maximize() {
  window.systems.maximize();
  store.dispatch('updateMaximized');
}

function openToolsWindow() {
  window.systems.openToolsWindow();
}
</script>

<style lang="scss" scoped>
$title-bar-height: 36px;
$title-bar-content-height: 18px;
$title-bar-padding: calc(($title-bar-height - $title-bar-content-height) / 2);
.title-bar {
  height: $title-bar-height + 1;
  width: 100%;
  flex: none;
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 5px rgb(0 0 0 / 25%);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: row;
  .title-bar-item, .title-bar-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .title-bar-item {
    padding-left: 9px;
    padding-right: 9px;
  }
  .title-bar-icon {
    width: $title-bar-height;
    cursor: pointer;
    &:hover {
      background-color: var(--button-hover-bg-color);
    }
  }
  .menu-toggle {
    display: block;
    width: $title-bar-height;
    height: 100%;
    flex-grow: 0;
    flex-shrink: 0;
    cursor: pointer;
    padding: $title-bar-padding;
    &:hover {
      background-color: var(--button-hover-bg-color);
    }
  }
  h1 {
    margin: 0;
    font-weight: normal;
    font-size: 16px;
    height: 100%;
    padding: $title-bar-padding;
    line-height: 1em;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    -webkit-user-select: none;
    //noinspection CssUnknownProperty
    -webkit-app-region: drag;
  }
  .title-bar-traffic-lights {
    justify-self: end;
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
    .el-icon {
      width: 36px;
      height: 36px;
      color: var(--text-color);
      &:hover {
        background-color: var(--button-hover-bg-color);
        &.close-btn {
          background-color: var(--el-color-danger);
          color: #ffffff;
        }
      }
    }
  }
}


.navigation-bar {
  flex-shrink: 0;
  flex-grow: 0;
  width: 100%;
  height: 20px;
  padding: 2px;
  background-color: white;
  box-shadow: 0 2px 5px rgb(0 0 0 / 25%);
  z-index: 9999;
  display: flex;
  -webkit-user-select: none;
  //noinspection CssUnknownProperty
  -webkit-app-region: drag;

  .navigation-buttons {
    //noinspection CssUnknownProperty
    -webkit-app-region: none;
    height: 16px;

    & > :not(:first-child) {
      margin-left: 3px;
    }

    .close-btn {
      color: darkred;

      &:hover {
        color: red;
      }
    }

    .minimize-btn {
      color: goldenrod;

      &:hover {
        color: gold;
      }
    }

    .maximize-btn {
      color: darkgreen;

      &:hover {
        color: green;
      }
    }
  }
}
</style>
