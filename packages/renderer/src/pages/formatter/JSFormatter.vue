<template>
  <beautifier-minifier-common
    :format="format"
    :minify="minify"
  />
</template>

<script lang="ts" setup>
import BeautifierMinifierCommon from '/@/components/BeautifierMinifierCommon.vue';

function format(input:string) {
  return window.nodeFormatter.beautifyJS(input);
}

function minify(input:string) {
  return window.nodeFormatter.minifyJS(input);
}
</script>
