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

import statisticByMonth from '~/data/statistic-by-month.json';
import statisticByWeek from '~/data/statistic-by-week.json';
import statisticByYear from '~/data/statistic-by-year.json';

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
  LinearScale,
  chartJsPlugins.chartAreaBackgroundColor
);

// Font of Chart
ChartJS.defaults.font.family = "'Arial', sans-serif";
ChartJS.defaults.font.weight = 400;

// Options for AxisY Chart
const OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 27,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      border: {
        width: 0,
      },
      ticks: {
        padding: 15,
        color: '#6C6C6C',
      },
      grid: {
        display: false,
        // drawTicks: false,
        // drawBorder: false,
      },
    },
    y: {
      border: {
        width: 0,
      },
      ticks: {
        padding: 30,
        color: '#6C6C6C',
        beginAtZero: true,
        callback: (value, index, values) => {
          return priceFormatter(value);
        },
      },
      grid: {
        display: false,
        // drawTicks: false,
        // drawBorder: false,
      },
    },
  },
};

// Options for Body Chart
const OPTIONS_BODY = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      bottom: 27,
    },
  },
  plugins: {
    legend: {
      display: false,
    },

    // Tooltips
    tooltip: {
      mode: 'index',
      usePointStyle: true,
      pointStyle: 'circle',
      boxWidth: 12,
      boxHeight: 12,
      borderWidth: 0,
      caretSize: 0,
      titleColor: '#222222',
      titleSpacing: 5,
      titleMarginBottom: 5,
      bodyColor: '#222222',
      bodySpacing: 5,
      cornerRadius: 4,
      backgroundColor: '#ffffff',
      callbacks: {
        label: (context) => {
          return ` ${priceFormatter(context.parsed.y)}`;
        },
      },
    },

    // Background Color
    chartAreaBackgroundColor: {
      color: '#F7F7F7',
      borderRadius: 30,
      top: -15,
      bottom: 42,
    },
  },
  scales: {
    x: {
      border: {
        width: 0,
      },
      ticks: {
        padding: 15,
        color: '#6C6C6C',
      },
      grid: {
        display: false,
        // drawTicks: false,
        // drawBorder: false,
      },
    },
    y: {
      border: {
        width: 0,
      },
      ticks: {
        padding: 30,
        color: '#6C6C6C',
        beginAtZero: true,
        callback: (value, index, values) => {
          return priceFormatter(value);
        },
      },
      grid: {
        display: false,
        // drawTicks: false,
        // drawBorder: false,
      },

      // Set width of container with pinned axesY
      afterFit: (ctx) => {
        axesYWidth.value = ctx?.width || 0;
      },
    },
  },

  // Elements of Chart Body
  elements: {
    bar: {
      borderRadius: 6,
      borderSkipped: false,
    },
  },
};

// Legends
const LEGENDS = {
  purchasePlan: {
    label: 'Purchase Plan',
    backgroundColor: '#2D9CDB',
  },
  purchased: {
    label: 'Purchased',
    backgroundColor: '#4C725D',
  },
  returns: {
    label: 'Returns',
    backgroundColor: '#F6AB81',
  },
};

// Tabs
const TABS = [
  {
    key: 'week',
    title: 'By week',
  },
  {
    key: 'month',
    title: 'By month',
  },
  {
    key: 'year',
    title: 'By year',
  },
];

// Months
const MONTHS = [
  { name: 'January' },
  { name: 'February' },
  { name: 'March' },
  { name: 'April' },
  { name: 'May' },
  { name: 'June' },
  { name: 'July' },
  { name: 'August' },
  { name: 'September' },
  { name: 'October' },
  { name: 'November' },
  { name: 'December' },
];

const router = useRouter();
const route = useRoute();

// Current period
const currentTab = computed<'week' | 'month' | 'year'>({
  get: () => route.query?.period || 'week',
  set: (value) => {
    if (value !== route.query?.period) {
      router.push({
        query: {
          ...(route?.query || {}),
          period: value,
        },
      });
    }
  },
});

// Width of axesY
const axesYWidth = ref(null);

// Dynamic data
const { data, pending, refresh } = await useAsyncData(
  'get-chart-data',
  () => {
    switch (currentTab.value) {
      case 'week':
        return statisticByWeek;

      case 'month':
        return statisticByMonth;

      case 'year':
        return statisticByYear;

      default:
        return null;
    }
  },
  {
    lazy: true,
    watch: [currentTab],
    transform: (input) => {
      if (!input) {
        return input;
      }

      const dataForChart = {
        labels: [],
        purchasePlan: [],
        purchased: [],
        returns: [],
      };

      (input?.group || []).forEach((item) => {
        // Label for current period type
        let label = '*';

        switch (currentTab.value) {
          case 'week':
            label = `${dateFormatter(item.from_date)}-${dateFormatter(
              item.to_date
            )}`;

            break;

          case 'month':
            label = MONTHS.find(
              (m, index) => index === new Date(item.from_date).getMonth()
            )?.name;

            break;

          case 'year':
            label = new Date(item.from_date).getFullYear();

            break;

          default:
            break;
        }

        // Push all
        dataForChart.labels.push(label);
        dataForChart.purchasePlan.push(item.data.purchase_plan);
        dataForChart.purchased.push(item.data.purchased);
        dataForChart.returns.push(item.data.returns);
      });

      return dataForChart;
    },
  }
);

// Reactive Chart Data
const chartData = computed(() => ({
  labels: data.value?.labels || [],
  datasets: [
    {
      ...LEGENDS.purchasePlan,
      data: data.value?.purchasePlan || [],
    },
    {
      ...LEGENDS.purchased,
      data: data.value?.purchased || [],
    },
    {
      ...LEGENDS.returns,
      data: data.value?.returns || [],
    },
  ],
}));
</script>

<template>
  <div class="charts">
    <h3 class="charts__title">Charts by period</h3>

    <ChartTabs v-model="currentTab" :tabs="TABS" class="charts__tabs" />

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
            :data="chartData"
            :options="OPTIONS"
            class="charts__bar charts__bar--axes-y"
          />
        </div>
      </div>

      <div class="charts__item-wrapper charts__item-wrapper--body">
        <div class="charts__item charts__item--body">
          <Bar
            :data="chartData"
            :options="OPTIONS_BODY"
            class="charts__bar charts__bar--body"
          />
        </div>
      </div>

      <ul
        class="charts__legend charts-legend"
        :style="{ '--axes-y-width': axesYWidth ? `${axesYWidth}px` : 'unset' }"
      >
        <li
          v-for="(item, key) in LEGENDS"
          :key="key"
          class="charts-legend__item"
        >
          <span
            class="charts-legend__circle"
            :style="{
              backgroundColor: item.backgroundColor,
            }"
          />

          <h6 class="charts-legend__title">
            {{ item.label }}
          </h6>
        </li>
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

.charts-legend {
  display: flex;

  align-items: center;
  justify-content: center;

  column-gap: 40px;

  font-size: 14px;
  line-height: 18.2px;
  font-weight: 400;

  color: var(--cl-black);

  @include maxWidth($mobile-middle) {
    column-gap: 16px;

    line-height: 20px;
  }

  &__item {
    display: flex;

    align-items: center;
    justify-content: center;

    column-gap: 10px;
  }

  &__circle {
    flex-shrink: 0;

    width: 12px;
    height: 12px;

    border-radius: 50%;

    @include maxWidth($mobile-middle) {
      width: 8px;
      height: 8px;
    }
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

        background-color: #ffffff;

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

