import {createApp} from 'vue';
import Tools from '/@/Tools.vue';

import {createI18n} from 'vue-i18n';
import messages from '@intlify/vite-plugin-vue-i18n/messages';

import mitt from 'mitt';

import '/@/styles/element/index.scss';
// If you want to use ElMessage, import it.
import 'element-plus/theme-chalk/src/message.scss';
import 'element-plus/theme-chalk/src/message-box.scss';
import '/@/styles/tools.scss';

window.emitter = mitt<EmitterEvent>();
window.onmessage = function({data}) {
  window.emitter.emit(`${data.channel}:${data.event}`, data.data);
};

const app = createApp(Tools);

const i18n = createI18n({
  allowComposition: true,
  legacy: false,
  locale: window.systems.loadAppConfig().language,
  messages,
});
app.use(i18n);

app.mount('#app');
