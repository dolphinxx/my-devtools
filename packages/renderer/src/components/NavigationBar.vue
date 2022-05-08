<template>
  <div class="navigation-bar">
    <div class="navigation-buttons">
      <el-icon
        class="close-btn"
        @click="exit"
      >
        <icon-circle-close-filled />
      </el-icon>
      <el-icon
        class="minimize-btn"
        @click="minimize"
      >
        <icon-remove-filled />
      </el-icon>
      <el-icon
        class="maximize-btn"
        @click="maximize"
      >
        <icon-circle-plus-filled />
      </el-icon>
    </div>
    <div>
      <slot />
    </div>
    <div>
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {ElMessageBox} from 'element-plus';
import {
  CircleCloseFilled as IconCircleCloseFilled,
  RemoveFilled as IconRemoveFilled,
  CirclePlusFilled as IconCirclePlusFilled,
} from '@element-plus/icons-vue';

import {useI18n} from 'vue-i18n';
const {t} = useI18n();

function exit() {
  ElMessageBox.confirm(
    t('message.confirm.exit'),
    t('ui.title.tip'),
    {
      confirmButtonText: t('ui.btn.ok'),
      cancelButtonText: t('ui.btn.cancel'),
      type: 'info',
    },
  )
    .then(() => {
      window.systems.exit();
    }).catch(() => {
    // ignore
  });
}

function minimize() {
  window.systems.minimize();
}

function maximize() {
  window.systems.maximize();
}
</script>

<style lang="scss" scoped>
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
