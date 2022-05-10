import {createApp} from 'vue';
import App from '/@/App.vue';
import * as VueRouter from 'vue-router';
import {createI18n} from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
// import zhCn from '/@/locales/zh-cn';
// import enUs from '/@/locales/en-us';

import '/@/styles/index.scss';

// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss';
import 'element-plus/theme-chalk/src/message-box.scss';
import myPlugin from '/@/plugin';
import {ElMenuItem, ElSubMenu} from 'element-plus';
import {HomeFilled, Menu, Document} from '@element-plus/icons-vue';

import routes from './routes';

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: window.systems.loadAppConfig().language,
  messages,
  // messages: {
  //   'cn': zhCn,
  //   'en': enUs,
  // },
});

const router = VueRouter.createRouter({
  // In Electron, Vue Router only works in hash mode.
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html#blank-screen-on-builds-but-works-fine-on-serve
  history: VueRouter.createWebHashHistory(),
  routes: routes,
});

const app = createApp(App);
app.use(myPlugin);
app.use(router);
app.component('ElMenuItem', ElMenuItem);
app.component('ElSubMenu', ElSubMenu);
app.component('IconMenu', Menu);
app.component('IconHomeFilled', HomeFilled);
app.component('IconDocument', Document);
app.use(i18n);
console.log(app.config.$t);
app.mount('#app');

