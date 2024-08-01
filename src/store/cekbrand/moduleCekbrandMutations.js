export default {
  UPDATE_ACTIVE_ACCOUNT_DATA(state, payload) {
    state.activeAccount = { ...state.activeAccount, ...payload }
  },
  IS_FETCH_ACTIVE_ACCOUNT_DATA_ON_PROGRESS(state, val) {
    state.isFetchActiveAccountDataOnProgress = val
  },
  SET_USER_ACCOUNTS_LIST(state, data) {
    state.userAccountList = data
  },
  SET_USER_COMPETITORS_LIST(state, data) {
    state.userCompetitorList = data
  },
  ADD_USER_COMPETITOR(state, data) {
    state.userCompetitorList.push(data)
  },
  REMOVE_USER_COMPETITOR(state, competitorId) {
    const dataIndex = state.userCompetitorList.findIndex(data => data.id === competitorId)
    state.userCompetitorList.splice(dataIndex, 1)
  },
  REMOVE_USER_ACCOUNT(state, accountId) {
    const dataIndex = state.userAccountList.findIndex(a => a.id === accountId)
    state.userAccountList.splice(dataIndex, 1)
  },
  UPDATE_DATE_FILTER(state, filter) {
    state.dateFilter = filter
  },
  // Updates cekBrand info in state and localstorage
  UPDATE_CEKBRAND_STORAGE_INFO(state, payload) {
    // Get Data localStorage
    const cekBrandLocalInfo = JSON.parse(localStorage.getItem('cekBrandInfo')) || state.cekBrandLocalInfo

    Object.keys(payload).forEach(property => {
      if (payload[property] !== null) {
        // If some of user property is null - user default property defined in state.cekBrandLocalInfo
        state.cekBrandLocalInfo[property] = payload[property]

        // Update key in localStorage
        cekBrandLocalInfo[property] = payload[property]
      }
    })

    // Store data in localStorage
    localStorage.setItem('cekBrandInfo', JSON.stringify(cekBrandLocalInfo))
  },
  UPDATE_CEKBRAND_SESSION_INFO(state, payload) {
    // Get Data sessionStorage
    const cekBrandSessionInfo = JSON.parse(sessionStorage.getItem('cekBrandInfo')) || state.cekBrandSessionInfo

    Object.keys(payload).forEach(property => {
      // If some of user property is null - user default property defined in state.cekBrandInfo
      state.cekBrandSessionInfo[property] = payload[property]

      if (payload[property] !== null) {
        // Update key in sessionStorage
        cekBrandSessionInfo[property] = payload[property]
      }
    })

    // Store data in sessionStorage
    sessionStorage.setItem('cekBrandInfo', JSON.stringify(cekBrandSessionInfo))
  },
}
