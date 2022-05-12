<template>
  <div class="diff-view">
    <div
      v-for="(line, i) in data"
      :key="i"
      :data-index="i + 1"
      :class="[line.added ? (reverse ? 'removed' : 'added') : undefined, line.removed ? (reverse ? 'added' : 'removed') : undefined]"
      class="diff-line"
    >
      <span
        v-for="(change, ii) in line.changes"
        :key="ii"
        class="diff-block"
      >
        <em
          v-if="!change.added && !change.removed"
          class="diff-same"
        >
          {{ change.value }}
        </em>
        <em
          v-if="reverse ? change.removed : change.added"
          class="diff-added"
        >
          {{ change.value }}
        </em>
        <em
          v-if="reverse ? change.added : change.removed"
          class="diff-removed"
        >
          {{ change.value }}
        </em>
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import type {Change} from 'diff';
const escapeHtml = (unsafe) => {
  return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll('\'', '&#039;');
};
export default {
  props: {
    data: {
      required: true,
      type: Array,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  // setup(props:{data:Change[], reverse: boolean}) {
  //   const result:Change[] = [];
  //   props.data.forEach((change:Change) => {
  //     if(change.value.indexOf('\n') === -1) {
  //       result.push({...change, value: escapeHtml(change.value)});
  //     } else {
  //       change.value.split('\n').forEach(b => {
  //         result.push({...change, value: escapeHtml(b), })
  //       });
  //     }
  //   });
  // },
};
</script>
<style lang="scss" scoped>
.diff-view {
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
  .diff-line {
    display: block;
  }
  .diff-block {
    color: inherit;
    & > * {
      font-style: normal;
    }
  }
}
.diff-same {
}
.diff-added {
  background-color: var(--diff-added-color);
}
.diff-removed {
  background-color: var(--diff-removed-color);
}
</style>
