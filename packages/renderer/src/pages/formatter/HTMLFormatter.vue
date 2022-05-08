<template>
  <beautifier-minifier-common
    title="HTML"
    :format="format"
    :minify="minify"
  />
</template>

<script lang="ts" setup>
import BeautifierMinifierCommon from '/@/components/BeautifierMinifierCommon.vue';

function format(input:string) {
  return window.nodeFormatter.beautifyHTML(input);
}

function minify(input:string) {
  return window.nodeFormatter.minifyHTML(input);
}
</script>
