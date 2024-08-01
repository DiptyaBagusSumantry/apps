import { ref, computed } from '@vue/composition-api'
import { formatDate } from '@core/utils/filter'
import { $themeBreakpoints } from '@themeConfig'
import 'vue-flatpickr-component'
import store from '@/store'

export default function useDashboardKompetitor(props, context) {
  // ref
  const selectedCompetitor1 = ref({})
  const selectedCompetitor2 = ref({})
  const selectedCompetitor3 = ref({})
  const containerWidth = ref(0)
  const offsetTopSelector = ref(0)
  const isSelectorSticky = ref(false)

  // Computed
  const dateFilter = computed(() => store.state.cekbrand.dateFilter)
  const dataFrameOptions = computed(() => store.state.cekbrand.dataFrameOptions)
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const userCompetitorList = computed(() => store.getters['cekbrand/getUserCompetitorList'])
  const windowWidth = computed(() => store.state.app.windowWidth)
  const diffInDay = computed(() => store.getters['cekbrand/dateFilterDiffInDay'])

  // Methods
  const isShow = value => {
    if (value === 2 && windowWidth.value <= 1450 && windowWidth.value <= 1155) return false
    if (value === 3 && windowWidth.value <= 1450 && windowWidth.value <= 1155) return false
    if (value === 4 && windowWidth.value <= 1450) return false
    return true
  }

  const fetchCompetitorsList = () => new Promise(resolve => {
    store.dispatch('cekbrand/fetchUserAccountCompetitorsList')
      .then(response => resolve(response.data))
      .catch(() => resolve([]))
  })

  const nFormatter = (num, digits) => {
    const lookup = [
      // { value: 1e0, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' },
    ]
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
    const item = lookup.slice().reverse().find(lookupItem => Math.abs(Number(num)) >= lookupItem.value)
    return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : num
  }

  const toPercent = (value, maxValue) => {
    if (!maxValue) return 0
    return (value / maxValue) * 100
  }

  const resolveDateFilter = key => {
    if (key === 'latestFollowersCount') {
      let endDate = new Date()
      if (!dataFrameOptions.value.includes(dateFilter.value)) {
        ([, endDate] = dateFilter.value.map(date => new Date(date)))
      }
      return formatDate(endDate.fp_incr(-1), { month: 'long', day: '2-digit' }, 'id-ID')
    }
    return `${diffInDay.value} hari sebelumnya`
  }

  const changeSelectedCompetitor = async selectedCompetitor => {
    const selectedCompetitorData = userCompetitorList.value.find(competitor => competitor.id === selectedCompetitor.data.id)
    if (selectedCompetitor.index === 1) selectedCompetitor1.value = (selectedCompetitorData) || {}
    else if (selectedCompetitor.index === 2) selectedCompetitor2.value = (selectedCompetitorData) || {}
    else if (selectedCompetitor.index === 3) selectedCompetitor3.value = (selectedCompetitorData) || {}
  }

  const getOffsetTop = element => {
    /* eslint-disable */
    let offsetTop = 0
    while (element) {
      offsetTop += element.offsetTop
      element = element.offsetParent
    }
    return offsetTop
    /* eslint-enable */
  }

  const changeOffsetTopSelectorAccountValue = () => {
    if (context.refs.refKompetitor) {
      containerWidth.value = context.refs.refKompetitor.clientWidth + 9
      if (!isSelectorSticky.value) {
        if (windowWidth.value < $themeBreakpoints.xl) offsetTopSelector.value = getOffsetTop(context.refs.refSelectKompetitor) - 20
        else offsetTopSelector.value = getOffsetTop(context.refs.refSelectKompetitor) - 80
      }
    }
  }

  const handleScroll = () => {
    containerWidth.value = context.refs.refKompetitor.clientWidth + 9
    if (window.pageYOffset >= offsetTopSelector.value) isSelectorSticky.value = true
    else isSelectorSticky.value = false
  }

  return {
    // Ref
    selectedCompetitor1,
    selectedCompetitor2,
    selectedCompetitor3,
    containerWidth,
    offsetTopSelector,
    isSelectorSticky,

    // Computed
    activeAccountData,
    dateFilter,
    userCompetitorList,
    windowWidth,

    // Method
    fetchCompetitorsList,
    isShow,
    nFormatter,
    toPercent,
    resolveDateFilter,
    changeSelectedCompetitor,
    changeOffsetTopSelectorAccountValue,
    handleScroll,
  }
}
