<template>
  <page-container>
    <section>
      <div>
        <label for="raw">Raw:</label>
        <el-input
          id="raw"
          v-model="raw"
        />
      </div>
      <div class="form-gutter">
        <el-checkbox
          v-model="full"
          label="Full"
        />
      </div>
      <div class="form-gutter">
        <label for="encoded">Encoded:</label>
        <el-input
          id="encoded"
          v-model="encoded"
        />
      </div>
      <div class="form-gutter">
        <el-button @click="encode">
          Encode
        </el-button>
        <el-button @click="decode">
          Decode
        </el-button>
      </div>
    </section>
  </page-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import PageContainer from '/@/components/PageContainer.vue';

const raw = ref('');
const encoded = ref('');
const full = ref(false);

function encode() {
  encoded.value = full.value ? encodeURIComponent(raw.value) : encodeURI(raw.value);
}

function decode() {
  raw.value = full.value ? decodeURIComponent(encoded.value) : decodeURI(encoded.value);
}
</script>
