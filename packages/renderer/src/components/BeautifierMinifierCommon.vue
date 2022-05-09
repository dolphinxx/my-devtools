<template>
  <page-container>
    <section>
      <div>
        <label for="input">{{ t('ui.label.input') }}</label>
        <el-input
          id="input"
          v-model="input"
          type="textarea"
          :autosize="{minRows: 4, maxRows: 12}"
        />
      </div>
      <div class="form-gutter">
        <label for="output">{{ t('ui.label.output') }}</label>
        <el-input
          id="output"
          v-model="output"
          type="textarea"
          :autosize="{minRows: 4, maxRows: 12}"
        />
      </div>
      <div class="form-gutter">
        <el-button
          :disabled="input.length === 0"
          @click="doFormat"
        >
          {{ t('ui.btn.beautify') }}
        </el-button>
        <el-button
          :disabled="input.length === 0"
          @click="doMinify"
        >
          {{ t('ui.btn.minify') }}
        </el-button>
      </div>
      <div v-if="warnings.length > 0">
        <p
          v-for="(w, i) in warnings"
          :key="i"
        >
          {{ w }}
        </p>
      </div>
    </section>
  </page-container>
</template>

<script lang="ts">
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import PageContainer from '/@/components/PageContainer.vue';
import {useI18n} from 'vue-i18n';

export default {
  components: {PageContainer},
  props: {
    title: {type: String, required: true},
    format: {type: Function, required: true},
    minify: {type: Function, required: true},
  },
  setup(props:{format:FormatterFn, minify: FormatterFn}) {
    const {t} = useI18n();
    const input = ref('');
    const output = ref('');
    const warnings = ref<string[]>([]);

    async function doFormat() {
      warnings.value = [];
      try {
        const r = props.format(input.value);
        const result: FormatResult = r instanceof Promise ? await r : r;
        output.value = result.code||'';
        if (result.warnings && result.warnings.length > 0) {
          warnings.value = result.warnings;
        }
      } catch (e) {
        ElMessage({
          message: e instanceof Error ? e.message : String(e),
          type: 'error',
        });
      }
    }

    async function doMinify() {
      warnings.value = [];
      try {
        const r = props.minify(input.value);
        const result: FormatResult = r instanceof Promise ? await r : r;
        output.value = result.code||'';
        if (result.warnings && result.warnings.length > 0) {
          warnings.value = result.warnings;
        }
      } catch (e) {
        ElMessage({
          message: e instanceof Error ? e.message : String(e),
          type: 'error',
        });
      }
    }

    return {
      t,
      input,
      output,
      warnings,
      doFormat,
      doMinify,
    };
  },
};


</script>
