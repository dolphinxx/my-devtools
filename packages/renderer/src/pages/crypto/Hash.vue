<template>
  <page-container>
    <section>
      <el-tabs v-model="sourceType">
        <el-tab-pane
          :label="t('ui.btn.text')"
          name="text"
        >
          <div>
            <label for="raw">{{ t('ui.label.raw') }}</label>
            <el-input
              id="raw"
              v-model="raw"
              @keydown.enter="calc"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="t('ui.btn.file')"
          name="file"
        >
          <div>
            <label for="file">{{ t('ui.label.file') }}</label>
            <el-input
              id="file"
              ref="fileRef"
              v-model="file"
              type="file"
              @click="clearFile"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="form-gutter">
        <label>{{ t('ui.label.algorithm') }}</label>
        <div>
          <el-radio-group v-model="type">
            <el-radio label="md5">
              MD5
            </el-radio>
            <el-radio label="sha1">
              SHA1
            </el-radio>
            <el-radio label="sha256">
              SHA-256
            </el-radio>
            <el-radio label="sha512">
              SHA-512
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="form-gutter">
        <label>{{ t('ui.label.encrypted') }}</label>
        <el-input
          v-model="encrypted"
          @focus="$selectText"
        />
      </div>
      <div class="form-gutter">
        <el-button
          :loading="calc$$"
          @click="calc"
        >
          {{ t('ui.btn.calc') }}
        </el-button>
      </div>
    </section>
  </page-container>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import type {InputInstance} from 'element-plus';
import {ElMessage} from 'element-plus';
import PageContainer from '/@/components/PageContainer.vue';
import {useI18n} from 'vue-i18n';

type HashType = 'md5'|'sha1'|'sha256'|'sha512';

const {t} = useI18n();

const sourceType = ref('text');
const raw = ref('');
const fileRef = ref<InputInstance>();
const file = ref();
const encrypted = ref('');
const type = ref<HashType>('md5');
const calc$$ = ref(false);

function calc() {
  if(sourceType.value === 'file') {
    if(fileRef.value?.input?.files && fileRef.value.input.files.length > 0) {
      calc$$.value = true;
      fileRef.value.input.files[0].arrayBuffer().then(buf => {
        encrypted.value = window.nodeCrypto[type.value](new Uint8Array(buf));
      }).catch(e => ElMessage({
        message: e.message,
        type: 'error',
      })).finally(() => calc$$.value = false);
    } else {
      encrypted.value = '';
    }
  } else {
    calc$$.value = true;
    try {
      encrypted.value = window.nodeCrypto[type.value](raw.value);
    } finally {
      calc$$.value = false;
    }
  }
}

function clearFile() {
  fileRef.value?.clear();
}
</script>
