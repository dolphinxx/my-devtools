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
    <div class="title-bar-traffic-lights">
      <el-icon
        class="maximize-btn"
        @click="maximize"
      >
        <icon-circle-plus-filled />
      </el-icon>
      <el-icon
        class="minimize-btn"
        @click="minimize"
      >
        <icon-remove-filled />
      </el-icon>
      <el-icon
        class="close-btn"
        @click="exit"
      >
        <icon-circle-close-filled />
      </el-icon>
    </div>
  </div>
</template>
<script lang="ts">
import {
  DArrowLeft as IconDArrowLeft, DArrowRight as IconDArrowRight,
  CircleCloseFilled as IconCircleCloseFilled,
  RemoveFilled as IconRemoveFilled,
  CirclePlusFilled as IconCirclePlusFilled,
} from '@element-plus/icons-vue';

import {useI18n} from 'vue-i18n';
import {computed} from 'vue';

export default {
  components: {
    IconDArrowLeft, IconDArrowRight, IconCircleCloseFilled,
    IconRemoveFilled,
    IconCirclePlusFilled,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const {t} = useI18n({
      useScope: 'global',
    });

    const value = computed({
      get() {
        return props.modelValue;
      },
      set(v) {
        context.emit('update:modelValue', v);
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
    }
    return {
      t,
      value,
      exit,
      minimize,
      maximize,
    };
  },
};
</script>

<style lang="scss" scoped>
.title-bar {
  height: 36px;
  padding: 9px 12px;
  width: 100%;
  flex: none;
  background-color: var(--el-bg-color);
  box-shadow: 0 2px 5px rgb(0 0 0 / 25%);
  border-bottom: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: row;
  .menu-toggle {
    display: block;
    width: 18px;
    height: 18px;
    flex-grow: 0;
    flex-shrink: 0;
    cursor: pointer;
  }
  h1 {
    font-weight: normal;
    justify-self: center;
    font-size: 16px;
    line-height: 18px;
    padding: 0;
    margin: 0 0 0 6px;
    flex: 1;
    -webkit-user-select: none;
    //noinspection CssUnknownProperty
    -webkit-app-region: drag;
  }
  .title-bar-traffic-lights {
    justify-self: end;
    flex-grow: 0;
    flex-shrink: 0;
    margin: -9px -12px -9px 0;
    height: 36px;
    .el-icon {
      width: 36px;
      height: 36px;
      color: var(--text-color);
      &:hover {
        background-color: var(--el-border-color-extra-light);
        &.close-btn {
          background-color: var(--el-color-danger);
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
