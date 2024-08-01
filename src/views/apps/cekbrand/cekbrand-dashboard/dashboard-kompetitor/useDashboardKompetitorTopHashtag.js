import { ref, computed } from '@vue/composition-api'
import store from '@/store'

export default function useDashboardKompetitorTopHashtag(props) {
  // Refs
  const topCompetitorHashtagData = ref([])
  // Computed
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const sortedActiveAccountHashtagsMetricsData = computed(() => [...activeAccountData.value.hashtagMetrics]
    .sort((a, b) => (b.like_count + b.comments_count) - (a.like_count + a.comments_count)))
  const topHashtagData = computed(() => {
    if (props.mainAccount) return sortedActiveAccountHashtagsMetricsData.value.slice(0, 5) || []
    return topCompetitorHashtagData.value
  })

  // Method
  const callCompetitorHashtag = competitor => {
    if (competitor && competitor.id) {
      const payload = { competitorId: competitor.id }
      store.dispatch('cekbrand/fetchActiveAccountCompetitorHashtagMetrics', payload)
        .then(response => {
          topCompetitorHashtagData.value = response.data.slice(0, 5)
        })
        .catch(() => {
          topCompetitorHashtagData.value = []
        })
    } else {
      topCompetitorHashtagData.value = []
    }
  }

  return {
    // Refs
    topHashtagData,

    // Computed
    activeAccountData,

    // Method
    callCompetitorHashtag,
  }
}
