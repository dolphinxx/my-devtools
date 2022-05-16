import {createStore} from 'vuex';

const store = createStore({
  state: {
    systemConfig: window.systems.loadSystemConfig() as SystemConfig,
    appConfig: window.systems.loadAppConfig() as AppConfig,
    maximized: window.systems.isMaximized(),
  },
  mutations: {
    updateMaximized(state, payload:boolean) {
      state.maximized = payload;
    },
    updateSystemConfig(state, payload:SystemConfig) {
      state.systemConfig = payload;
    },
    updateAppConfig(state, payload: AppConfig) {
      state.appConfig = payload;
    },
    updateLanguage(state, payload: Language) {
      state.appConfig.language = payload;
    },
    updateDark(state, payload: AppConfig['darkMode']) {
      state.appConfig.darkMode = payload;
    },
  },
  actions: {
    updateMaximized(context) {
      context.commit('updateMaximized', window.systems.isMaximized());
    },
  },
});

export default store;
