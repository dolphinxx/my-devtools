<template>
  <page-container class="diff-page">
    <div class="toolbar">
      <el-radio-group v-model="mode">
        <el-radio
          v-for="m in modes"
          :key="m"
          :label="m"
        >
          {{ t(`page.textDiff.${m}`) }}
        </el-radio>
      </el-radio-group>
      <el-button @click="diff">
        diff
      </el-button>
    </div>
    <div class="diff-container">
      <el-scrollbar class="diff-editor">
        <div
          ref="leftRef"
        />
      </el-scrollbar>
      <div class="diff-gutter" />
      <el-scrollbar class="diff-editor">
        <div
          ref="rightRef"
        />
      </el-scrollbar>
    </div>
    <div
      v-if="diffResult.length"
      class="diff-stat"
    >
      <div class="diff-stat-data">
        <div><span class="diff-stat-added">{{ diffStat.removedCount }}</span></div>
        <div><span class="diff-stat-removed">{{ diffStat.addedCount }}</span></div>
      </div>
      <div class="diff-gutter">
        <div><span class="diff-stat-added">+</span></div>
        <div><span class="diff-stat-removed">−</span></div>
      </div>
      <div class="diff-stat-data">
        <div><span class="diff-stat-added">{{ diffStat.addedCount }}</span></div>
        <div><span class="diff-stat-removed">{{ diffStat.removedCount }}</span></div>
      </div>
    </div>
    <div
      v-if="diffResult.length"
      class="diff-results"
    >
      <div class="diff-result-left">
        <diff-view
          :data="diffResult"
          :reverse="true"
        />
      </div>
      <div class="diff-gutter" />
      <div class="diff-result-right">
        <diff-view
          :data="diffResult"
          :reverse="false"
        />
      </div>
    </div>
  </page-container>
