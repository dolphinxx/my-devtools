<template>
  <page-container>
    <section>
      <div>
        <label for="raw">{{ t('ui.label.raw') }}</label>
        <el-input
          id="raw"
          v-model="raw"
        />
      </div>
      <div class="form-gutter">
        <el-checkbox
          v-model="full"
          label="Encode full"
        />
      </div>
      <div class="form-gutter">
        <label for="encoded">{{ t('ui.label.encoded') }}</label>
        <el-input
          id="encoded"
          v-model="encoded"
        />
      </div>
      <div class="form-gutter">
        <el-button @click="encode">
          {{ t('ui.btn.encode') }}
        </el-button>
        <el-button @click="decode">
          {{ t('ui.btn.decode') }}
        </el-button>
      </div>
    </section>
  </page-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import PageContainer from '/@/components/PageContainer.vue';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

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
