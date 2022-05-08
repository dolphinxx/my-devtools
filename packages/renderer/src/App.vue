<template>
  <div class="common-layout">
    <navigation-bar />
    <el-container class="main">
      <el-aside width="auto">
        <div
          class="side-container"
          :class="isCollapse ? 'collapsed' : ''"
        >
          <el-scrollbar>
            <el-menu
              :collapse="isCollapse"
              router
              :default-active="$route.path"
            >
              <menu-items
                :data="menuData"
                index=""
              />
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-container style="flex-direction: column;">
        <div class="title-bar">
          <i
            class="menu-toggle"
            @click="isCollapse=!isCollapse"
          >
            <d-arrow-right v-if="isCollapse" />
            <d-arrow-left v-if="!isCollapse" />
          </i>
          <h1>{{ t($route.meta.title||'') }}</h1>
        </div>
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
</template>

<script lang="ts" setup>
import {DArrowLeft, DArrowRight} from '@element-plus/icons-vue';
import MenuItems from '/@/components/MenuItems.vue';
import {ref} from 'vue';
import {useI18n} from 'vue-i18n';
import NavigationBar from '/@/components/NavigationBar.vue';

const {t} = useI18n({
  useScope: 'global',
});

const menuData = ref<MenuDefinition[]>([
  {
    name: 'Home',
    route: {path: '/'},
    icon: 'IconHomeFilled',
  },
  {
    name: 'Tools',
    icon: 'IconMenu',
    children: [
      {
        name: 'Crypto',
        children: [
          {
            name: 'Base64',
            route: {path: '/crypto/base64'},
          },
          {
            name: 'Hash',
            route: {path: '/crypto/hash'},
          },
        ],
      },
      {
        name: 'Url Encoder & Decoder',
        route: {path: '/url-encoder'},
      },
      {
        name: 'QR Code',
        route: {path: '/qrcode'},
      },
      {
        name: 'Beautifier & Minifier',
        children: [
          {
            name: 'JSON',
            route: {path: '/formatter/json'},
          },
          {
            name: 'HTML',
            route: {path: '/formatter/html'},
          },
          {
            name: 'JS',
            route: {path: '/formatter/js'},
          },
          {
            name: 'CSS',
            route: {path: '/formatter/css'},
          },
          {
            name: 'XML',
            route: {path: '/formatter/xml'},
          },
          {
            name: 'SQL',
            route: {path: '/formatter/sql'},
          },
        ],
      },
    ],
  },
]);

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
}
.main-content {

}
.title-bar {
  height: 36px;
  padding: 9px 12px;
  width: 100%;
  flex: none;
  background-color: #ffffff;
  display: flex;
  h1 {
    font-weight: normal;
    justify-self: center;
    font-size: 16px;
    line-height: 18px;
    padding: 0;
    margin: 0 0 0 6px;
  }
}
.side-container {
  width: 200px;
  //flex-grow: 1;
  //flex-basis: 100%;
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  background-color: #ffffff;
  overflow: hidden;
  height: 100%;
  //border-right: solid 1px var(--el-border-color-light);
  &.collapsed {
    width: 64px;
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
.menu-toggle {
  display: block;
  width: 18px;
  height: 18px;
  flex-grow: 0;
  flex-shrink: 0;
  cursor: pointer;
}
</style>
