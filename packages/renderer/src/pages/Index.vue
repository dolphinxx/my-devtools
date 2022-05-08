<template>
  <page-container>
    <img
      alt="Vue logo"
      src="../../assets/logo.svg"
      width="150"
    >

    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a
        href="https://github.com/cawa-93/vite-electron-builder"
        target="_blank"
      >vite-electron-builder documentation</a>.
    </p>

    <fieldset>
      <legend>Environment</legend>
      <electron-versions />
    </fieldset>

    <p>
      Edit
      <code>packages/renderer/src/App.vue</code> to test hot module replacement.
    </p>
  </page-container>
</template>

<script lang="ts" setup>
import ElectronVersions from '/@/components/ElectronVersions.vue';
import PageContainer from '/@/components/PageContainer.vue';
</script>

<style lang="scss">
fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
