<template>
  <div class="social-account-card d-flex flex-column">
    <div class="d-flex mb-1">
      <b-avatar
        :src="data.profile_picture_url"
        size="80"
        badge-variant="info"
      >
        <template #badge>
          <b-img :src="require('@/assets/images/icons/instagram.svg')" />
        </template>
      </b-avatar>
      <div class="ml-3">
        <div class="mb-50 line-height-condensed">
          <span class="mb-0 font-small-3 text-gray-500">
            Username:
          </span>
          <p class="font-weight-bolder text-primary mb-0">
            @{{ data.username }}
          </p>
        </div>
        <div class="line-height-condensed">
          <div>
            <feather-icon
              size="14"
              icon="LinkIcon"
            />
            <span class="font-small-3 text-gray-500">
              Facebook:
            </span>
          </div>
          <div>
            <b-avatar
              src="https://placekitten.com/300/300"
              size="16"
              badge-variant="info"
            />
            <span class="font-small-2 text-black">
              {{ data.social_account.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div>
      <b-row class="mb-2">
        <b-col>
          <div class="d-flex flex-column line-height-1">
            <span class="line-height-inherit font-small-2 text-gray-500">
              Follower
            </span>
            <span class="font-medium-4 font-weight-bolder my-25">
              {{ followers !== null ? nFormatter(followers, 1) : '-' }}
            </span>
            <small
              v-if="followersGrowth !== null"
              :class="[
                `text-${followersGrowth >= 0 ? 'success' : 'danger'}`, 'font-small-2'
              ]"
            >
              {{ followersGrowth >= 0 ? '+' : '' }}{{ followersGrowth }}
            </small>
            <small v-else class="font-small-2">-</small>
          </div>
        </b-col>
        <b-col>
          <div class="d-flex flex-column line-height-1">
            <span class="line-height-inherit font-small-2 text-gray-500">
              Engagement Rate
            </span>
            <span class="font-medium-4 font-weight-bolder my-25">
              {{ engagementGrowthRate !== null ? `${parseFloat(engagementGrowthRate).toFixed(2)} %` : '-' }}
            </span>
            <small
              v-if="engagementGrowthRateGrowth !== null"
              :class="[
                `text-${parseFloat(engagementGrowthRateGrowth) >= 0 ? 'success' : 'danger'}`, 'font-small-2'
              ]"
            >
              {{ parseFloat(engagementGrowthRateGrowth) >= 0 ? '+' : '' }}{{ engagementGrowthRateGrowth !== null ? `${parseFloat(engagementGrowthRateGrowth).toFixed(2)} %` : '-' }}
            </small>
            <small v-else class="font-small-2">-</small>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div class="d-flex flex-column line-height-1">
            <span class="line-height-inherit font-small-2 text-gray-500">
              Reach
            </span>
            <span class="font-medium-4 font-weight-bolder my-25">
              {{ reach !== null ? nFormatter(reach, 1) : '-' }}
            </span>
            <small
              v-if="reachGrowth !== null"
              :class="[
                `text-${reachGrowth >= 0 ? 'success' : 'danger'}`, 'font-small-2'
              ]"
            >
              {{ reachGrowth >= 0 ? '+' : '' }}{{ reachGrowth !== null ? nFormatter(reachGrowth, 1) : '-' }}
            </small>
            <small v-else class="font-small-2">-</small>
          </div>
        </b-col>
        <b-col>
          <div class="d-flex flex-column line-height-1">
            <span class="font-small-2 text-gray-500">
              Impression
            </span>
            <span class="font-medium-4 font-weight-bolder my-25">
              {{ impressions !== null ? nFormatter(impressions, 1) : '-' }}
            </span>
            <small
              v-if="impressionsGrowth !== null"
              :class="[
                `text-${impressionsGrowth >= 0 ? 'success' : 'danger'}`, 'font-small-2'
              ]"
            >
              {{ impressionsGrowth >= 0 ? '+' : '' }}{{ impressionsGrowth !== null ? nFormatter(impressionsGrowth, 1) : '-' }}
            </small>
            <small v-else class="font-small-2">-</small>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="mt-auto">
      <p class="line-height-condensed font-small-2 text-gray-500 mb-0">
        Di-update pada:
        {{ formatDate(data.updated_timestamp, { year: 'numeric', month: 'numeric', day: 'numeric' }) }}
      </p>
      <p class="line-height-inherit font-small-2 text-gray-500">
        Dibandingkan dengan:
        {{ formatDate(new Date(data.updated_timestamp).fp_incr(-2), { year: 'numeric', month: 'numeric', day: 'numeric' }) }}
      </p>
    </div>
    <div>
      <b-button
        class="w-100 d-flex justify-content-center"
        variant="primary"
        :to="{ name: 'apps-cekbrand-dashboard', params: { username: data.username } }"
      >
        <span class="mr-2">
          Lihat Selengkapnya
        </span>
        <feather-icon
          size="14"
          icon="ChevronRightIcon"
        />
      </b-button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from '@vue/composition-api'
