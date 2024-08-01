<template>
  <div class="dashboard-kompetitor-top-hashtag">
    <b-card
      v-if="topHashtagData.length !== 0"
      class="top-hashtag-container mx-1 my-0"
      :class="{
        'main-account': mainAccount
      }"
      no-body
    >
      <div
        v-for="(value, index) in topHashtagData"
        :key="`contain-${index}`"
      >
        <div class="d-flex flex-column text-center">
          <h3 class="hashtag d-flex justify-content-start font-weight-bolder text-black mb-50">
            {{ value.hashtag .length >= 13 ? `${value.hashtag.substring(0,13) + "..."}` : value.hashtag }}
          </h3>
          <div class="d-flex text-danger justify-content-start align-items-center">
            <feather-icon
              icon="HeartIcon"
              size="16"
            />
            <span class="text-black ml-25 mr-1 font-medium-2">
              {{ value.like_count !== null ?  value.like_count : '' }}
            </span>
            <feather-icon
              icon="MessageSquareIcon"
              size="16"
              stroke="#7A62F9"
            />
            <span class="text-black ml-25 font-medium-2">
              {{ value.comments_count !== null ? value.comments_count : '' }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-for="(value, index) in 5 - topHashtagData.length"
        :key="`empty-${index}`"
      >
        <div class="d-flex flex-column text-center">
          <h1 class="font-weight-bolder">
            -
          </h1>
        </div>
      </div>
    </b-card>
    <b-card
      class="top-hashtag-container mx-1 my-0"
      :class="{
        'main-account': mainAccount
      }"
      no-body
      v-else
    >
      <div
        v-for="index in 5"
        :key="`empty-${index}`"
        class="p-0"
      >
        <div class="d-flex justify-content-center align-items-center">
          <h3 class="font-weight-bolder m-0">
            -
          </h3>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
import { computed, watch, onMounted } from '@vue/composition-api'
import store from '@/store'

import useDashboardKompetitorTopHashtag from './useDashboardKompetitorTopHashtag'

import { BCard, BOverlay } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BOverlay,
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
  setup(props, context) {
    const {
      // Refs
      topHashtagData,

      // Computed
      activeAccountData,

      // Method
      callCompetitorHashtag
    } = useDashboardKompetitorTopHashtag(props)

    // Computed
    const windowWidth = computed(() => store.state['app'].windowWidth)

    // Watch
    watch(() => props.competitorData, (competitorData, prevCompetitorData) => {
      callCompetitorHashtag(competitorData)
    })

    onMounted(() => {
      callCompetitorHashtag(props.competitorData)
    })

    return {
      // Refs
      topHashtagData,

      // Computed
      windowWidth,
    }

  }
}
</script>
