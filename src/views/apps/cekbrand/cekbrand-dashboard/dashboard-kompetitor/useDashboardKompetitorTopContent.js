import { ref, computed } from '@vue/composition-api'
import store from '@/store'

const defaultThumbnailImage = require('@/assets/images/pages/cekbrand/dashboard/video-not-found.svg')
const defaultMediaImage = require('@/assets/images/pages/cekbrand/dashboard/data-not-found.png')

export default function useDashboardKompetitorTopContent() {
  // Refs
  const topContentData = ref({})

  // Computed
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const latestFollowersCount = computed(() => {
    const latestUserData = activeAccountData.value.userData[activeAccountData.value.userData.length - 1]
    return latestUserData ? latestUserData.followers_count : null
  })

  // Methods
  const resolveMediaType = data => {
    switch (data.media_type) {
      case 'VIDEO':
        return 'Video'
      case 'CAROUSEL_ALBUM':
        return 'Carousel'
      case 'IMAGE':
        return 'Gambar'
      default:
        return data.media_type
    }
  }

  const resolveMediaURL = data => {
    switch (data.media_type) {
      case 'VIDEO':
        return data.thumbnail_url ? data.thumbnail_url : defaultThumbnailImage
      default:
        return data.media_url ? data.media_url : defaultMediaImage
    }
  }

  const getLikeCountGrowth = (mediaData, mediaDataBefore) => {
    if (!mediaData) return null
    if (!mediaDataBefore) return null
    return mediaData.like_count - mediaDataBefore.like_count
  }

  const getCommentsCountGrowth = (mediaData, mediaDataBefore) => {
    if (!mediaData) return null
    if (!mediaDataBefore) return null
    return mediaData.comments_count - mediaDataBefore.comments_count
  }

  const getEngagement = media => media.comments_count + media.like_count

  const getEngagementRate = (media, followersCount) => {
    if (followersCount === null) return null
    if (followersCount === 0) return 0
    const engagement = getEngagement(media)
    const engagementRate = engagement / followersCount
    return `${engagementRate * 100}%`
  }

  const getEngagementRateGrowth = (mediaData, mediaDataBefore) => {
    if (latestFollowersCount.value === null) return null
    if (!mediaData) return null
    if (!mediaDataBefore) return null
    const mediaDataEngagementRate = getEngagementRate(mediaData, latestFollowersCount.value)
    const mediaDataBeforeEngagementRate = getEngagementRate(mediaDataBefore, latestFollowersCount.value)
    return `${parseFloat(mediaDataEngagementRate) - parseFloat(mediaDataBeforeEngagementRate)}%`
  }

  const getAccountTopContent = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchActiveAccountMediaSummary')
      .then(response => {
        const {
          highest_engagement_media: bestMedia,
          highest_engagement_media_before: bestMediaBefore,
        } = response.data

        if (!bestMedia) {
          resolve(null)
          return
        }

        const data = {
          ...store.getters['cekbrand/transformMediaData'](bestMedia),
          media_url: resolveMediaURL(bestMedia),
          media_type: resolveMediaType(bestMedia),
          engagement_rate: getEngagementRate(bestMedia, latestFollowersCount.value),
        }

        data.likeCountGrowth = getLikeCountGrowth(bestMedia, bestMediaBefore)
        data.commentsCountGrowth = getCommentsCountGrowth(bestMedia, bestMediaBefore)
        data.engagementRateGrowth = getEngagementRateGrowth(bestMedia, bestMediaBefore)

        resolve(data)
      })
      .catch(() => {
        resolve(null)
      })
  })

  const getCompetitorAccountTopContent = competitor => new Promise(resolve => {
    if (!competitor || !competitor.id) {
      resolve(null)
      return
    }

    store.dispatch('cekbrand/fetchActiveAccountCompetitorMediaSummary', {
      competitorId: competitor.id,
    })
      .then(response => {
        const {
          best_media: bestMedia,
          best_media_before: bestMediaBefore,
        } = response.data

        if (!bestMedia) {
          resolve(null)
          return
        }
        const data = {
          user: {
            name: competitor.name,
            profile_picture_url: competitor.profile_picture_url,
          },
          ...bestMedia,
          media_url: resolveMediaURL(bestMedia),
          media_type: resolveMediaType(bestMedia),
        }

        data.likeCountGrowth = getLikeCountGrowth(bestMedia, bestMediaBefore)
        data.commentsCountGrowth = getCommentsCountGrowth(bestMedia, bestMediaBefore)
        data.engagementRateGrowth = bestMedia && bestMediaBefore && bestMedia.engagement_rate && bestMediaBefore.engagement_rate
          ? `${parseFloat(bestMedia.engagement_rate) - parseFloat(bestMediaBefore.engagement_rate)}%` : null

        resolve(data)
      })
      .catch(() => {
        resolve(null)
      })
  })

  return {
    // Refs
    topContentData,

    // Computed
    activeAccountData,

    // Methods
    getAccountTopContent,
    getCompetitorAccountTopContent,
  }
}
