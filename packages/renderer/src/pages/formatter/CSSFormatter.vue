<template>
  <beautifier-minifier-common
    title="CSS"
    :format="format"
    :minify="minify"
  />
</template>

<script lang="ts" setup>
import BeautifierMinifierCommon from '/@/components/BeautifierMinifierCommon.vue';

function format(input:string) {
  return window.nodeFormatter.beautifyCSS(input);
}

function minify(input:string) {
  return window.nodeFormatter.minifyCSS(input);
}
</script>
