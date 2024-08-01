<template>
  <div class="dashboard-kompetitor-performa">
    <b-card
      class="performa-container mx-1"
      :class="{
        'main-account': mainAccount
      }"
      no-body
    >
      <div
        v-for="(insight, index) in insightsList"
        :key="index"
      >
        <div
          v-if="insightsData.average && insightsData.growth"
          class="d-flex flex-column align-items-center justify-content-between"
        >
          <p class="font-weight-bolder">
            {{ insight.label }}
          </p>
          <div class="font-weight-bolder">
            <h1 v-if="insightsData.average[insight.key] !== null">
              {{
                insight.key !== 'engagementRate' ?
                  nFormatter(insightsData.average[insight.key].toFixed(0), 1)
                  : `${parseFloat(insightsData.average[insight.key]).toFixed(2)}%`
              }}
            </h1>
            <h1 v-else>
              -
            </h1>
          </div>
          <span class="font-weight-bolder mt-25">
            <span
              v-if="insightsData.growth[insight.key] !== null"
              :class="[insightsData.growth[insight.key] >= 0 ? 'text-success' : 'text-danger']">
              {{ insightsData.growth[insight.key] >= 0 ? '+' : '-' }}
              {{
                insight.key !== 'engagementRate' ?
                  insight.key === 'latestFollowersCount' ? nFormatter(Math.abs(insightsData.growth[insight.key]), 1) : nFormatter(Math.abs(insightsData.growth[insight.key]).toFixed(1), 1)
                  : `${Math.abs(parseFloat(insightsData.growth[insight.key])).toFixed(2)}%`
              }}
            </span>
            <span v-else>
              -
            </span>
          </span>
          <div class="text-gray-500 font-small-2 d-flex flex-column align-items-center mt-25">
            <span>
              vs
            </span>
            <span>
              {{ resolveDateFilter(insight.key) }}
            </span>
          </div>
        </div>
        <div
          v-else
          class="d-flex d-flex-column align-items-center justify-content-around w-full h-100"
        >
          <h1 class="font-weight-bolder">
            -
          </h1>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import { computed, onMounted, watch } from '@vue/composition-api'
import { BCard } from 'bootstrap-vue'
import store from '@/store'

import useDashboardKompetitor from './useDashboardKompetitor'
import useDashboardKompetitorPerforma from './useDashboardKompetitorPerforma'

export default {
  components: {
    BCard
  },
  props: {
    competitorData: {
      type: Object,
      default: () => {},
    },
    mainAccount: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, context) {
    const insightsList = [
      {
        label: 'Avg. Engagement Rate',
        key: 'engagementRate'
      },
      {
        label: 'Followers',
        key: 'latestFollowersCount'
      },
      {
        label: 'Rata-Rata Like',
        key: 'likeCounts'
      },
      {
        label: 'Rata-Rata Comment',
        key: 'commentsCounts'
      }
    ]

    const {
      // Refs
      insightsData,

      // Computed
      activeAccountData,

      // Methods
      getAccountInsightsData,
      getCompetitorAccountInsightsData,
    } = useDashboardKompetitorPerforma(props, context)

    onMounted(async () => {
      if (props.mainAccount) {
        insightsData.value = getAccountInsightsData()
      } else {
        insightsData.value = await getCompetitorAccountInsightsData(props.competitorData)
      }
    })

    // Watch
    watch(activeAccountData, () => {
      if (props.mainAccount) {
        insightsData.value = getAccountInsightsData()
      }
    })

    watch(() => props.competitorData, async (competitorData, prevCompetitorData) => {
      insightsData.value = await getCompetitorAccountInsightsData(competitorData)
    })

    const {
      // Methods
      nFormatter,
      toPercent,
      resolveDateFilter,
    } = useDashboardKompetitor()

    return {
      insightsList,

      // Refs
      insightsData,

      // Methods
      nFormatter,
      toPercent,
      resolveDateFilter
    }
  }
}
</script>