</template>
<script lang="ts" setup>
import PageContainer from '/@/components/PageContainer.vue';
import {ref, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {diffSentences, diffLines, diffWords, diffChars, diffJson, diffCss} from 'diff/lib/index.es6.js';
import {ElMessage} from 'element-plus';
import type {Change} from 'diff';
import DiffView from '/@/components/DiffView.vue';
import {EditorView, EditorState, basicSetup} from '@codemirror/basic-setup';

// import txt1 from '/@/data/diff1.txt?raw';
// import txt2 from '/@/data/diff2.txt?raw';
type DiffLine = {
  added: boolean;
  removed: boolean;
  changes: Change[];
}

const {t} = useI18n();

const modes = ['sentence', 'line', 'word', 'char', 'json', 'css'] as const;

const leftRef = ref<HTMLDivElement>();
const rightRef = ref<HTMLDivElement>();
const mode = ref<typeof modes[number]>('char');
const diffResult = ref<DiffLine[]>([]);
const diffStat = ref({addedCount: 0, removedCount: 0});
let leftEditor:EditorView, rightEditor:EditorView;

onMounted(() => {
  leftEditor = new EditorView({
    lineWrapping: true,
    state: EditorState.create({
      // doc: txt1,
      extensions: [basicSetup],
    }),
    parent: leftRef.value,
  });
  rightEditor = new EditorView({
    lineWrapping: true,
    state: EditorState.create({
      // doc: txt2,
      extensions: [basicSetup],
    }),
    parent: rightRef.value,
  });
});

function doDiff(mode: typeof modes[number], left: string, right: string):Change[] {
  switch (mode) {
    case 'sentence':
      return diffSentences(left, right);
    case 'line':
      return diffLines(left, right);
    case 'word':
      return diffWords(left, right);
    case 'char':
      return diffChars(left, right);
    case 'json':
      return diffJson(JSON.parse(left), JSON.parse(right));
    case 'css':
      return diffCss(left, right);
  }
  throw new Error(`Unknown mode: ${mode}`);
}

function formatDiffValue(raw:string) {
  if(raw.length === 0) {
    return '\u2028';
  }
  return raw.replace(/[\x07\x1B\f\n\r\t\v ]/g, ' ');
}

function diff() {
  if(!leftEditor || !rightEditor) {
    return;
  }
  try {
    let addedCount = 0;
    let removedCount = 0;
    const lines:DiffLine[] = [];
    let line:Change[] = [];
    let added: false;
    let removed: false;
    doDiff(mode.value, leftEditor.state.doc.toString(), rightEditor.state.doc.toString()).forEach(_ => {
      console.log(JSON.stringify(_));
      if(_.added) {
        addedCount++;
      }
      if(_.removed) {
        removedCount++;
      }
      if(_.value.indexOf('\n') === -1) {
        _.value = formatDiffValue(_.value);
        line.push(_);
        added ||= !!_.added;
        removed ||= !!_.removed;
      } else {
        if(_.value === '\n') {
          if(line.length > 0) {
            lines.push({changes: line, added, removed});
            line = [];
          }
          _.value = formatDiffValue('');
          lines.push({changes: [_], added: !!_.added, removed: !!_.removed});
          added = false;
          removed = false;
          return;
        }
        added ||= !!_.added;
        removed ||= !!_.removed;
        _.value.split('\n').forEach((__, i, array) => {
          // skip first and last empty str
          if((i === 0 || i === array.length - 1) && __.length === 0) {
            if(line.length > 0) {
              lines.push({changes: line, added, removed});
              line = [];
              added = false;
              removed = false;
            }
            return;
          }
          if(i > 0 && line.length > 0) {
            lines.push({changes: line, added, removed});
            line = [];
            added = false;
            removed = false;
          }
          line.push({..._, value: formatDiffValue(__)});
        });
      }
      return _;
    });
    if(line.length > 0) {
      lines.push({changes: line, added, removed});
    }
    diffResult.value = lines;
    diffStat.value.addedCount = addedCount;
    diffStat.value.removedCount = removedCount;
  } catch(e) {
    ElMessage({
      type: 'error',
      message: e instanceof Error ? e.message : String(e),
    });
  }
}
</script>

<style lang="scss">
.diff-page {
  --diff-added-color: #8ee0b6;
  --diff-removed-color: #ff957e;
  .toolbar {
    flex-grow: 0;
    flex-shrink: 0;
    height: 40px;
    padding: 4px;
    display: flex;
    &>:not(:first-child) {
      margin-left: 32px;
    }
  }

  .diff-container {
    margin-top: 20px;
  }

  .diff-stat {
    padding: 12px 0;
    display: flex;
    flex-direction: row;
    .diff-gutter {
      text-align: center;
      font-weight: bold;
    }
    .diff-stat-data {
      flex: 1 1 100%;
      overflow: hidden;
      padding: 0 0.5em;
      &:first-child {
        text-align: right;
      }
      &:last-child {
        text-align: left;
      }
    }
    .diff-stat-added {
      color: var(--diff-added-color);
    }
    .diff-stat-removed {
      color: var(--diff-removed-color);
    }
  }

  .diff-gutter {
    flex-grow: 0;
    flex-shrink: 0;
    width: 20px;
    height: 100%;
  }

  .diff-container {
    flex: 1;
    display: flex;
    height: 600px;

    .diff-editor {
      height: 100%;
      flex: 1 1 100%;
      overflow-x: hidden;
      border: 1px solid var(--el-border-color);
      .cm-scroller {
        min-height: 592px;
      }
      .cm-editor {
        .cm-line {
          white-space: pre-wrap;
          word-break: break-all;
        }
      }
    }
  }

  .diff-results {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .diff-result-left, .diff-result-right {
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: 100%;
      border: 1px solid var(--el-border-color);
      padding: 0.5em;
      .diff-line {
        position: relative;
        font-size: 14px;
        line-height: 1.5em;
        letter-spacing: 0.15em;
        &.added:after {
          color: var(--diff-added-color);
          content: '⁺';
        }
        &.removed:before{
          color: var(--diff-removed-color);
          content: '₋';
        }
        //&.added.removed:after {
        //  content: '±';
        //}
        &:after,&:before {
          position: absolute;
          top: 0;
          font-size: 16px;
        }
      }
    }
    .diff-result-right {
      .diff-line {
        &.added, &.removed {
          &:before, &:after {
            left: -19px;
          }
        }
      }
    }
    .diff-result-left {
      .diff-line {
        &.added, &.removed {
          &:before, &:after {
            right: -19px;
          }
        }
      }
    }
  }
}
.dark {
  .diff-page {
    --diff-added-color: #66d59c;
    --diff-removed-color: #ff6b4b;
    .cm-activeLine, .cm-activeLineGutter {
      background-color: #404245;
    }
    .cm-gutters {
      color: #aaaaaa;
      background-color: #222222;
      border-color: #333333;
    }
    .cm-cursor {
      border-color: #aaaaaa;
    }
  }
}
</style>
