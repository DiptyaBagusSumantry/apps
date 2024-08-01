import { computed, ref } from '@vue/composition-api'
import { Indonesian as IndonesiaLocale } from 'flatpickr/dist/l10n/id'
import 'vue-flatpickr-component'
import { formatDate } from '@core/utils/filter'
import store from '@/store'

export default function useDateFilter() {
  // Computed
  const activeAccountData = computed(() => store.getters['cekbrand/activeAccountData'])
  const dateFilter = computed(() => store.state.cekbrand.dateFilter)
  const dataFrameOptions = computed(() => store.state.cekbrand.dataFrameOptions)
  const configdateTimePicker = computed(() => {
    const today = new Date()
    const maxDate = new Date(today.setHours(23, 59, 59))
    let minDate = new Date(today.fp_incr(-89).setHours(0, 0, 0))
    if (activeAccountData.value.mediaSummary) {
      const { earliest_media: earliestMedia } = activeAccountData.value.mediaSummary
      if (earliestMedia.timestamp) {
        const mediaTimestamp = new Date(earliestMedia.timestamp)
        if (mediaTimestamp >= minDate) {
          minDate = mediaTimestamp
        }
      }
    }

    return {
      mode: 'range',
      minDate,
      maxDate,
      dateFormat: 'd/m/Y',
      locale: IndonesiaLocale,
    }
  })
  const diffInDay = computed(() => store.getters['cekbrand/dateFilterDiffInDay'])

  // References
  const selectedDateRange = ref(null)

  // Methods
  const updateDateFilter = filter => store.dispatch('cekbrand/updateDateFilter', filter)

  /**
   * Return date range for display
   * @param {String|Array[Date]} filter dateFilter value from cekbrand state
   */
  const resolveDateRange = (filter = dateFilter.value) => {
    // For date frame
    let endDate = new Date()
    let startDate = endDate
    if (dataFrameOptions.value.includes(filter)) {
      endDate = new Date()
      startDate = endDate.fp_incr(-Number(filter) + 1)
    } else {
      ([startDate, endDate] = filter.map(date => new Date(date)))
    }

    const format = { year: 'numeric', month: 'short', day: '2-digit' }
    startDate = formatDate(startDate, format)
    endDate = formatDate(endDate, format)
    if (startDate === endDate) {
      return endDate
    }
    return `${startDate} - ${endDate}`
  }

  /**
   * Return date filter for display
   * @param {String|Array[Date]} filter dateFilter value from cekbrand state
   */
  const resolveDateFilter = filter => {
    if (dataFrameOptions.value.includes(filter)) {
      selectedDateRange.value = null
      return `${filter} Hari Terakhir`
    }

    // Date range display
    return resolveDateRange(filter)
  }

  const onDateRangeSelected = dateRange => {
    if (dateRange === dateFilter.value) return
    if (dateRange.length === 2) {
      updateDateFilter(dateRange)
    }
  }

  const isDateFilterActive = (val = null) => {
    if (dateFilter.value === val) return true
    if (!dataFrameOptions.value.includes(val) && selectedDateRange.value !== null) return true
    return false
  }

  return {
    // Computed
    dateFilter,
    dataFrameOptions,
    configdateTimePicker,
    diffInDay,

    // Refs
    selectedDateRange,

    // Methods
    updateDateFilter,
    onDateRangeSelected,

    // UI
    resolveDateFilter,
    resolveDateRange,
    isDateFilterActive,
  }
}
