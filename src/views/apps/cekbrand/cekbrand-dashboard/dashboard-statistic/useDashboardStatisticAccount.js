import { ref, computed } from '@vue/composition-api'
import { $themeColors } from '@themeConfig'
import { formatDate } from '@core/utils/filter'
import { minBy } from 'lodash'
import { datesAreOnSameDate } from '@core/utils/utils'
import 'vue-flatpickr-component'
import store from '@/store'

export default function useDashboardStatistic() {
  // References
  const followerGrowthRate = ref(null)
  const followerGrowthRateGrowth = ref(null)
  const reachAverage = ref(null)
  const reachAverageGrowth = ref(null)
  const reachSeriesData = ref([])
  const impressionsAverage = ref(null)
  const impressionsAverageGrowth = ref(null)
  const impressionsSeriesData = ref([])
  const likeCommentSeriesData = ref([])
  const engagementGrowthRate = ref(null)
  const engagementGrowthRateGrowth = ref(null)
  const engagementGrowthRateSeriesData = ref([])

  // Computed
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const followersCountSeriesData = computed(() => {
    const seriesData = []
    activeAccountData.value.userData.forEach(data => {
      if (data.followers_count !== null) {
        seriesData.push({
          x: new Date(data.updated_timestamp),
          y: data.followers_count,
        })
      }
    })
    return seriesData
  })
  const followersGrowthSeriesData = computed(() => {
    const seriesData = []
    activeAccountData.value.userData.forEach(data => {
      if (data.followers_count_growth !== null) {
        seriesData.push({
          x: new Date(data.updated_timestamp),
          y: data.followers_count_growth,
        })
      }
    })
    return seriesData
  })
  const mediaCountSeriesData = computed(() => {
    const seriesData = []
    activeAccountData.value.userData.forEach(data => {
      if (data.media_count !== null) {
        seriesData.push({
          x: new Date(data.updated_timestamp),
          y: data.media_count,
        })
      }
    })
    return seriesData
  })
  const mediaGrowthSeriesData = computed(() => {
    const seriesData = []
    activeAccountData.value.userData.forEach(data => {
      if (data.media_count_growth !== null) {
        seriesData.push({
          x: new Date(data.updated_timestamp),
          y: data.media_count_growth,
        })
      }
    })
    return seriesData
  })
  const likeSeriesData = computed(() => likeCommentSeriesData.value.map(data => ({
    x: data.x,
    y: data.y.like_count,
  })))
  const commentsSeriesData = computed(() => likeCommentSeriesData.value.map(data => ({
    x: data.x,
    y: data.y.comments_count,
  })))
  const engagementSeriesData = computed(() => likeCommentSeriesData.value.map(data => ({
    x: data.x,
    y: data.y.like_count + data.y.comments_count,
  })))
  // Charts Data
  const followersGrowthChartData = computed(() => ({
    series: [
      {
        name: 'Follower Baru',
        data: followersGrowthSeriesData.value,
      },
    ],
  }))
  const mediaGrowthChartData = computed(() => ({
    series: [
      {
        name: 'Konten Terposting',
        data: mediaGrowthSeriesData.value,
      },
    ],
  }))
  const reachChartData = computed(() => ({
    series: [
      {
        name: 'Reach',
        data: reachSeriesData.value,
      },
    ],
  }))
  const impressionsChartData = computed(() => ({
    series: [
      {
        name: 'Impression',
        data: impressionsSeriesData.value,
      },
    ],
  }))
  const engagementGrowthRateChartData = computed(() => ({
    series: [
      {
        name: 'Engagement Rate',
        data: engagementGrowthRateSeriesData.value,
      },
    ],
    chartOptions: {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: true },
        type: 'line',
        offsetX: -10,
      },
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      grid: {
        borderColor: '#ebe9f1',
        padding: {
          top: -20,
          bottom: 5,
          left: 20,
        },
      },
      legend: {
        show: false,
      },
      colors: [$themeColors.warning],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
          gradientToColors: ['#ffdf40'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },
      xaxis: {
        labels: {
          offsetY: 5,
          style: {
            colors: '#b9b9c3',
            fontSize: '0.857rem',
          },
          formatter: val => formatDate(val, { month: '2-digit', day: '2-digit' }),
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        tickPlacement: 'on',
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.857rem',
          },
          formatter(val) {
            return `${(val * 100).toFixed(2)}%`
          },
        },
      },
      tooltip: {
        x: { show: false },
      },
    },
  }))
  const followerGrowthRateChartData = computed(() => ({
    series: [
      {
        name: 'Followers',
        data: followersCountSeriesData.value,
      },
    ],
    chartOptions: {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: 'line',
        offsetX: -10,
      },
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      grid: {
        borderColor: '#ebe9f1',
        padding: {
          top: -20,
          bottom: 5,
          left: 20,
        },
      },
      legend: {
        show: false,
      },
      colors: ['#b122e5'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
          gradientToColors: ['#ff63de'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100],
        },
      },
      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },
      xaxis: {
        labels: {
          offsetY: 5,
          style: {
            colors: '#b9b9c3',
            fontSize: '0.857rem',
          },
          formatter: val => formatDate(val, { month: '2-digit', day: '2-digit' }),
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        tickPlacement: 'on',
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          style: {
            colors: '#b9b9c3',
            fontSize: '0.857rem',
          },
        },
      },
      tooltip: {
        x: { show: false },
        y: {
          formatter: val => Number(val),
        },
      },
    },
  }))
  const engagementAreaChartData = computed(() => ({
    series: [
      {
        name: 'Engagement',
        data: engagementSeriesData.value,
      },
      {
        name: 'Like',
        data: likeSeriesData.value,
      },
      {
        name: 'Comment',
        data: commentsSeriesData.value,
      },
    ],
    chartOptions: {
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'straight',
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '12.8px',
        fontFamily: 'Montserrat',
        fontWeight: 300,
        inverseOrder: true,
        markers: {
          width: 32,
          height: 16,
          radius: 4,
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        labels: {
          formatter: val => formatDate(val, { month: '2-digit', day: '2-digit' }),
        },
      },
      // yaxis: {
      //   // opposite: isRtl
      //   forceNiceScale: true,
      // },
      yaxis: [
        {
          seriesName: 'Engagement',
          title: {
            text: 'Engagement',
            style: {
              fontSize: '12.8px',
              fontFamily: 'Montserrat',
              fontWeight: 600,
            },
          },
          opposite: true,
          forceNiceScale: true,
          min: () => {
            if (engagementSeriesData.value.length) {
              return minBy(engagementSeriesData.value, 'y').y
            }
            return 0
          },
        },
        {
          seriesName: 'Like',
          title: {
            text: 'Like',
            style: {
              fontSize: '12.8px',
              fontFamily: 'Montserrat',
              fontWeight: 600,
            },
          },
          opposite: false,
          forceNiceScale: true,
          min: () => {
            if (likeSeriesData.value.length) {
              return minBy(likeSeriesData.value, 'y').y
            }
            return 0
          },
        },
        {
          seriesName: 'Comment',
          title: {
            text: 'Comment',
            style: {
              fontSize: '12.8px',
              fontFamily: 'Montserrat',
              fontWeight: 600,
            },
          },
          opposite: false,
          forceNiceScale: true,
          min: () => {
            if (commentsSeriesData.value.length) {
              return minBy(commentsSeriesData.value, 'y').y
            }
            return 0
          },
        },
      ],
      fill: {
        opacity: 0.6,
        type: 'solid',
      },
      tooltip: {
        shared: false,
      },
      colors: ['#4e6b81', $themeColors.primary, '#84d0ff'],
    },
  }))

  // Methods
  const fetchActiveAccountUserDataSummary = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountUserDataSummary')
      .then(response => {
        followerGrowthRate.value = response.data.followers_growth_rate
        followerGrowthRateGrowth.value = response.data.followers_growth_rate_growth
        resolve()
      })
      .catch(() => resolve())
  })
  const fetchActiveAccountInsightReachAverageSummary = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightReachAverageSummary')
      .then(response => {
        reachAverage.value = response.data.reach_average
        reachAverageGrowth.value = response.data.reach_average_growth
        resolve()
      })
      .catch(() => resolve())
  })
  const getReachSeriesData = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightsReach')
      .then(response => resolve(response.data.map(data => ({
        x: new Date(data.end_time),
        y: data.value,
      }))))
      .catch(() => resolve([]))
  })
  const fetchActiveAccountInsightsImpressionsAverageSummary = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightsImpressionsAverageSummary')
      .then(response => {
        impressionsAverage.value = response.data.impressions_average
        impressionsAverageGrowth.value = response.data.impressions_average_growth
        resolve()
      })
      .catch(() => resolve())
  })
  const getImpressionsSeriesData = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountInsightsImpressions')
      .then(response => resolve(response.data.map(data => ({
        x: new Date(data.end_time),
        y: data.value,
      }))))
      .catch(() => resolve([]))
  })
  const getLikeCommentSeriesData = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountMediaEngagement')
      .then(response => resolve(response.data.map(data => ({
        x: data.updated_datestamp,
        y: {
          like_count: data.like_count,
          comments_count: data.comments_count,
          like_count_growth: data.like_count_growth,
          comments_count_growth: data.comments_count_growth,
        },
      }))))
  })
  const fetchActiveAccountMediaEngagementSummary = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountMediaEngagementSummary')
      .then(response => {
        engagementGrowthRate.value = response.data.engagement_growth_rate
        engagementGrowthRateGrowth.value = response.data.engagement_growth_rate_growth
        resolve()
      })
      .catch(() => resolve())
  })
  const getEngagementGrowthRateSeriesData = () => new Promise(resolve => {
    const seriesData = []
    followersCountSeriesData.value.forEach(followerData => {
      const likeCommentData = likeCommentSeriesData.value.find(data => datesAreOnSameDate(data.x, followerData.x))
      if (likeCommentData !== undefined) {
        const engagementGrowth = likeCommentData.y.like_count_growth + likeCommentData.y.comments_count_growth
        seriesData.push({
          x: followerData.x,
          y: engagementGrowth / followerData.y,
        })
      }
    })
    resolve(seriesData)
  })
  const calculatePerformaStatistics = async () => {
    await fetchActiveAccountUserDataSummary()
    await fetchActiveAccountInsightReachAverageSummary()
    reachSeriesData.value = await getReachSeriesData()
    await fetchActiveAccountInsightsImpressionsAverageSummary()
    impressionsSeriesData.value = await getImpressionsSeriesData()
    likeCommentSeriesData.value = await getLikeCommentSeriesData()
    await fetchActiveAccountMediaEngagementSummary()
    engagementGrowthRateSeriesData.value = await getEngagementGrowthRateSeriesData()
  }

  return {
    // Computed
    activeAccountData,
    followersCountSeriesData,
    followersGrowthSeriesData,
    followersGrowthChartData,
    followerGrowthRate,
    followerGrowthRateChartData,
    followerGrowthRateGrowth,
    mediaCountSeriesData,
    mediaGrowthSeriesData,
    mediaGrowthChartData,
    reachAverage,
    reachAverageGrowth,
    reachSeriesData,
    reachChartData,
    impressionsSeriesData,
    impressionsAverage,
    impressionsAverageGrowth,
    impressionsChartData,
    engagementGrowthRate,
    engagementGrowthRateGrowth,
    engagementGrowthRateSeriesData,
    engagementGrowthRateChartData,
    engagementAreaChartData,

    // Methods
    calculatePerformaStatistics,
  }
}
