import {
  ref, watch, computed, reactive,
} from '@vue/composition-api'
import store from '@/store'
import { paginateArray, sortCompare } from '@/@core/utils/utils'
import { formatDate } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

// SweetAlert
import Swal from 'sweetalert2'

export default function useVouchersList() {
  // Use toast
  const toast = useToast()

  const refVoucherListCard = ref(null)
  const refVoucherListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'code', label: 'Kode Kupon', sortable: true },
    { key: 'name', label: 'Nama Channel', sortable: true },
    {
      key: 'created_at',
      label: 'Tanggal Dibuat',
      sortable: true,
      formatter: v => formatDate(v, { year: 'numeric', month: 'long', day: '2-digit' }),
    },
    { key: 'usage_count', label: 'Jumlah Pemakaian', sortable: true },
    { key: 'actions', label: '' },
  ]
  const perPage = ref(10)
  const blankVoucher = {
    id: null,
    code: '',
    name: '',
  }
  const voucher = ref(JSON.parse(JSON.stringify(blankVoucher)))
  const vouchers = ref([])
  const totalVouchers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)

  const tableItems = computed(() => {
    let localItems = vouchers.value
    if (searchQuery !== '') {
      const queryLowered = searchQuery.value.toLowerCase()
      localItems = vouchers.value.filter(v => (v.code.toLowerCase().includes(queryLowered) || v.name.toLowerCase().includes(queryLowered)))
    }
    totalVouchers.value = localItems.length
    localItems.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return paginateArray(localItems, perPage.value, currentPage.value)
  })

  const dataMeta = computed(() => {
    const localItemsCount = refVoucherListTable.value ? refVoucherListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalVouchers.value,
    }
  })

  // Chart
  const generateColors = dataLength => {
    const colors = []
    for (let i = 0; i < dataLength; i++) {
      const r = Math.floor(Math.random() * 255)
      const g = Math.floor(Math.random() * 255)
      const b = Math.floor(Math.random() * 255)

      colors[i] = `rgb(${r}, ${g}, ${b})`
    }
    return colors
  }
  const sortedVouchers = ref([])
  const voucherChartSeries = ref([])
  const voucherChartOptions = ref({
    colors: [],
    labels: [],
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem',
                  },
                  value: {
                    fontSize: '1rem',
                  },
                  total: {
                    fontSize: '1.5rem',
                  },
                },
              },
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  })
  const voucherChart = reactive({
    series: voucherChartSeries,
    chartOptions: voucherChartOptions,
  })

  const refreshData = () => {
    refVoucherListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery], () => {
    refreshData()
  })

  const fetchVouchers = () => store
    .dispatch('app-voucher/fetchVouchers')
    .then(response => {
      vouchers.value = response.data
      totalVouchers.value = response.data.length

      // Chart
      sortedVouchers.value = vouchers.value.sort(sortCompare('usage_count')).reverse()
      voucherChartOptions.value = {
        ...voucherChartOptions.value,
        colors: generateColors(totalVouchers.value),
        labels: sortedVouchers.value.map(v => v.name),
      }
      voucherChartSeries.value = sortedVouchers.value.map(v => v.usage_count)

      refreshData()
    })
    .catch(() => {
      toast({
        component: ToastificationContent,
        props: {
          title: 'Error fetching vouchers list',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
        },
      })
    })
    .finally(() => { refVoucherListCard.value.showLoading = false })

  const addVoucher = val => store
    .dispatch('app-voucher/addVoucher', val)
    .then(() => {
      Swal.fire({
        title: 'Kupon Berhasil Dibuat',
        text: `Anda berhasil membuat kupon dengan nama channel "${val.name}"`,
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    })

  const updateVoucher = voucherData => store
    .dispatch('app-voucher/updateVoucher', { voucher: voucherData })
    .then(() => {
      Swal.fire({
        title: 'Kupon Berhasil Diubah',
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    })

  const removeVoucher = () => store
    .dispatch('app-voucher/removeVoucher', { id: voucher.value.id })
    .then(async () => {
      await fetchVouchers()

      Swal.fire({
        title: 'Kupon Berhasil Dihapus',
        text: `Anda berhasil menghapus kupon ${voucher.value.code}`,
        icon: 'success',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    })
    .catch(() => {
      toast({
        component: ToastificationContent,
        props: {
          title: 'Error deleting voucher',
          icon: 'AlertTriangleIcon',
          variant: 'danger',
        },
      })
    })

  return {
    tableColumns,
    tableItems,
    perPage,
    currentPage,
    blankVoucher,
    voucher,
    vouchers,
    sortedVouchers,
    totalVouchers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refVoucherListCard,
    refVoucherListTable,

    fetchVouchers,
    addVoucher,
    updateVoucher,
    removeVoucher,

    // Chart
    voucherChart,
  }
}
