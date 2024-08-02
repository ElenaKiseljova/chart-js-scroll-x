<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

useHead({
  title: 'Charts by period',
});

// Register components of Chart
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Font of Chart
ChartJS.defaults.font.family = "'Arial', sans-serif";
ChartJS.defaults.font.weight = 400;

// Static data for Chart
const OPTIONS = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const DATA = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1,
    },
  ],
};

// Width of axesY
const axesYWidth = ref(null);
</script>

<template>
  <div class="charts">
    <h3 class="charts__title">Charts by period</h3>

    <div class="charts__tabs">
      <!-- Period Tabs -->
    </div>

    <div class="charts__items">
      <div
        v-if="axesYWidth"
        class="charts__item-wrapper charts__item-wrapper--axes-y"
        :style="{
          width: `${axesYWidth}px`,
        }"
      >
        <div class="charts__item charts__item--axes-y">
          <Bar
            :data="DATA"
            :options="OPTIONS"
            class="charts__bar charts__bar--axes-y"
          />
        </div>
      </div>

      <div class="charts__item-wrapper charts__item-wrapper--body">
        <div class="charts__item charts__item--body">
          <Bar
            :data="DATA"
            :options="OPTIONS"
            class="charts__bar charts__bar--body"
          />
        </div>
      </div>

      <ul
        class="charts__legend"
        :style="{ '--axes-y-width': axesYWidth ? `${axesYWidth}px` : 'unset' }"
      >
        <!-- Chart Legend -->
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
// Reset default spaces
* {
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
// Breakpoints
$desktop-small: 1450px;
$tablet: 1180px;
$mobile-middle: 568px;

// Max width window
@mixin maxWidth($width) {
  @media screen and (max-width: #{$width}) {
    @content;
  }
}

// Obtaining a block with exact proportions ratio (use ::before)
@mixin beforeForHeight($width, $height) {
  &::before {
    display: block;

    width: 100%;

    padding-bottom: calc($height / $width * 100%);

    content: '';
  }
}

.charts {
  width: 100%;

  padding: 50px;

  box-sizing: border-box;

  font-family: 'Arial', sans-serif;

  &__title {
    width: 100%;

    margin-bottom: 30px;

    font-size: 24px;
    line-height: 31px;
    font-weight: 600;
    letter-spacing: 0.01em;

    @include maxWidth($mobile-middle) {
      margin-bottom: 16px;

      font-size: 18px;
      line-height: 21.6px;
      letter-spacing: normal;
    }
  }

  &__tabs {
    justify-content: flex-end;

    margin-bottom: 30px;

    @include maxWidth($mobile-middle) {
      margin-bottom: 24px;
    }
  }

  &__items {
    position: relative;

    width: 100%;

    overflow: hidden;

    @include maxWidth($mobile-middle) {
      overflow: visible;
    }
  }

  &__item-wrapper {
    width: calc(100% + 30px);

    margin-left: -30px;

    &--axes-y {
      display: none;
    }

    @include maxWidth(calc($desktop-small - 1px)) {
      width: calc(100% + 8px);

      margin-left: -8px;

      &--axes-y {
        position: absolute;

        top: 0;
        left: 0;

        z-index: 2;

        display: block;

        background-color: var(--cl-white);

        overflow: hidden;
      }

      &--body {
        overflow: auto;
      }
    }

    @include maxWidth($mobile-middle) {
      width: calc(100% + 8px + var(--space-x-md));

      margin-right: calc(var(--space-x-md) * -1);
    }
  }

  &__item {
    position: relative;

    width: 100%;

    @include beforeForHeight(1280, 405);

    @include maxWidth(calc($desktop-small - 1px)) {
      min-width: 996px;

      &--axes-y {
        // --
      }

      &--body {
        z-index: 1;
      }
    }

    @include maxWidth($mobile-middle) {
      padding-right: var(--space-x-md);
    }
  }

  &__bar {
    position: absolute;

    top: 0;
    left: 0;

    z-index: 1;

    width: 100%;
    height: 100%;
  }

  &__legend {
    width: 100%;

    margin-top: 30px;

    padding-left: var(--axes-y-width, 0);

    @include maxWidth($mobile-middle) {
      margin-top: 16px;

      padding-left: 0;
    }
  }
}
</style>

