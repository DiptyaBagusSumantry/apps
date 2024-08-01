import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import { title, formatDate } from '@core/utils/filter'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useUsersList() {
  // Use toast
  const toast = useToast()

  const refClaimedVoucherListCard = ref(null)
  const refClaimedVoucherListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    {
      key: 'user',
      label: 'Nama User',
      formatter: title,
    },
    {
      key: 'code',
      label: 'Kode Kupon',
    },
    {
      key: 'name',
      label: 'Nama Channel',
    },
    {
      key: 'redeemed',
      label: 'Tanggal Redeem',
      sortable: true,
      formatter: v => formatDate(v, { year: 'numeric', month: 'long', day: '2-digit' }),
    },
  ]
  const perPage = ref(5)
  const totalClaimedVouchers = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [5, 10, 25]
  const searchQuery = ref('')
  const sortBy = ref('redeemed')
  const isSortDirDesc = ref(true)

  const tableItems = ref([])

  const dataMeta = computed(() => {
    const localItemsCount = refClaimedVoucherListTable.value ? refClaimedVoucherListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalClaimedVouchers.value,
    }
  })

  const refreshData = () => {
    refClaimedVoucherListTable.value.refresh()
  }

  const fetchClaimedVouchers = () => store
    .dispatch('app-voucher/fetchRedeemedVouchers', {
      ordering: `${isSortDirDesc.value ? '-' : ''}${sortBy.value}`,
      search: searchQuery.value,
      page_size: perPage.value,
      page: currentPage.value,
    })
    .then(response => {
      const { results: claimedVouchers, count: total } = response.data

      tableItems.value = claimedVouchers
      totalClaimedVouchers.value = total

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
    .finally(() => {
      refClaimedVoucherListCard.value.showLoading = false
      refreshData()
    })

  watch([sortBy, isSortDirDesc, searchQuery, perPage, currentPage], () => {
    fetchClaimedVouchers()
  })

  return {
    tableColumns,
    tableItems,
    perPage,
    currentPage,
    totalClaimedVouchers,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refClaimedVoucherListCard,
    refClaimedVoucherListTable,

    fetchClaimedVouchers,
  }
}
