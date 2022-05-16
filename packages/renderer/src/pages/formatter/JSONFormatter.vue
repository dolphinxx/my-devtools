<template>
  <beautifier-minifier-common
    :format="format"
    :minify="minify"
  />
</template>

<script lang="ts" setup>
import BeautifierMinifierCommon from '/@/components/BeautifierMinifierCommon.vue';

function format(input:string) {
  const json = JSON.parse(input);
  return {code: JSON.stringify(json, null, 2)};
}

function minify(input:string) {
  const json = JSON.parse(input);
  return {code: JSON.stringify(json)};
}
</script>
