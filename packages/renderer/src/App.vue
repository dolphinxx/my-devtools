<template>
  <div class="common-layout">
    <!--    <navigation-bar />-->
    <el-container class="main">
      <el-aside width="auto">
        <div
          class="side-container"
          :class="isCollapse ? 'collapsed' : ''"
        >
          <el-scrollbar>
            <el-menu
              :collapse="false"
              router
              :default-active="$route.path"
            >
              <menu-items
                :data="menus"
                index=""
              />
            </el-menu>
          </el-scrollbar>
          <div class="side-toolbar">
            <el-icon @click="showingSystemConfig = true">
              <icon-setting />
            </el-icon>
          </div>
        </div>
      </el-aside>
      <el-container style="flex-direction: column;">
        <title-bar v-model="isCollapse" />
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </el-container>
    </el-container>
  </div>
  <system-config v-model="showingSystemConfig" />
</template>

<script lang="ts" setup>
import {Setting as IconSetting} from '@element-plus/icons-vue';
import MenuItems from '/@/components/MenuItems.vue';
import {ref} from 'vue';
import menus from '/@/menus';
import SystemConfig from '/@/components/SystemConfig.vue';
import TitleBar from '/@/components/TitleBar.vue';

const showingSystemConfig = ref(false);

const isCollapse = ref(true);
</script>

<!--suppress CssUnknownProperty -->
<style lang="scss" scoped>
.common-layout {
  display: flex;
  height: 100vh;
  flex-direction: column;
}
.main {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.main-content {

}
.side-container {
  width: 200px;
  display: flex;
  flex-direction: column;
  //flex-grow: 1;
  //flex-basis: 100%;
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  background-color: var(--el-bg-color);
  overflow: hidden;
  height: 100%;
  border-right: solid 1px var(--el-border-color-light);
  &.collapsed {
    width: 0;
    border: none;
  }
  .el-scrollbar {
    flex: 1;
  }
  .side-toolbar {
    flex: 0;
    padding: 20px;
    display: flex;
    flex-direction: column-reverse;
    .el-icon {
      flex: 0;
      width: 18px;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .menu-toggle-bar {
    display: flex;
    padding: 6px 3px;
    .window-drag-bar {
      display: block;
      width: 18px;
      height: 18px;
      -webkit-user-select: none;
      -webkit-app-region: drag;
      cursor: move;
    }
  }
  .el-menu {
    flex-grow: 1;
    border-right: none;
    overflow-x: hidden;
  }
}
</style>
