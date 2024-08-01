import {
  values, reduce, uniqBy, groupBy,
} from 'lodash'

export default {
  dateQueryParams: state => {
    const dateQueryParams = {}
    if (state.dataFrameOptions.includes(state.dateFilter)) {
      // Date frame
      const { dateFilter } = state
      dateQueryParams.date_frame = dateFilter
    } else if (state.dateFilter.length === 2) {
      // Rate range
      const [startDate, endDate] = state.dateFilter.map(date => new Date(date))
      dateQueryParams.start = new Date(startDate.setHours(0, 0, 0)).toISOString()
      dateQueryParams.end = new Date(endDate.setHours(23, 59, 59)).toISOString()
    }
    return dateQueryParams
  },
  transformMediaData: () => media => {
    const insights = {}
    media.insights.forEach(insight => {
      /* eslint-disable default-case */
      switch (insight.metric) {
        case 'carousel_album_engagement':
          insights.engagement = insight.value
          break
        case 'carousel_album_impressions':
          insights.impressions = insight.value
          break
        case 'carousel_album_reach':
          insights.reach = insight.value
          break
        case 'engagement':
          insights.engagement = insight.value
          break
        case 'impressions':
          insights.impressions = insight.value
          break
        case 'reach':
          insights.reach = insight.value
          break
        case 'saved':
          insights.saved = insight.value
          break
      }
      /* eslint-enable */
    })
    media.insights = insights
    return media
  },
  transformMediasData: (state, getters) => medias => {
    medias.forEach(media => getters.transformMediaData(media))
    return medias
  },
  transformMediaEngagementData: () => engagementData => values(reduce(reduce(Object.values(
    groupBy(engagementData, data => new Date(data.updated_timestamp).toLocaleDateString()),
  ), (result, data) => [...result, ...uniqBy(data.reverse(), 'media')], []), (result, data) => {
    const updatedDatestamp = new Date(data.updated_timestamp).toLocaleDateString()
    const name = updatedDatestamp
    result[name] = {
      count: 1 + (result[name] ? result[name].count : 0),
      like_count: data.like_count + (result[name] ? result[name].like_count : 0),
      comments_count: data.comments_count + (result[name] ? result[name].comments_count : 0),
      like_count_growth: (data.like_count_growth === null ? data.like_count : data.like_count_growth) + (result[name] ? result[name].like_count_growth : 0),
      comments_count_growth: (data.comments_count_growth === null ? data.comments_count : data.comments_count_growth) + (result[name] ? result[name].comments_count_growth : 0),
      updated_datestamp: updatedDatestamp,
    }
    return result
  }, {})),
  dateFilterDiffInDay: state => {
    if (state.dataFrameOptions.includes(state.dateFilter)) {
      return Number(state.dateFilter)
    }
    const dateRange = state.dateFilter.map(date => new Date(date))
    return ((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 3600 * 24)) + 1
  },
  getDateListByDateFilter: (state, getters) => () => {
    let diffInDay = getters.dateFilterDiffInDay
    let endDate = new Date() // today
    if (!state.dataFrameOptions.includes(state.dateFilter)) {
      const dateRange = state.dateFilter.map(date => new Date(date));
      ([, endDate] = dateRange)
    }
    const dates = []
    endDate.setDate(endDate.getDate() + 1)
    while (diffInDay > 0) {
      dates.push(endDate.setDate(endDate.getDate() - 1))
      diffInDay -= 1
    }
    return dates.reverse()
  },
  dateFilterWording: state => {
    if (state.dataFrameOptions.includes(state.dateFilter)) {
      return `dalam ${state.dateFilter} hari terakhir.`
    }
    if (state.dateFilter.length === 2) {
      let [startDate, endDate] = state.dateFilter.map(date => new Date(date))
      const datestampOptions = { year: 'numeric', month: 'short', day: '2-digit' }
      startDate = new Date(startDate).toLocaleDateString('id-ID', datestampOptions)
      endDate = new Date(endDate).toLocaleDateString('id-ID', datestampOptions)
      return `pada tanggal ${startDate}-${endDate}`
    }
    return ''
  },
  getUserAccountById: state => id => {
    const userAccount = state.userAccountList.find(account => account.id === id)
    if (userAccount) return userAccount
    return {}
  },
  userAccountList: state => state.userAccountList,
  getUserCompetitorList: state => state.userCompetitorList,
  activeAccountData: state => state.activeAccount,
  dateFilter: state => state.dateFilter,
}
