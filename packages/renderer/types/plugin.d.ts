import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $selectText: (e:FocusEvent) => void;
  }
}
