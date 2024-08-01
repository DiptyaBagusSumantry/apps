const cekBrandInfoLocalStorage = JSON.parse(localStorage.getItem('cekBrandInfo')) || {}

const getCekBrandLocalInfo = () => {
  const cekBrandLocalInfo = {}

  // Update property in cekBrandLocalInfo
  Object.keys(cekBrandInfoLocalStorage).forEach(key => {
    // If property is defined in localStorage => Use that
    cekBrandLocalInfo[key] = cekBrandInfoLocalStorage[key]
  })

  return cekBrandLocalInfo
}

const cekBrandInfoSessionStorage = JSON.parse(sessionStorage.getItem('cekBrandInfo')) || {}

const getCekBrandSessionInfo = () => {
  const cekBrandSessionInfo = {}

  // Update property in cekBrandSessionInfo
  Object.keys(cekBrandInfoSessionStorage).forEach(key => {
    // If property is defined in sessionStorage => Use that
    cekBrandSessionInfo[key] = cekBrandInfoSessionStorage[key]
  })

  return cekBrandSessionInfo
}

const state = {
  activeAccount: {},
  userAccountList: [],
  userCompetitorList: [],

  dataFrameOptions: ['7', '28', '60', '90'],
  dateFilter: '7',

  cekBrandLocalInfo: getCekBrandLocalInfo(),
  cekBrandSessionInfo: getCekBrandSessionInfo(),

  isFetchActiveAccountDataOnProgress: false,
}

export default state
