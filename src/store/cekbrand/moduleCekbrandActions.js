import axios from '@axios'

export default {
  fetchUserAccountsList({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get('restapi/cekbrand/accounts')
        .then(response => {
          commit('SET_USER_ACCOUNTS_LIST', response.data)
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccount(context, accountId) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  removeUserAccount({ commit }, accountId) {
    return new Promise((resolve, reject) => {
      axios.delete(`restapi/cekbrand/accounts/${accountId}`)
        .then(response => {
          commit('REMOVE_USER_ACCOUNT', accountId)
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMediaComments(context, { accountId, mediaId }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/${mediaId}/comments`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMedias(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMediaSentiment(context, { accountId, mediaId }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/${mediaId}/sentiment`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountUserData(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/user-data`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountUserDataSummary(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/user-data/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMediaSummary(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountInsightsReach(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/reach`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountInsightsImpressions(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/impressions`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountInsightReachAverageSummary(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/reach/average/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountInsightsImpressionsAverageSummary(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/impressions/average/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountHashtagMetrics(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/hashtag-metrics`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMediaEngagement(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/engagement`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMediaEngagementSummary(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/engagement/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountMediaEngagementAverageSummary(context, { accountId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/engagement/average/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  startFetchUserAccountData({ commit }) {
    commit('IS_FETCH_ACTIVE_ACCOUNT_DATA_ON_PROGRESS', true)
  },
  endFetchUserAccountData({ commit }) {
    commit('IS_FETCH_ACTIVE_ACCOUNT_DATA_ON_PROGRESS', false)
  },
  fetchUserAccountData({ getters, dispatch, commit }, accountId) {
    const queryParams = getters.dateQueryParams

    dispatch('startFetchUserAccountData')
    return new Promise((resolve, reject) => {
      Promise.all([
        dispatch('fetchUserAccount', accountId),
        dispatch('fetchUserAccountMedias', { accountId, queryParams }),
        dispatch('fetchUserAccountUserData', { accountId, queryParams }),
        dispatch('fetchUserAccountMediaSummary', { accountId }),
        dispatch('fetchUserAccountMediaEngagementAverageSummary', { accountId, queryParams }),
        dispatch('fetchUserAccountHashtagMetrics', { accountId, queryParams }),
      ])
        .then(responses => {
          const [account, medias, userData, mediaSummary, mediaEngagementSummary, hashtagMetrics] = responses.map(response => response.data)
          const responsesData = {
            ...account,
            medias: getters.transformMediasData(medias),
            userData,
            mediaSummary,
            mediaEngagementSummary,
            hashtagMetrics,
          }
          commit('UPDATE_ACTIVE_ACCOUNT_DATA', responsesData)
          resolve(responsesData)
        })
        .catch(error => reject(error))
        .finally(() => dispatch('endFetchUserAccountData'))
    })
  },
  fetchActiveAccountUserDataSummary({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountUserDataSummary', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountEngagementRateStandartValue({ state, getters }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/media/engagement-rate-standart-value`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightsReach({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountInsightsReach', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightReachAverageSummary({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountInsightReachAverageSummary', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightsImpressions({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountInsightsImpressions', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightsImpressionsAverageSummary({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountInsightsImpressionsAverageSummary', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightsAudienceGenderAge({ state, getters }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/audience-gender-age`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightOnlineFollowers({ state, getters }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/online-followers`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightAudienceCity({ state, getters }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/audience-city`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountInsightAudienceCountry({ state, getters }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/insights/audience-country`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountMediaComments({ state, dispatch }, mediaId) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountMediaComments', { accountId, mediaId })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountMediaEngagement({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountMediaEngagement', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountMediaEngagementSummary({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountMediaEngagementSummary', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountMediaSentiment({ state, dispatch }, mediaId) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountMediaSentiment', { accountId, mediaId })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountMediaSummary({ state, getters, dispatch }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      dispatch('fetchUserAccountMediaSummary', { accountId, queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountCompetitorsList({ commit, state, getters }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/competitor-accounts`, { params: getters.dateQueryParams })
        .then(response => {
          commit('SET_USER_COMPETITORS_LIST', response.data)
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountCompetitorUserData(context, { accountId, competitorId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/competitor-accounts/${competitorId}/user-data`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserAccountCompetitorMediaEngagementSummary(context, { accountId, competitorId, queryParams }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/competitor-accounts/${competitorId}/media/engagement/average/summary`, { params: queryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountCompetitorData({ state, getters, dispatch }, { competitorId }) {
    const accountId = state.activeAccount.id
    const queryParams = getters.dateQueryParams
    return new Promise((resolve, reject) => {
      Promise.all([
        dispatch('fetchUserAccountCompetitorUserData', { accountId, competitorId, queryParams }),
        dispatch('fetchUserAccountCompetitorMediaEngagementSummary', { accountId, competitorId, queryParams }),
      ])
        .then(responses => {
          const [userData, mediaEngagementSummary] = responses.map(response => response.data)
          const responsesData = {
            userData,
            mediaEngagementSummary,
          }
          resolve(responsesData)
        })
        .catch(error => reject(error))
    })
  },
  fetchActiveAccountCompetitorMediaSummary({ state, getters }, { competitorId }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/competitor-accounts/${competitorId}/media/summary`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchActiveAccountCompetitorHashtagMetrics({ state, getters }, { competitorId }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/accounts/${accountId}/competitor-accounts/${competitorId}/hashtag-metrics`, { params: getters.dateQueryParams })
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  addActiveAccountCompetitor({ state, commit }, { competitorUsername }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.post(`restapi/cekbrand/accounts/${accountId}/competitor-accounts`, { username: competitorUsername })
        .then(response => {
          commit('ADD_USER_COMPETITOR', response.data)
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  removeActiveAccountCompetitor({ state, commit }, { competitorId }) {
    const accountId = state.activeAccount.id
    return new Promise((resolve, reject) => {
      axios.delete(`restapi/cekbrand/accounts/${accountId}/competitor-accounts/${competitorId}`)
        .then(response => {
          commit('REMOVE_USER_COMPETITOR', competitorId)
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  updateDateFilter({ state, commit, dispatch }, payload) {
    commit('UPDATE_DATE_FILTER', payload)

    const accountId = state.activeAccount.id
    dispatch('fetchUserAccountData', accountId)
  },
  downloadActiveAccountData({ state, getters }, {
    fileName, fileExtension, fileType,
  }) {
    const accountId = state.activeAccount.id
    let url = `restapi/cekbrand/accounts/${accountId}/download/${fileExtension}`
    if (fileExtension === 'csv') url = url.concat(`/${fileType}`)
    return new Promise((resolve, reject) => {
      axios({
        url,
        params: getters.dateQueryParams,
        method: 'GET',
        responseType: 'blob',
      })
        .then(response => {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(new Blob([response.data]))
          link.setAttribute('download', `${fileName}.${fileExtension}`)
          document.body.appendChild(link)
          link.click()
          resolve(response)
        })
        .catch(error => { reject(error) })
    })
  },
  fetchInstagramData(context, { accountId, payload }) {
    return new Promise((resolve, reject) => {
      axios.post(`restapi/cekbrand/instagram-graph-api/fetch-instagram-data/${accountId}`, payload)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  startFetchInstagramDataProcess({ commit }) {
    commit('UPDATE_CEKBRAND_STORAGE_INFO', { isFetchInstagramDataOnProgress: true })
  },
  endFetchInstagramDataProcess({ commit }) {
    commit('UPDATE_CEKBRAND_STORAGE_INFO', { isFetchInstagramDataOnProgress: false })
  },
  reAuthorization({ dispatch }, { socialAccountId }) {
    dispatch('startReAuthorizationProcess')
    return new Promise((resolve, reject) => {
      axios.put(`restapi/cekbrand/instagram-graph-api/re-authorization/${socialAccountId}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
        .finally(() => dispatch('endReAuthorizationProcess'))
    })
  },
  startReAuthorizationProcess({ commit }) {
    commit('UPDATE_CEKBRAND_STORAGE_INFO', { isReAuthorizationOnProgress: true })
  },
  endReAuthorizationProcess({ commit }) {
    commit('UPDATE_CEKBRAND_STORAGE_INFO', { isReAuthorizationOnProgress: false })
  },
  fetchInstagramBusiness(context, username) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/instagram-graph-api/instagram-business/${username}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  fetchCityCoordinate(context, city, country = 'world') {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/cekbrand/cities-coordinate/${country.toLowerCase()}/${city.toLowerCase()}`)
        .then(response => resolve(response))
        .catch(error => reject(error))
    })
  },
  connectSocialAccount(context, provider) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/user/auth/${provider}/login/?process=connect`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserSocialAccountsList(context, provider) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/user/socialaccounts?provider=${provider}`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  fetchUserSocialAccount(context, { socialAccountId, provider = 'facebook' }) {
    return new Promise((resolve, reject) => {
      axios.get(`restapi/user/socialaccounts/${socialAccountId}?provider=${provider}`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
  removeUserSocialAccount(context, { accountId, provider }) {
    return new Promise((resolve, reject) => {
      axios.delete(`restapi/user/socialaccounts/${accountId}?provider=${provider}`)
        .then(response => { resolve(response) })
        .catch(error => { reject(error) })
    })
  },
}
