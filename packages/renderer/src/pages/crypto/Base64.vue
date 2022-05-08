<template>
  <page-container>
    <section>
      <el-tabs v-model="sourceType">
        <el-tab-pane
          label="Text"
          name="text"
        >
          <div>
            <label for="raw">Raw:</label>
            <el-input
              id="raw"
              v-model="raw"
              type="textarea"
              :autosize="{minRows: 4, maxRows: 8}"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="File"
          name="file"
        >
          <div>
            <label for="file">File:</label>
            <el-input
              id="file"
              ref="fileRef"
              v-model="file"
              type="file"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="form-gutter">
        <label for="encoded">Encoded:</label>
        <el-input
          id="encoded"
          v-model="encoded"
          type="textarea"
          :autosize="{minRows: 4, maxRows: 8}"
        />
      </div>
      <div class="form-gutter">
        <el-button @click="encode">
          Encode
        </el-button>
        <el-button
          v-if="sourceType === 'text'"
          @click="decode"
        >
          Decode
        </el-button>
        <el-popover
          v-if="isImage"
          placement="top-start"
          :width="200"
          trigger="click"
        >
          <template #reference>
            <el-button>
              Preview
            </el-button>
          </template>
          <el-image :src="encoded" />
        </el-popover>
      </div>
    </section>
  </page-container>
</template>

<script lang="ts" setup>
import {ref, computed} from 'vue';
import type { InputInstance} from 'element-plus';
import {ElMessage} from 'element-plus';
import PageContainer from '/@/components/PageContainer.vue';

const sourceType = ref('text');
const raw = ref<string>('');
const fileRef = ref<InputInstance>();
const file = ref();
const encoded = ref<string>('');
const calc$$ = ref(false);
const isImage = computed(() => sourceType.value === 'file' && encoded.value.startsWith('data:image/'));

function encode() {
  if(sourceType.value === 'file') {
    if(fileRef.value?.input?.files && fileRef.value.input.files.length > 0) {
      calc$$.value = true;
      fileRef.value.input.files[0].arrayBuffer().then(buf => window.nodeCrypto.base64url(new Uint8Array(buf))).then(result => encoded.value = result).catch(e => ElMessage({
        message: e.message,
        type: 'error',
      })).finally(() => calc$$.value = false);
    } else {
      encoded.value = '';
    }
  } else {
    encoded.value = btoa(raw.value);
  }
}

function decode() {
  try {
    raw.value = atob(encoded.value);
  } catch (ignore) {
    // ignore
  }
}
</script>
