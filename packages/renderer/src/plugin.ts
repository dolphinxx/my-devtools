import type {App} from 'vue';

export default {
  install(app: App) {
    Object.defineProperty(app.config.globalProperties, '$selectText', {
      value: (e: FocusEvent) => {
        if (e.target) {
          if (e.target instanceof HTMLInputElement) {
            e.target.select();
          }
        }
      },
    });
  },
};
