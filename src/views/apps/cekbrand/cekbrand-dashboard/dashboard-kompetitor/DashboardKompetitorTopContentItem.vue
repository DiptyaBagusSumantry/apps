<template>
  <div class="dashboard-kompetitor-top-content">
    <b-card
      class="top-content-container mx-1"
      :class="{'main-account': mainAccount}"
      no-body
    >
      <div class="media-content d-flex flex-column justify-content-start align-items-center">
        <b-img
          class="mx-auto mb-1 media-content__image"
          :src="topContentData.media_url"
        />
        <div
          v-if="topContentData.id"
          class="text-center mb-1 d-flex flex-column align-items-center w-full"
        >
          <span class="font-weight-bolder mb-50">
            Jenis Konten
          </span>
          <span>
            {{ topContentData.media_type }}
          </span>
        </div>
        <div
          v-else
          class="text-center mb-3"
        >
          <span>
            -
          </span>
        </div>
        <div
          v-if="topContentData.id"
          class="text-center d-flex flex-column align-items-center w-full"
        >
          <span class="font-weight-bolder mb-50">
            Tanggal Dipost
          </span>
          <span>
            {{ formatDate(topContentData.timestamp, { year: 'numeric', month: 'long', day: '2-digit' }) }}
          </span>
        </div>
        <div
          v-else
          class="text-center mb-3"
        >
          <span>
            -
          </span>
        </div>
      </div>
      <div
        v-for="(value, index) in performaList"
        :key="index"
        class="media-content-performa d-flex align-items-center justify-content-center"
      >
        <div
          v-if="topContentData.id"
          class="grid-item-md d-flex flex-column align-items-center justify-content-around w-full"
        >
          <span class="font-weight-bolder mb-1">
            {{ value.label }}
          </span>
          <div class="font-weight-bolder">
            <h1 v-if="topContentData[value.key] !== null">
              {{ value.key !== 'engagement_rate' ? nFormatter(topContentData[value.key], 1) : `${parseFloat(topContentData.engagement_rate).toFixed(2)}%` }}
            </h1>
            <h1 v-else>
              -
            </h1>
          </div>
          <span class="font-weight-bolder mt-1">
            <!-- Handle opportunity grotwh has value null -->
            <span
              v-if="topContentData[value.keyGrowth] !== null"
              :class="[parseFloat(topContentData[value.keyGrowth]) < 0 ? 'text-danger' : 'text-success']">
              {{ parseFloat(topContentData[value.keyGrowth]) >= 0 ? '+' : '-' }}
              {{ value.key !== 'engagement_rate' ? nFormatter(Math.abs(topContentData[value.keyGrowth]), 1) : `${Math.abs(parseFloat(topContentData[value.keyGrowth])).toFixed(2)}%` }}
            </span>
            <span v-else>
              -
            </span>
          </span>
        </div>
        <div v-else>
          <h1 class="font-weight-bold">
            -
          </h1>
        </div>
      </div>
      <div class="media-content-button d-flex justify-content-center align-items-center py-75">
        <b-button
          v-if="topContentData.id"
          :id="`more-info-button-${topContentData.id}`"
          class="d-flex justify-content-center align-items-center"
          variant="outline-primary"
          :disabled="!$can('read', 'Post')"
          @click="$refs.refMediaDetailModal.showModal()"
        >
          <span class="text-nowrap font-weight-bolder">
            Lebih Lengkap
          </span>
          <feather-icon
            icon="ChevronRightIcon"
            size="20"
            class="ml-50 ml-sm-1"
          />
        </b-button>
      </div>
    </b-card>

    <dashboard-post-media-detail
      ref="refMediaDetailModal"
      :data="topContentData"
      :hideSentiment="!mainAccount"
    />
  </div>
</template>
<script>
import { watch, onMounted } from '@vue/composition-api'
import { formatDate } from '@core/utils/filter'
import { BCard, BImg, BButton, BTooltip } from 'bootstrap-vue'
import DashboardPostMediaDetail from '../dashboard-post/DashboardPostMediaDetail.vue'

import useDashboardKompetitor from './useDashboardKompetitor'
import useDashboardKompetitorTopContent from './useDashboardKompetitorTopContent'

export default {
  components: {
    BCard,
    BImg,
    BButton,
    BTooltip,

    DashboardPostMediaDetail,
  },
  props: {
    mainAccount: {
      type: Boolean,
      default: false,
    },
    competitorData: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const performaList = [
      {
        label: 'Likes',
        key: 'like_count',
        keyGrowth: 'likeCountGrowth'
      },
      {
        label: 'Comments',
        key: 'comments_count',
        keyGrowth: 'commentsCountGrowth'
      },
      {
        label: 'Engagement Rate',
        key: 'engagement_rate',
        keyGrowth: 'engagementRateGrowth'
      },
    ]

    const {
      nFormatter,
    } = useDashboardKompetitor()

    const {
      // Refs
      topContentData,

      // Computed
      activeAccountData,

      // Methods
      getAccountTopContent,
      getCompetitorAccountTopContent,
    } = useDashboardKompetitorTopContent()

    onMounted(async () => {
      if (props.mainAccount) {
        topContentData.value = await getAccountTopContent()
      } else {
        topContentData.value = await getCompetitorAccountTopContent(props.competitorData)
      }
    })

    // Watch
    watch(activeAccountData, async () => {
      if (props.mainAccount) {
        topContentData.value = await getAccountTopContent()
      }
    })

    watch(() => props.competitorData, async (competitorData, prevCompetitorData) => {
      topContentData.value = await getCompetitorAccountTopContent(competitorData)
    })

    return {
      performaList,

      // Refs
      topContentData,

      // Method
      nFormatter,
      formatDate,
    }
  }
}
</script>