import { BAvatar, BButton, BCol, BImg, BRow } from 'bootstrap-vue'
import { formatDate, nFormatter } from '@core/utils/filter'
import { datesAreOnSameDate } from '@core/utils/utils'
import store from '@/store'
import 'vue-flatpickr-component'

import useCekbrand from '../useCekbrand'

export default {
  components: {
    BAvatar,
    BButton,
    BCol,
    BImg,
    BRow,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, context) {
      // Computed
      const dateQueryParams = computed(() => store.getters['cekbrand/dateQueryParams'])

    const {
      fetchUserAccountInsightsReach,
      fetchUserAccountInsightsImpressions,
      fetchUserAccountMediaEngagement,
      fetchUserAccountUserData,
    } = useCekbrand(props, context)

    const userDataList = ref(null)
    const followers = ref(null)
    const followersGrowth = ref(null)
    const engagementGrowthRate = ref(null)
    const engagementGrowthRateGrowth = ref(null)
    const reach = ref(null)
    const reachGrowth = ref(null)
    const impressions = ref(null)
    const impressionsGrowth = ref(null)

    onMounted(async () => {
      await fetchUserAccountUserData(props.data.id, dateQueryParams.value)
        .then(response => {
          if (response.data.length) {
            // Latest data
            const [userData] = response.data.slice(-1)
            const userDataBefore = response.data.find(data => datesAreOnSameDate(
              data.updated_timestamp,
              new Date(props.data.updated_timestamp).fp_incr(-2)
            ))
            followers.value = userData.followers_count
            if (userDataBefore !== undefined) {
              followersGrowth.value = followers.value - userDataBefore.followers_count
            }
          }
          userDataList.value = response.data
        })
      fetchUserAccountMediaEngagement(props.data.id, dateQueryParams.value)
        .then(response => {
          if (response.data.length && userDataList.value.length) {
            // Latest data
            const [engagementData] = response.data.slice(-1)
            const userData = userDataList.value.find(data => datesAreOnSameDate(
              data.updated_timestamp,
              engagementData.updated_datestamp,
            ))
            const engagementDataBefore = response.data.find(data => datesAreOnSameDate(
              data.updated_datestamp,
              new Date(props.data.updated_timestamp).fp_incr(-2)
            ))
            const userDataBefore = userDataList.value.find(data => datesAreOnSameDate(
              data.updated_timestamp,
              new Date(props.data.updated_timestamp).fp_incr(-2)
            ))
            if (engagementData !== undefined && userData !== undefined) {
              engagementGrowthRate.value = (
                engagementData.like_count_growth + engagementData.comments_count_growth
              ) / userData.followers_count * 100
              if (engagementDataBefore !== undefined && userDataBefore !== undefined) {
                const engagementGrowthRateBefore = (
                  engagementDataBefore.like_count_growth + engagementDataBefore.comments_count_growth
                ) / userDataBefore.followers_count * 100
                engagementGrowthRateGrowth.value = engagementGrowthRate.value - engagementGrowthRateBefore
              }
            }
          }
        })
      fetchUserAccountInsightsReach(props.data.id, dateQueryParams.value)
        .then(response => {
          if (response.data.length) {
            // Latest data
            const [reachData] = response.data.slice(-1)
            const reachBeforeData = response.data.find(data => datesAreOnSameDate(
              data.end_time,
              new Date(props.data.updated_timestamp).fp_incr(-2)
            ))

            reach.value = reachData.value
            if (reachBeforeData !== undefined) {
              reachGrowth.value = reachData.value - reachBeforeData.value
            }
          }
        })
      fetchUserAccountInsightsImpressions(props.data.id, dateQueryParams.value)
        .then(response => {
          if (response.data.length) {
            // Latest data
            const [impressionsData] = response.data.slice(-1)
            const impressionsBeforeData = response.data.find(data => datesAreOnSameDate(
              data.end_time,
              new Date(props.data.updated_timestamp).fp_incr(-2)
            ))

            impressions.value = impressionsData.value
            if (impressionsBeforeData !== undefined) {
              impressionsGrowth.value = impressionsData.value - impressionsBeforeData.value
            }
          }
        })
    })

    return {
      // Refs
      reach,
      reachGrowth,
      impressions,
      impressionsGrowth,
      followers,
      followersGrowth,
      engagementGrowthRate,
      engagementGrowthRateGrowth,
      // UI
      nFormatter,
      formatDate,
    }
  }
}
</script>

<style lang="scss">
.social-account-card {
  border: 1px solid #C9CBCD;
  border-radius: 4px;
  padding: 16px;
  min-width: 330px;
  height: 360px;

  .b-avatar {
    .b-avatar-badge {
      background-color: transparent;
      padding: 0px !important;
    }
  }
}
</style>
