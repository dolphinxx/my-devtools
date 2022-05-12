import {createStore} from 'vuex';

const store = createStore({
  state: {
    systemConfig: window.systems.loadSystemConfig(),
    appConfig: window.systems.loadAppConfig(),
  },
  mutations: {
    updateSystemConfig(state, payload:SystemConfig) {
      state.systemConfig = payload;
    },
    updateAppConfig(state, payload: AppConfig) {
      state.appConfig = payload;
    },
    updateLanguage(state, payload: string) {
      state.appConfig.language = payload;
    },
    updateDark(state, payload: AppConfig['darkMode']) {
      state.appConfig.darkMode = payload;
    },
  },
});

export default store;
