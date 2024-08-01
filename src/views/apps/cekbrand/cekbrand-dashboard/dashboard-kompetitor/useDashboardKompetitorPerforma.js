import { ref, computed } from '@vue/composition-api'
import { datesAreOnSameDate } from '@core/utils/utils'
import store from '@/store'

export default function useDashboardKompetitorPerforma() {
  // Refs
  const insightsData = ref({})
  const followersCountGrowth = ref(undefined)
  const followersCountDataSeries = ref(null)

  // Computed
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const latestFollowersCount = computed(() => {
    const latestUserData = activeAccountData.value.userData[activeAccountData.value.userData.length - 1]
    return latestUserData ? latestUserData.followers_count : null
  })
  const dataFrameOptions = computed(() => store.state.cekbrand.dataFrameOptions)
  const dateFilter = computed(() => store.state.cekbrand.dateFilter)
  const dateList = computed(() => store.getters['cekbrand/getDateListByDateFilter']())

  // Methods// Method
  const getFollowersCountDataSeries = allUserData => {
    let defaultFollowersCount = null
    const dataSeries = dateList.value.map(date => {
      let followersCount = defaultFollowersCount
      const userData = allUserData.find(data => datesAreOnSameDate(date, data.updated_timestamp))
      if (typeof userData !== 'undefined') {
        followersCount = userData.followers_count
        defaultFollowersCount = followersCount
      }
      return {
        followersCount,
        datestamp: date,
      }
    })

    const defaultSeriesData = dataSeries.find(data => data.followersCount !== null)
    defaultFollowersCount = defaultSeriesData ? defaultSeriesData.followersCount : null
    return dataSeries.map(data => {
      if (data.followersCount === null) {
        return { ...data, followersCount: defaultFollowersCount }
      } return data
    })
  }

  const getAccountInsightsData = () => {
    followersCountDataSeries.value = getFollowersCountDataSeries(activeAccountData.value.userData)
    const latestUserDataBefore = followersCountDataSeries.value[followersCountDataSeries.value.length - 2]
    followersCountGrowth.value = latestFollowersCount.value !== null ? (latestFollowersCount.value - latestUserDataBefore.followersCount) : latestFollowersCount.value
    const {
      id: accountId,
      mediaEngagementSummary,
    } = activeAccountData.value

    return {
      average: {
        id: accountId,
        latestFollowersCount: latestFollowersCount.value,
        engagementRate: mediaEngagementSummary.engagement_average_rate,
        likeCounts: mediaEngagementSummary.like_average,
        commentsCounts: mediaEngagementSummary.comments_average,
      },
      growth: {
        id: accountId,
        latestFollowersCount: followersCountGrowth.value,
        engagementRate: mediaEngagementSummary.engagement_average_rate_growth,
        likeCounts: mediaEngagementSummary.like_average_growth,
        commentsCounts: mediaEngagementSummary.comments_average_growth,
      },
    }
  }

  const isNotEndDateFilter = date => {
    const dataDate = new Date(date)
    dataDate.setHours(0, 0, 0)

    if (dataFrameOptions.value.includes(dateFilter.value)) {
      const endDate = new Date(new Date().setDate(new Date().getDate() - 2))
      endDate.setHours(0, 0, 0)

      if (dataDate.getTime() <= endDate.getTime()) return true
    } else if (dateFilter.value.length === 2) {
      // Rate range
      const [, endDate] = dateFilter.value.map(d => new Date(d))
      endDate.setDate(endDate.getDate() - 1)
      endDate.setHours(0, 0, 0)

      if (dataDate.getTime() <= endDate.getTime()) return true
    }
    return false
  }

  const getCompetitorAccountInsightsData = competitor => new Promise(resolve => {
    if (!competitor || !competitor.id) {
      resolve(null)
      return
    }
    store.dispatch('cekbrand/fetchActiveAccountCompetitorData', {
      competitorId: competitor.id,
    })
      .then(data => {
        const { userData, mediaEngagementSummary } = data

        let followersCount = null
        let followersCountBefore = null
        if (userData.length > 0) {
          followersCount = userData[userData.length - 1].followers_count
          if (userData.length === 1) {
            followersCountBefore = followersCount
          } else if (isNotEndDateFilter(userData[userData.length - 1].updated_timestamp)) {
            followersCountBefore = userData[userData.length - 1].followers_count
          } else {
            followersCountBefore = userData[userData.length - 2].followers_count
          }
        }

        resolve({
          average: {
            latestFollowersCount: followersCount,
            likeCounts: mediaEngagementSummary.like_average,
            commentsCounts: mediaEngagementSummary.comments_average,
            engagementRate: mediaEngagementSummary.engagement_average_rate,
          },
          growth: {
            latestFollowersCount: followersCount - followersCountBefore,
            likeCounts: mediaEngagementSummary.like_average_growth,
            commentsCounts: mediaEngagementSummary.comments_average_growth,
            engagementRate: mediaEngagementSummary.engagement_average_rate_growth,
          },
        })
      })
      .catch(() => {
        resolve(null)
      })
  })

  return {
    // Refs
    insightsData,

    // Computed
    activeAccountData,

    // Methods
    getAccountInsightsData,
    getCompetitorAccountInsightsData,
  }
}
