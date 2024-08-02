<script setup lang="ts">
import { computed } from '#imports';

const props = defineProps({
  tabs: {
    type: Array,
    required: false,
    default: () => [],
  },
  modelValue: {
    type: [String, Number, undefined],
    required: false,
    default: undefined,
  },
});

const emits = defineEmits(['update:modelValue']);

const currentTab = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
});
</script>

<template>
  <div class="chart-tabs">
    <button
      v-for="tab in tabs || []"
      :key="tab.key"
      category="tertiary"
      size="middle"
      class="chart-tabs__tab"
      :class="{ active: tab.key === currentTab }"
      @click="currentTab = tab.key"
    >
      {{ tab.title }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.chart-tabs {
  display: flex;

  align-items: stretch;

  column-gap: 10px;

  width: fit-content;

  &__tab {
    position: relative;

    padding: 10px;

    border: 1px solid #4c725d;

    border-radius: 20px;

    background-color: #ffffff;

    &.active {
      color: #ffffff;

      border-color: #4c725d;

      background-color: #4c725d;
    }

    &.active {
      &:hover {
        border-color: #4c725d;
      }
    }
  }
}
</style>

