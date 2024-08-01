import { computed } from '@vue/composition-api'
import { take, orderBy } from 'lodash'
import store from '@/store'

export default function useDashboardPost() {
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const latestFollowersCount = computed(() => {
    const { userData } = activeAccountData.value
    if (userData.length > 0) {
      return userData.slice(-1)[0].followers_count
    }
    return null
  })

  const getMediaEngagementRate = data => {
    if (latestFollowersCount.value !== null) {
      return `${((data.like_count + data.comments_count) / latestFollowersCount.value) * 100}%`
    }
    return null
  }

  const sortedMedias = computed(() => (by, order = 'asc') => {
    const medias = orderBy(activeAccountData.value.medias.map(data => ({
      ...data,
      engagement_rate: getMediaEngagementRate(data),
    })), [o => {
      if (by === 'reach') {
        return o.insights[by]
      }
      return o[by]
    }, 'timestamp'], [order, order === 'asc' ? 'desc' : 'asc'])
    return take(medias, 10)
  })

  const getMediaComments = mediaId => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountMediaComments', mediaId)
      .then(response => resolve(response.data))
      .catch(() => resolve([]))
  })

  const getMediaSentiment = mediaId => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountMediaSentiment', mediaId)
      .then(response => resolve(response.data))
      .catch(() => resolve({ neg: 0, pos: 0, neu: 0 }))
  })

  const getMediaSentimentPercentage = ({ neg, pos, neu }) => {
    const total = neg + pos + neu
    return {
      neg: neg ? `${((neg / total) * 100).toFixed(0)}%` : '0%',
      pos: pos ? `${((pos / total) * 100).toFixed(0)}%` : '0%',
      neu: neu ? `${((neu / total) * 100).toFixed(0)}%` : '0%',
    }
  }

  const resolveCommentBadgeOptions = sentiment => {
    if (sentiment === 'pos') return { variant: 'light-success', color: null, backgroundColor: null }
    if (sentiment === 'neu') return { variant: null, color: '#7A62F9', backgroundColor: '#7A62F91F' }
    if (sentiment === 'neg') return { variant: 'light-danger', color: null, backgroundColor: null }
    return { variant: null, color: null, backgroundColor: null }
  }

  const resolveCommentSentiment = sentiment => {
    if (sentiment === 'pos') return 'Positif'
    if (sentiment === 'neu') return 'Netral'
    if (sentiment === 'neg') return 'Negatif'
    return ''
  }

  return {
    activeAccountData,
    latestFollowersCount,
    sortedMedias,
    getMediaComments,
    getMediaEngagementRate,
    getMediaSentiment,
    getMediaSentimentPercentage,
    resolveCommentBadgeOptions,
    resolveCommentSentiment,
  }
}
