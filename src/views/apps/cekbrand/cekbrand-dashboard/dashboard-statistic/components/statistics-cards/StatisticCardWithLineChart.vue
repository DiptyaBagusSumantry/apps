<template>
  <b-card no-body>
    <b-card-body class="d-flex pb-0">
      <div class="d-flex flex-column">
        <b-avatar
          class="mb-1"
          :variant="`light-${avatarVariant || variant}`"
          :style="{
            backgroundColor: avatarColor !== undefined ? `${avatarColor}1F` : null,
            color: avatarColor !== undefined ? avatarColor : null,
          }"
          size="40"
        >
          <feather-icon
            size="16"
            :icon="icon"
          />
        </b-avatar>
        <div class="truncate mb-1">
          <h2
            class="mb-25 font-weight-bolder"
            :class="[`text-${parseFloat(statistic) >= 0 ? 'black' : 'danger'}`]"
          >
            {{ statistic }}
          </h2>
          <span class="d-block">{{ statisticTitle }}</span>
          <small
            v-if="statisticGrowth"
            class="font-small-3"
          >
            <span :class="[`text-${parseFloat(statisticGrowth) >= 0 ? 'success' : 'danger'}`]">
              {{ parseFloat(statisticGrowth) >= 0 ? '+' : '-' }}
               {{ Math.abs(parseFloat(statisticGrowth)) }}{{ statisticGrowth.includes('%') ? '%' : '' }}</span> {{ statisticSubtitle }}
          </small>
        </div>
      </div>
      <div class="ml-auto">
        <feather-icon
          :id="`${statisticTitle.toLowerCase()}-help-icon`"
          icon="HelpCircleIcon"
          size="20"
          class="text-muted cursor-pointer"
        />
      </div>
    </b-card-body>

    <vue-apex-charts
      type="line"
      height="100"
      width="100%"
      :options="chartOptionsComputed"
      :series="seriesData"
    />

  </b-card>
</template>

<script>
import { BCard, BCardBody, BAvatar, BTooltip } from 'bootstrap-vue'
import VueApexCharts from 'vue-apexcharts'
import { $themeColors } from '@themeConfig'
import { lineChartOptions } from './chartOptions'
import { formatDate } from '@core/utils/filter'

export default {
  components: {
    VueApexCharts,
    BCard,
    BCardBody,
    BAvatar,
    BTooltip,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticGrowth: {
      type: [Number, String],
      default: null,
    },
    statisticTitle: {
      type: String,
      required: true,
    },
    statisticSubtitle: {
      type: String,
      required: true,
    },
    avatarVariant: {
      type: String,
      required: false,
    },
    avatarColor: {
      type: String,
      required: false,
    },
    variant: {
      type: String,
      default: 'primary',
    },
    color: {
      type: String,
      required: false,
    },
    colorGradient: {
      type: String,
      required: false,
    },
    seriesData: {
      type: Array,
      default: () => [],
    },
    chartOptions: {
      type: Object,
      default: null,
    },
  },
  computed: {
    chartOptionsComputed() {
      if (this.chartOptions === null) {
        const options = JSON.parse(JSON.stringify(lineChartOptions))

        options.fill.gradient.gradientToColors = [this.colorGradient || this.gradientToColor(this.variant)]
        options.colors = [this.color || $themeColors[this.variant]]
        options.tooltip = {
          x: {
            formatter: val => formatDate(val, { month: 'short', day: '2-digit' })
          },
          y: {
            formatter: val => Number(val)
          },
        }
        return options
      }
      return this.chartOptions
    },
  },
  methods: {
    gradientToColor(color) {
      const gradientToColors = {
        primary: '#8739E5',
        success: '#55DD92',
        warning: '#FFDF40',
        danger: '#F5317F',
        info: '#15EDED',
        secondary: '#B4B9BF',
        light: '#D0D4DB',
        dark: '#919191',
      }

      return gradientToColors[color]
    },
  },
}
</script>
