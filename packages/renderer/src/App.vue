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
          <div class="side-toolbar">
            <el-dropdown
              trigger="click"
            >
              <span class="language-toggle">
                <i v-html="flagMap[locale]" />
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toggleLocale('en')">
                    English
                  </el-dropdown-item>
                  <el-dropdown-item @click="toggleLocale('cn')">
                    简体中文
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
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
const iconFlagCn = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 30 20"><defs><path id="a" d="M0-1L.588.809-.952-.309H.952L-.588.809z" fill="#FF0"/></defs><path fill="#EE1C25" d="M0 0h30v20H0z"/><use xlink:href="#a" transform="matrix(3 0 0 3 5 5)"/><use xlink:href="#a" transform="rotate(23.036 .093 25.536)"/><use xlink:href="#a" transform="rotate(45.87 1.273 16.18)"/><use xlink:href="#a" transform="rotate(69.945 .996 12.078)"/><use xlink:href="#a" transform="rotate(20.66 -19.689 31.932)"/></svg>';
const iconFlagEn = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath><clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><g clip-path="url(#a)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#b)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></g></svg>';
const flagMap = {
  cn: iconFlagCn,
  en: iconFlagEn,
};

const {t, locale} = useI18n({
  useScope: 'global',
});

const menuData = ref<MenuDefinition[]>([
  {
    name: 'Home',
    route: {path: '/'},
    icon: 'IconHomeFilled',
  },
  {
    name: 'Article',
    route: {path: '/article'},
    icon: 'IconDocument',
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

function toggleLocale(value:string) {
  locale.value = value;
  localStorage.setItem('locale', value);
}
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
  display: flex;
  flex-direction: column;
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
  .el-scrollbar {
    flex: 1;
  }
  .side-toolbar {
    flex: 0;
    display: block;
    padding: 12px 6px;
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
.language-toggle {
  text-align: center;
  i {
    display: inline-block;
    width: 32px;
    margin-right: 6px;
    svg {
      width: 100%;
    }
  }
}
</style>
